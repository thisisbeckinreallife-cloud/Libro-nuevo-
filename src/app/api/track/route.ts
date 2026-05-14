import { NextResponse, type NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { recordEvent, type EventInput } from "@/lib/events";

/**
 * POST /api/track — analytics interno sin GA/Plausible.
 *
 * Recibe `{ kind, path?, sessionId?, utm?, referrerHost?, abVariant?,
 * meta? }`. Persiste en la tabla `events` vía `recordEvent`.
 *
 * El cliente solo llama si `window.__cookieConsent.analytics === true`
 * (set por el CookieBanner). El servidor confía en eso — no
 * revalida consent porque la propia llamada implica que el cliente
 * lo ha permitido.
 *
 * Rate-limit silencioso: máx 60 eventos por IP por minuto. Si pasa
 * de ahí, devolvemos 200 silenciosamente sin grabar (no queremos
 * que el cliente reintente). Cualquier intento maligno satura su
 * propio bucket sin afectar al resto.
 */

export const dynamic = "force-dynamic";

const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 60;
const attempts = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() ?? "unknown";
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

const ALLOWED_KINDS = new Set([
  "page_load",
  "cta_click",
  "checkout_start",
  "purchase_completed",
  "refund_requested",
]);

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = clientIp(req);
  if (rateLimitHit(ip)) {
    return NextResponse.json(
      { ok: true },
      { status: 200, headers: { "Cache-Control": "no-store" } },
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

  const b = body as {
    kind?: unknown;
    path?: unknown;
    sessionId?: unknown;
    utmSource?: unknown;
    utmMedium?: unknown;
    utmCampaign?: unknown;
    referrerHost?: unknown;
    abVariant?: unknown;
    meta?: unknown;
  };

  if (typeof b.kind !== "string" || !ALLOWED_KINDS.has(b.kind)) {
    return NextResponse.json(
      { ok: false, error: "invalid_kind" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const input: EventInput = { kind: b.kind };
  if (typeof b.path === "string") input.path = b.path;
  if (typeof b.sessionId === "string") input.sessionId = b.sessionId;
  if (typeof b.utmSource === "string") input.utmSource = b.utmSource;
  if (typeof b.utmMedium === "string") input.utmMedium = b.utmMedium;
  if (typeof b.utmCampaign === "string") input.utmCampaign = b.utmCampaign;
  if (typeof b.referrerHost === "string") input.referrerHost = b.referrerHost;
  if (typeof b.abVariant === "string") input.abVariant = b.abVariant;
  if (b.meta !== undefined && b.meta !== null && typeof b.meta === "object") {
    input.meta = b.meta as Prisma.InputJsonValue;
  }

  await recordEvent(input);

  return NextResponse.json(
    { ok: true },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
