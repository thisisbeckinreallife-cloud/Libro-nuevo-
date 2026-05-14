import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { upsertContact, type ContactSource } from "@/lib/contact";

/**
 * POST /api/waitlist
 *
 * Body: { email: string, tier: "paperback" | "collector", lang?: "es" | "en" }
 *
 * Records an email + edition on the WaitlistEntry table. Idempotent by
 * (email, tier) — re-submitting the same pair is a 200 no-op.
 *
 * Also upserts into Contact so marketing can pull every email — paid or
 * waitlisted — from one place.
 *
 * Same in-memory rate-limit pattern as /api/recover-access: low traffic,
 * Railway single-instance, good enough.
 */

export const dynamic = "force-dynamic";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const attempts = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimitHit(ip: string): boolean {
  const now = Date.now();
  const list = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    attempts.set(ip, list);
    return true;
  }
  list.push(now);
  attempts.set(ip, list);
  return false;
}

function validEmail(s: unknown): s is string {
  if (typeof s !== "string") return false;
  if (s.length > 320) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function validTier(s: unknown): s is "paperback" | "collector" {
  return s === "paperback" || s === "collector";
}

function validLang(s: unknown): s is "es" | "en" {
  return s === "es" || s === "en";
}

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = clientIp(req);
  if (rateLimitHit(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const b = body as { email?: unknown; tier?: unknown; lang?: unknown };
  if (!validEmail(b.email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (!validTier(b.tier)) {
    return NextResponse.json(
      { ok: false, error: "invalid_tier" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  const lang: "es" | "en" = validLang(b.lang) ? b.lang : "es";

  const email = b.email.trim().toLowerCase();
  const tier = b.tier;
  const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? null;
  const ipH = hashIp(ip);

  try {
    await prisma.waitlistEntry.upsert({
      where: { email_tier: { email, tier } },
      update: {
        lang,
        ipHash: ipH,
        userAgent,
      },
      create: {
        email,
        tier,
        lang,
        ipHash: ipH,
        userAgent,
        source: "oferta",
      },
    });
  } catch (err) {
    console.error("[waitlist] db write failed", { email, tier, err });
    return NextResponse.json(
      { ok: false, error: "db_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  const source: ContactSource =
    tier === "paperback" ? "waitlist-paperback" : "waitlist-collector";
  await upsertContact({ email, source, lang });

  return NextResponse.json(
    { ok: true },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
