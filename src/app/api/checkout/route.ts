import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { hashIp, rateLimit } from "@/lib/rate-limit";
import { getOfferPriceId, getStripe, stripeIsConfigured } from "@/lib/stripe";

/**
 * POST /api/checkout
 *
 * Body: `{ lang?: "es" | "en" }`
 *
 * If Stripe is configured (env vars present), creates a Checkout
 * Session and returns `{ url }` for the frontend to redirect to.
 *
 * If Stripe is NOT configured yet, returns 503 with a structured
 * error so the frontend can show "Pronto disponible" instead of
 * crashing. Activation later is just setting env vars in Railway —
 * no code change here.
 */

export const dynamic = "force-dynamic";

const ALLOWED_LANG = new Set(["es", "en"]);

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Rate-limit by IP — protects against abuse of the Stripe API
  // even before checkout starts.
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const rl = rateLimit(`checkout:${hashIp(ip)}`, 10, 60);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limit" },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Stub mode: stripe not configured yet. The frontend reads this
  // status code to render a "pronto disponible" placeholder. When
  // STRIPE_SECRET_KEY + STRIPE_PRICE_ID_OFFER_12EUR get set in
  // Railway, this branch goes away on its own.
  const stripe = getStripe();
  const priceId = getOfferPriceId();
  if (!stripe || !priceId || !stripeIsConfigured()) {
    return NextResponse.json(
      {
        error: "checkout_not_configured",
        hint:
          "Set STRIPE_SECRET_KEY + STRIPE_PRICE_ID_OFFER_12EUR (and STRIPE_WEBHOOK_SECRET for the webhook).",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: { lang?: unknown } = {};
  try {
    body = (await req.json()) as { lang?: unknown };
  } catch {
    /* allow empty body */
  }
  const lang =
    typeof body.lang === "string" && ALLOWED_LANG.has(body.lang)
      ? (body.lang as "es" | "en")
      : "es";

  // Stripe Checkout's `locale` param accepts "es", "en" — and a few
  // others. We never send anything else.
  const locale: "es" | "en" = lang;

  // Site URL used to build absolute success/cancel URLs. Falls back
  // to the canonical production host so we don't accidentally point
  // Stripe at localhost.
  const siteUrl =
    (process.env["NEXT_PUBLIC_SITE_URL"] ?? "").replace(/\/$/, "") ||
    "https://arkwright.laralawn.com";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      // The Checkout Session's id is appended by Stripe via the
      // {CHECKOUT_SESSION_ID} placeholder.
      success_url: `${siteUrl}/biblioteca?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?checkout=cancelled`,
      locale,
      // Buyer email (and name) flow into the Purchase row via the webhook.
      customer_creation: "if_required",
      // Stripe collects the email automatically; we surface it in the
      // metadata so a manual reconciliation has it next to the lang.
      metadata: { lang },
      payment_intent_data: {
        metadata: { lang, product: "arkwright-method-digital-12eur" },
      },
      // The audio file is large (140 MB+). Once the buyer pays we want
      // them to land on /biblioteca even if they accidentally close
      // the browser — the recovery email has the success URL too.
      after_expiration: { recovery: { enabled: true, allow_promotion_codes: false } },
      // Allow promotion codes by default — easy to disable per session
      // if we ever need a no-discount run.
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "no_session_url" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { url: session.url, id: session.id },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[checkout] stripe.checkout.sessions.create failed", err);
    return NextResponse.json(
      { error: "checkout_failed" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
