import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { adminTokenIsValid } from "@/lib/admin-auth";
import { sendPurchaseEmail } from "@/lib/emails/purchase-email";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/demo-purchase
 *
 * Body: { email?: string, name?: string }
 *
 * Crea un Purchase fake con status="paid" en la DB y dispara el email
 * post-compra REAL. Sirve para que el owner pueda recorrer la
 * experiencia del comprador antes de tener Stripe live activado.
 *
 * Protegido con ADMIN_EXPORT_TOKEN (mismo gate que /api/admin/contacts.csv).
 *
 * Idempotente para el mismo email: si ya existe un Purchase "paid"
 * con ese email, reutiliza el accessToken y reenvía el email.
 */

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Auth: header "Authorization: Bearer <ADMIN_EXPORT_TOKEN>"
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length).trim() : "";
  if (!adminTokenIsValid(token)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: { email?: unknown; name?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    /* permitir body vacío */
  }

  const email =
    typeof body.email === "string" && body.email.trim().length > 0
      ? body.email.trim().toLowerCase()
      : "munteaneric4@gmail.com";
  const name =
    typeof body.name === "string" && body.name.trim().length > 0
      ? body.name.trim()
      : "Eric";

  // Reutilizar Purchase existente para no duplicar rows en la DB.
  let purchase = await prisma.purchase.findFirst({
    where: { email, status: "paid" },
    orderBy: { paidAt: "desc" },
  });

  if (!purchase) {
    const accessToken = crypto.randomUUID();
    purchase = await prisma.purchase.create({
      data: {
        email,
        name,
        stripeSessionId: "demo-" + crypto.randomBytes(6).toString("hex"),
        stripePaymentIntentId: null,
        amount: 1200,
        currency: "eur",
        status: "paid",
        accessToken,
        lang: "es",
        paidAt: new Date(),
        meta: { demo: true, source: "admin/demo-purchase" },
      },
    });
  }

  const emailOk = await sendPurchaseEmail({
    id: purchase.id,
    email: purchase.email,
    name: purchase.name,
    accessToken: purchase.accessToken,
    lang: purchase.lang,
  }).catch((err) => {
    console.error("[admin/demo-purchase] sendPurchaseEmail threw", err);
    return false;
  });

  const siteUrl =
    (process.env["NEXT_PUBLIC_SITE_URL"] ?? "").trim() ||
    "https://arkwright.laralawn.com";

  return NextResponse.json(
    {
      ok: true,
      purchase: {
        id: purchase.id,
        email: purchase.email,
        accessToken: purchase.accessToken,
        bibliotecaUrl: `${siteUrl}/biblioteca?token=${encodeURIComponent(purchase.accessToken)}`,
        reused: purchase.createdAt.getTime() < Date.now() - 5_000,
      },
      emailSent: emailOk,
    },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
