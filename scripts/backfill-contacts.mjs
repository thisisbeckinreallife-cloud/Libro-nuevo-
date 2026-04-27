#!/usr/bin/env node
// Backfill the unified Contact table from existing User and ReviewSubmission
// rows. Idempotent: re-runs are safe — they just refresh `lastSeenAt` and
// the `sources` set. Run once after deploying the contacts feature.
//
// Usage:
//   node scripts/backfill-contacts.mjs
//
// Reads DATABASE_URL from the environment. If not set, falls back to
// .env.local in the repo root.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Load DATABASE_URL from .env.local BEFORE importing @prisma/client —
// PrismaClient resolves the URL at import time, so a static import
// would lock in `undefined`.
if (!process.env.DATABASE_URL) {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const envPath = resolve(here, "..", ".env.local");
    const text = readFileSync(envPath, "utf8");
    const m = text.match(/^DATABASE_URL\s*=\s*"?([^"\n]+)"?/m);
    if (m) process.env.DATABASE_URL = m[1];
  } catch {
    // No .env.local — fall through; PrismaClient will error if URL missing.
  }
}

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

function normalise(email) {
  return String(email ?? "").trim().toLowerCase();
}

async function upsert({ email, source, name, when }) {
  const emailNorm = normalise(email);
  if (!emailNorm) return false;

  const existing = await prisma.contact.findUnique({
    where: { email: emailNorm },
    select: { id: true, sources: true, name: true, firstSeenAt: true },
  });

  if (existing) {
    const seen = new Set(
      existing.sources.split(",").map((s) => s.trim()).filter(Boolean),
    );
    seen.add(source);
    await prisma.contact.update({
      where: { email: emailNorm },
      data: {
        name: name ?? existing.name,
        sources: Array.from(seen).join(","),
        lastSource: source,
        // Keep firstSeenAt as the earliest date we've seen.
        firstSeenAt: when < existing.firstSeenAt ? when : existing.firstSeenAt,
      },
    });
    return false; // updated, not new
  }

  await prisma.contact.create({
    data: {
      email: emailNorm,
      name: name ?? null,
      firstSource: source,
      lastSource: source,
      sources: source,
      lang: "es", // historical rows: best-effort default
      consentMarketing: true,
      firstSeenAt: when,
      lastSeenAt: when,
    },
  });
  return true; // newly created
}

async function main() {
  console.log("[backfill] starting…");

  let createdFromUsers = 0;
  let updatedFromUsers = 0;
  const users = await prisma.user.findMany({
    select: { email: true, name: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  for (const u of users) {
    const isNew = await upsert({
      email: u.email,
      source: "workbook",
      name: u.name,
      when: u.createdAt,
    });
    if (isNew) createdFromUsers++;
    else updatedFromUsers++;
  }
  console.log(
    `[backfill] users → contacts: ${createdFromUsers} created, ${updatedFromUsers} updated`,
  );

  let createdFromReviews = 0;
  let updatedFromReviews = 0;
  let skippedNoEmail = 0;
  const reviews = await prisma.reviewSubmission.findMany({
    select: { email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  for (const r of reviews) {
    if (!r.email) {
      skippedNoEmail++;
      continue;
    }
    const isNew = await upsert({
      email: r.email,
      source: "resena",
      name: null,
      when: r.createdAt,
    });
    if (isNew) createdFromReviews++;
    else updatedFromReviews++;
  }
  console.log(
    `[backfill] reviews → contacts: ${createdFromReviews} created, ${updatedFromReviews} updated, ${skippedNoEmail} skipped (no email)`,
  );

  const total = await prisma.contact.count();
  console.log(`[backfill] done. ${total} contacts in the table.`);
}

main()
  .catch((err) => {
    console.error("[backfill] failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
