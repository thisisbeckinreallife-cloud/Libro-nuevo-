#!/usr/bin/env node
// Ensure every existing Purchase has a matching User row, so the
// /api/biblioteca/workbook-enter endpoint can issue a session in one
// hop. Idempotent — safe to re-run any time.
//
// Why this exists: the User upsert in the Stripe webhook is new code
// (added when we wired the workbook bridge). Any Purchase created
// BEFORE that change has no User. Run this once after deploy and
// you're done.
//
// Usage:
//   node scripts/backfill-purchase-users.mjs

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

if (!process.env.DATABASE_URL) {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const text = readFileSync(resolve(here, "..", ".env.local"), "utf8");
    const m = text.match(/^DATABASE_URL\s*=\s*"?([^"\n]+)"?/m);
    if (m) process.env.DATABASE_URL = m[1];
  } catch {
    /* fall through */
  }
}

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  console.log("[backfill-purchase-users] starting…");

  const purchases = await prisma.purchase.findMany({
    select: { id: true, email: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  let created = 0;
  let reused = 0;
  let skipped = 0;

  for (const p of purchases) {
    const emailNorm = String(p.email ?? "").trim().toLowerCase();
    if (!emailNorm) {
      skipped++;
      continue;
    }
    const before = await prisma.user.findUnique({
      where: { email: emailNorm },
      select: { id: true },
    });
    await prisma.user.upsert({
      where: { email: emailNorm },
      update: p.name ? { name: p.name } : {},
      create: { email: emailNorm, name: p.name?.trim() || null },
    });
    if (before) reused++;
    else created++;
  }

  console.log(
    `[backfill-purchase-users] done. ${created} users created, ${reused} reused, ${skipped} skipped (no email).`,
  );
} catch (err) {
  console.error("[backfill-purchase-users] failed:", err);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
