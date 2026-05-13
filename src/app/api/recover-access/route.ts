import { NextResponse, type NextRequest } from "next/server";
import { sendPurchaseEmail } from "@/lib/emails/purchase-email";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/recover-access
 *
 * Body: { email: string }
 *
 * Si el email corresponde a un Purchase con status="paid", reenvía el
 * email de compra con el link a /biblioteca. Si no existe, responde 200
 * igualmente para no leakar qué emails compraron.
 *
 * Rate limit suave por IP: 5 envíos por hora. La tabla
 * `RecoveryAttempt` no existe (sería over-engineering para este flujo
 * de baja frecuencia); en su lugar contamos hits en memoria de proceso
 * usando un Map. Si Railway escala a más de un proceso, el rate limit
 * será aproximado, no exacto. Suficiente para el riesgo: cliente
 * legítimo que olvidó el email + algún bot que pruebe addresses.
 */

export const dynamic = "force-dynamic";

const WINDOW_MS = 60 * 60 * 1000; // 1 h
const MAX_PER_WINDOW = 5;
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
  // Muy permisivo a propósito; Stripe ya nos da emails válidos.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
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

  const email = (body as { email?: unknown })?.email;
  if (!validEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const emailNorm = email.trim().toLowerCase();

  // Buscamos el Purchase más reciente "paid" para este email. Si hay
  // varios (cliente re-comprando), enviamos el más nuevo.
  const purchase = await prisma.purchase.findFirst({
    where: { email: emailNorm, status: "paid" },
    orderBy: { paidAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      accessToken: true,
      lang: true,
    },
  });

  if (purchase) {
    try {
      await sendPurchaseEmail(purchase);
    } catch (err) {
      console.error("[recover-access] sendPurchaseEmail failed", {
        email: emailNorm,
        err,
      });
      // No revelamos el fallo al cliente — sigue respondiendo 200.
    }
  } else {
    console.log("[recover-access] no purchase found", { email: emailNorm });
  }

  // Misma respuesta para "encontrado" y "no encontrado". Privacy by
  // default: no leakar emails que compraron.
  return NextResponse.json(
    { ok: true },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
