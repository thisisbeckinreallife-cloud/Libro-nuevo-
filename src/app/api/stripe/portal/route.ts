import { NextResponse, type NextRequest } from "next/server";
import { getPurchaseByAccessToken } from "@/lib/purchase";
import { getStripe } from "@/lib/stripe";
import { logError } from "@/lib/logError";

/**
 * POST /api/stripe/portal
 *
 * Body: `{ token: string }` — el accessToken del Purchase (mismo que
 * usa /biblioteca).
 *
 * Devuelve `{ url }` con la URL temporal del Stripe Customer Portal,
 * para que el comprador pueda ver su recibo, descargar la factura,
 * actualizar el método de pago. Bajo la política de "no refunds"
 * actual (RD-Ley 1/2007), el portal NO debe tener el toggle de
 * "request refund" activado en Stripe Dashboard. Si está activado,
 * cámbialo: Stripe Settings → Customer Portal → desmarcar "Allow
 * customers to request a refund".
 *
 * Requiere que el Purchase tenga `stripeSessionId`. A partir de la
 * Session pedimos a Stripe el Customer ID y abrimos el portal.
 */

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { ok: false, error: "stripe_not_configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
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

  const token =
    typeof (body as { token?: unknown })?.token === "string"
      ? ((body as { token: string }).token as string)
      : "";
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "missing_token" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const purchase = await getPurchaseByAccessToken(token);
  if (!purchase) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (purchase.status !== "paid") {
    return NextResponse.json(
      { ok: false, error: "not_paid" },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const siteUrl =
    (process.env["NEXT_PUBLIC_SITE_URL"] ?? "").replace(/\/$/, "") ||
    "https://arkwright.laralawn.com";

  try {
    // Pedimos a Stripe el Session para obtener el customerId. En el
    // checkout original `customer_creation: "if_required"` puede haber
    // dejado el campo vacío si el buyer pagó como invitado. En ese
    // caso, creamos un Customer ad-hoc para abrir el portal.
    const session = await stripe.checkout.sessions.retrieve(
      purchase.stripeSessionId,
    );

    let customerId: string | null =
      typeof session.customer === "string"
        ? session.customer
        : (session.customer?.id ?? null);

    if (!customerId) {
      const created = await stripe.customers.create({
        email: purchase.email,
        ...(purchase.name ? { name: purchase.name } : {}),
        metadata: { purchaseId: purchase.id },
      });
      customerId = created.id;
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/biblioteca?token=${encodeURIComponent(token)}`,
    });

    return NextResponse.json(
      { ok: true, url: portal.url },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    await logError({
      source: "stripe-portal",
      error: err,
      path: "/api/stripe/portal",
      meta: { purchaseId: purchase.id },
    });
    return NextResponse.json(
      { ok: false, error: "portal_failed" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
