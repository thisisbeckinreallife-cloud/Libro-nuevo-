#!/usr/bin/env node
/**
 * Seed 100 bonus tokens and initialize the counter cache.
 *
 * Usage:
 *   DATABASE_URL=... node scripts/seed-tokens.mjs [--lot=ES-2026-A] [--count=100]
 *
 * Idempotent: safe to re-run. Existing tokens are NOT duplicated; if fewer than
 * --count rows exist, the script tops up to --count. Tokens are written to
 * ./tmp/tokens-<lot>-<timestamp>.csv for the printer handoff. The CSV is the
 * ONLY place the plaintext tokens appear — the DB stores them as-is (no hash)
 * because they are single-use and revocable.
 */

import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function parseArgs() {
  const args = Object.fromEntries(
    process.argv.slice(2).map((a) => {
      const [k, v] = a.replace(/^--/, "").split("=");
      return [k, v ?? true];
    }),
  );
  return {
    lot: String(args.lot ?? "ES-2026-A"),
    count: Number(args.count ?? 100),
  };
}

function makeToken() {
  return crypto.randomBytes(18).toString("base64url");
}

async function main() {
  const { lot, count } = parseArgs();
  const prisma = new PrismaClient();

  const existing = await prisma.bonusToken.count({ where: { bookLot: lot } });
  const toCreate = Math.max(0, count - existing);

  if (toCreate === 0) {
    console.log(`[seed] lot="${lot}" already has ${existing} tokens; nothing to do.`);
  } else {
    const rows = Array.from({ length: toCreate }, () => ({
      token: makeToken(),
      bookLot: lot,
    }));
    await prisma.bonusToken.createMany({ data: rows });
    console.log(`[seed] inserted ${toCreate} new tokens into lot="${lot}".`);

    const outDir = path.resolve("tmp");
    fs.mkdirSync(outDir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const csvPath = path.join(outDir, `tokens-${lot}-${ts}.csv`);
    const csv =
      "token,url\n" +
      rows
        .map(
          (r) =>
            `${r.token},${process.env.NEXT_PUBLIC_SITE_URL ?? "https://arkwrightmethod.com"}/reservar/${r.token}`,
        )
        .join("\n") +
      "\n";
    fs.writeFileSync(csvPath, csv);
    console.log(`[seed] wrote ${csvPath}`);
  }

  await prisma.counterCache.upsert({
    where: { id: 1 },
    create: { id: 1, claimedCount: 0 },
    update: {},
  });

  const total = await prisma.bonusToken.count();
  const claimed = await prisma.bonusToken.count({ where: { status: "claimed" } });
  console.log(`[seed] tokens total=${total} claimed=${claimed}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
