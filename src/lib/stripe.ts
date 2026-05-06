import "server-only";

import Stripe from "stripe";

/**
 * Stripe client — null-safe singleton.
 *
 * The site is designed to run BEFORE Stripe is wired up (so the
 * landing, /biblioteca, and the rest of the funnel can be deployed
 * with the checkout button placeholder-only).
 *
 * Call `getStripe()` and check the return value: `null` means Stripe
 * isn't configured yet; the API routes return 503 in that case.
 *
 * Once `STRIPE_SECRET_KEY` is set in Railway, every call here gets a
 * real client without any code change.
 */

let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = (process.env["STRIPE_SECRET_KEY"] ?? "").trim();
  if (!key) {
    cached = null;
    return null;
  }
  cached = new Stripe(key, {
    // Pin the API version so contract changes upstream don't silently
    // break us. Bump intentionally after testing.
    apiVersion: "2025-02-24.acacia",
    typescript: true,
    appInfo: {
      name: "arkwright-method-landing",
      url: "https://arkwright.laralawn.com",
    },
  });
  return cached;
}

/**
 * Convenience: read the price ID from env, return null if missing.
 */
export function getOfferPriceId(): string | null {
  const v = (process.env["STRIPE_PRICE_ID_OFFER_12EUR"] ?? "").trim();
  return v || null;
}

/**
 * Convenience: read the webhook secret from env.
 */
export function getWebhookSecret(): string | null {
  const v = (process.env["STRIPE_WEBHOOK_SECRET"] ?? "").trim();
  return v || null;
}

/**
 * `true` if every variable needed to run a checkout is present.
 * Used by the API to decide whether to 503 vs. proceed.
 */
export function stripeIsConfigured(): boolean {
  return getStripe() !== null && getOfferPriceId() !== null;
}
