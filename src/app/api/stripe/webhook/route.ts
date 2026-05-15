import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { upsertContact } from "@/lib/contact";
import { sendPurchaseEmail } from "@/lib/emails/purchase-email";
import { recordEvent } from "@/lib/events";
import { prisma } from "@/lib/prisma";
import { recordCheckoutCompleted, recordRefund } from "@/lib/purchase";
import { getOfferPriceId, getStripe, getWebhookSecret } from "@/lib/stripe";

/**
 * POST /api/stripe/webhook
 *
 * Stripe → us. Receives async events about Checkout Sessions and
 * payments. Two events matter for the digital offer:
 *
 *   - `checkout.session.completed` → buyer paid. Create Purchase row,
 *     mirror into Contact for marketing.
 *   - `charge.refunded` → buyer was refunded. Mark Purchase as
 *     refunded so /api/biblioteca/[file] starts rejecting the token.
 *
 * Everything else returns 200 silently — Stripe expects a 2xx for
 * acknowledgement; non-2xx triggers retries.
 *
 * SAFETY: this route uses the raw request body (NOT JSON-parsed) for
 * the signature check. Next 14 App Router gives us the raw body via
 * `req.text()`, which preserves bytes.
 */

export const dynamic = "force-dynamic";
// We always need the raw body — disable any body-parser interference.
// (Next 14 App Router doesn't have the Pages-Router `bodyParser` config
//  knob, but `req.text()` already gives us the unparsed string.)

export async function POST(req: NextRequest): Promise<NextResponse> {
  const stripe = getStripe();
  const secret = getWebhookSecret();

  // Stub mode — Stripe not wired yet. Return 503 so any test
  // delivery from the dashboard fails loudly instead of silently.
  if (!stripe || !secret) {
    return new NextResponse("stripe webhook not configured", { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("missing stripe-signature", { status: 400 });

  // Use the raw body for signature verification.
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "verify failed";
    console.error("[stripe-webhook] signature verification failed:", msg);
    return new NextResponse(`signature verification failed: ${msg}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(stripe, event.data.object);
        break;

      case "charge.refunded":
        await handleChargeRefunded(stripe, event.data.object);
        break;

      // We accept every other event silently to keep Stripe happy.
      // Add a case here if/when we want to react to one.
      default:
        break;
    }
  } catch (err) {
    // Log but still return 200 only if we already persisted the
    // intent. Otherwise we want Stripe to retry. The handlers below
    // throw on storage failure — let it bubble.
    console.error(`[stripe-webhook] handler for ${event.type} failed`, err);
    return new NextResponse("handler error", { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleCheckoutCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<void> {
  // GUARD — solo cumplimos la oferta digital de 12 € (libro Arkwright).
  // La MISMA cuenta de Stripe vende otros productos (p.ej. el
  // diagnóstico de 1 € en reprogramaciónsubconsciente.es). Esos
  // también disparan `checkout.session.completed` aquí. Sin este
  // filtro, quien compra el diagnóstico recibiría el email del libro
  // Y un accessToken válido a /biblioteca. Fail-safe: si no podemos
  // CONFIRMAR que la sesión es la oferta de 12 €, no hacemos nada
  // (devolvemos 200, Stripe queda contento, pero no entregamos).
  const offerPriceId = getOfferPriceId();
  if (!offerPriceId) {
    console.error(
      "[stripe-webhook] STRIPE_PRICE_ID_OFFER_12EUR ausente — ignoro la sesión para no entregar de más",
      { sessionId: session.id },
    );
    return;
  }
  let isOffer = false;
  try {
    const items = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });
    isOffer = items.data.some((li) => li.price?.id === offerPriceId);
  } catch (err) {
    console.error(
      "[stripe-webhook] no pude listar line items — ignoro la sesión (fail-safe)",
      { sessionId: session.id, err },
    );
    return;
  }
  if (!isOffer) {
    // No es nuestro producto (p.ej. el diagnóstico de 1 €).
    // Acuse silencioso: ni email del libro ni acceso a /biblioteca.
    console.info(
      "[stripe-webhook] checkout.session.completed de un producto que no es la oferta — sin entrega",
      { sessionId: session.id },
    );
    return;
  }

  // Pull buyer info — Checkout always collects email; name is
  // optional and depends on the price configuration.
  // (`session.customer` may be a DeletedCustomer object when the
  //  customer was removed in Stripe — guard before reading fields.)
  const customerObj =
    typeof session.customer === "object" &&
    session.customer !== null &&
    !("deleted" in session.customer && session.customer.deleted)
      ? session.customer
      : null;
  const email =
    session.customer_details?.email ||
    session.customer_email ||
    customerObj?.email ||
    null;

  if (!email) {
    // Without an email we can't deliver the product or remarket.
    // Record nothing and let Stripe retry — but log loudly.
    console.error(
      "[stripe-webhook] checkout.session.completed without email",
      { sessionId: session.id },
    );
    return;
  }

  const name =
    session.customer_details?.name ||
    customerObj?.name ||
    null;

  const lang =
    typeof session.metadata?.["lang"] === "string"
      ? session.metadata["lang"]
      : "es";

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const { accessToken, isNew } = await recordCheckoutCompleted({
    stripeSessionId: session.id,
    stripePaymentIntentId: paymentIntentId,
    email,
    name,
    amount: session.amount_total ?? 0,
    currency: (session.currency ?? "eur").toLowerCase(),
    lang,
    meta: {
      mode: session.mode,
      paymentStatus: session.payment_status,
      customer:
        typeof session.customer === "string" ? session.customer : null,
    },
  });

  // Email transaccional: solo si es un Purchase nuevo (idempotente
  // ante retries del webhook). Si el envío falla, lo loggeamos pero no
  // dejamos caer el webhook — el comprador siempre tiene el link al
  // bookmark URL desde la pantalla de éxito de Stripe.
  if (isNew) {
    try {
      await sendPurchaseEmail({
        email,
        name,
        accessToken,
        lang,
      });
    } catch (err) {
      console.error("[stripe-webhook] sendPurchaseEmail failed (non-fatal)", {
        email,
        err,
      });
    }
  }

  // Mirror into the marketing contacts table — buyers join the same
  // index as workbook signups but tagged with source="purchase" via
  // the upsertContact's source-set logic.
  await upsertContact({
    email,
    source: "purchase",
    name,
    lang: lang === "en" ? "en" : "es",
    consentMarketing: true, // explicit purchase = stronger consent than a free signup
  });

  // Bridge purchase ↔ workbook by email. The workbook needs a User row
  // (the model behind Session). Ensure one exists for this buyer so
  // /api/biblioteca/workbook-enter can issue them a session in one
  // hop. Idempotent: if the buyer already had a free workbook account
  // under the same email, that User is reused and their existing
  // workbook progress is preserved untouched.
  try {
    const emailNorm = email.trim().toLowerCase();
    await prisma.user.upsert({
      where: { email: emailNorm },
      update: name ? { name } : {},
      create: { email: emailNorm, name: name?.trim() || null },
    });
  } catch (err) {
    // Non-fatal — workbook-enter has its own upsert as a safety net.
    console.error("[stripe-webhook] user upsert failed (non-fatal)", { email, err });
  }

  // Conversion event — only for genuinely new purchases (idempotent
  // against webhook retries). Server-side write: not subject to
  // cookie consent (this is legitimate interest under GDPR — needed
  // to operate the offer + measure refund rate for fraud detection).
  if (isNew) {
    await recordEvent({
      kind: "purchase_completed",
      path: "/api/stripe/webhook",
      meta: {
        amount: session.amount_total ?? 0,
        currency: (session.currency ?? "eur").toLowerCase(),
        lang,
        sessionId: session.id,
      },
    });
  }
}

async function handleChargeRefunded(
  stripe: Stripe,
  charge: Stripe.Charge,
): Promise<void> {
  // The refund event references the charge, not the checkout
  // session. We need to walk back to the session via the payment
  // intent so we can mark the right Purchase row.
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id ?? null;

  if (!paymentIntentId) return;

  // Find the Checkout Session that owns this PaymentIntent. We expect
  // exactly one for our flow — if the buyer paid via something else
  // there'll be zero, and we silently skip.
  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntentId,
    limit: 1,
  });
  const session = sessions.data[0];
  if (!session) return;

  await recordRefund(session.id);

  // Conversion event — registra el refund para que /admin/analytics
  // muestre el ratio buy → refund. Server-side, no consent gate.
  await recordEvent({
    kind: "refund_requested",
    path: "/api/stripe/webhook",
    meta: {
      amount: charge.amount_refunded ?? charge.amount ?? 0,
      currency: (charge.currency ?? "eur").toLowerCase(),
      sessionId: session.id,
    },
  });
}
