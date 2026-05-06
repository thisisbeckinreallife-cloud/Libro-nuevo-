#!/usr/bin/env node
// Manually issue a /biblioteca access URL without going through Stripe.
//
// Why: useful for QA, beta testers, comp copies, friends-and-family,
// and as a backup recovery path if Stripe ever has an outage.
//
// Usage:
//   node scripts/create-test-purchase.mjs --email name@example.com [--name "Lara"] [--lang es]
//
// Output: a `/biblioteca?token=...` URL the recipient can open.
// The Purchase row is created with `status=paid` and a fake
// `stripeSessionId` (`manual_<timestamp>_<random>`) so it never
// collides with a real Stripe session.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

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

const args = parseArgs(process.argv.slice(2));
if (!args.email) {
  console.error(
    "[create-test-purchase] missing --email. usage: --email <addr> [--name <str>] [--lang es|en]",
  );
  process.exit(2);
}

const lang = args.lang === "en" ? "en" : "es";
const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://arkwright.laralawn.com").replace(
    /\/$/,
    "",
  );

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  const accessToken = randomUUID();
  const ts = Date.now();
  const stripeSessionId = `manual_${ts}_${Math.random().toString(36).slice(2, 10)}`;

  const purchase = await prisma.purchase.create({
    data: {
      email: args.email.trim().toLowerCase(),
      name: args.name?.trim() || null,
      stripeSessionId,
      stripePaymentIntentId: null,
      amount: 1200, // 12.00 EUR — informational, not charged
      currency: "eur",
      status: "paid",
      accessToken,
      lang,
      paidAt: new Date(),
      meta: { issuedBy: "create-test-purchase.mjs", issuedAt: new Date().toISOString() },
    },
    select: { id: true, email: true, accessToken: true },
  });

  // Mirror into Contact like the webhook does, so the email lands in
  // the marketing list as if Stripe had triggered it.
  try {
    const existing = await prisma.contact.findUnique({
      where: { email: purchase.email },
      select: { sources: true, name: true },
    });
    if (existing) {
      const set = new Set(
        existing.sources.split(",").map((s) => s.trim()).filter(Boolean),
      );
      set.add("purchase");
      await prisma.contact.update({
        where: { email: purchase.email },
        data: {
          name: args.name?.trim() || existing.name,
          lastSource: "purchase",
          sources: Array.from(set).join(","),
          lang,
          consentMarketing: true,
        },
      });
    } else {
      await prisma.contact.create({
        data: {
          email: purchase.email,
          name: args.name?.trim() || null,
          firstSource: "purchase",
          lastSource: "purchase",
          sources: "purchase",
          lang,
          consentMarketing: true,
        },
      });
    }
  } catch (err) {
    console.warn("[create-test-purchase] contact upsert failed (non-fatal):", err?.message ?? err);
  }

  const url = `${siteUrl}/biblioteca?token=${purchase.accessToken}`;
  console.log("");
  console.log("✓ Test purchase created");
  console.log("  email :", purchase.email);
  console.log("  id    :", purchase.id);
  console.log("");
  console.log("  Send this URL to the buyer:");
  console.log("");
  console.log("  " + url);
  console.log("");
} catch (err) {
  console.error("[create-test-purchase] failed:", err);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
      out[k] = v;
    }
  }
  return out;
}
