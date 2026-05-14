import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

/**
 * GET /api/health — UptimeRobot replacement.
 *
 * Devuelve 200 si todos los servicios críticos responden. Devuelve
 * 503 con el detalle del componente caído si alguno falla. No expone
 * secretos — solo flags booleanos + el componente que fallaría.
 *
 * Usado para un chequeo periódico vía `curl` o un cron simple. No
 * requiere autenticación porque solo dice "vivo/no vivo" — no expone
 * datos sensibles.
 */

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(): Promise<NextResponse> {
  const checks: Record<string, boolean> = {};
  const errors: Record<string, string> = {};

  // DB — single SELECT 1
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.db = true;
  } catch (err) {
    checks.db = false;
    errors.db = err instanceof Error ? err.message : "unknown";
  }

  // Stripe — solo verificamos que el cliente esté configurado
  // (no llamamos a su API para no consumir cuota en cada chequeo).
  try {
    const stripe = getStripe();
    checks.stripe = stripe !== null;
    if (!stripe) errors.stripe = "STRIPE_SECRET_KEY not set";
  } catch (err) {
    checks.stripe = false;
    errors.stripe = err instanceof Error ? err.message : "unknown";
  }

  // Resend — verificamos que la API key esté presente.
  checks.resend = Boolean((process.env["RESEND_API_KEY"] ?? "").trim());
  if (!checks.resend) errors.resend = "RESEND_API_KEY not set";

  const allOk = Object.values(checks).every(Boolean);

  return NextResponse.json(
    {
      ok: allOk,
      checks,
      ...(allOk ? {} : { errors }),
      timestamp: new Date().toISOString(),
    },
    {
      status: allOk ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
