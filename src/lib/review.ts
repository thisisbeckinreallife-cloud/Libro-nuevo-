import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Review funnel helpers.
 * Independent from the workbook /registro flow — uses its own cookie
 * (`arkw_resena`) and env var (`REVIEW_QR_SECRET`).
 *
 * The funnel is intentionally manual: the reader leaves an Amazon review
 * of Lara's first book, then emails the screenshot to Lucía (team), who
 * grants access to the RECODE campus. No uploads, no DB writes here.
 */

const QR_COOKIE_NAME = "arkw_resena";

// ───────────────────────────────────────────────────────────────────
// QR secret gate
//
// Cookie writing lives in `src/middleware.ts` — Next 14 forbids Server
// Components from mutating cookies. This function is read-only and
// safe to call from pages.
// ───────────────────────────────────────────────────────────────────

function qrSecretCookieValue(): string {
  const secret = process.env["REVIEW_QR_SECRET"] ?? "";
  if (!secret) return "";
  // The cookie stores a hash of the secret — env rotation silently
  // invalidates old cookies on the next visit.
  return crypto.createHash("sha256").update(secret).digest("hex").slice(0, 32);
}

/**
 * True if either ?k matches REVIEW_QR_SECRET (fallback for
 * middleware-skip cases) OR the visitor already has a valid cookie
 * dropped by the middleware on a previous valid-QR visit.
 *
 * This function NEVER writes cookies — the middleware owns that.
 */
export async function hasQrAccess(paramK: string | undefined): Promise<boolean> {
  const expected = process.env["REVIEW_QR_SECRET"] ?? "";
  if (!expected) return false;

  if (paramK && typeof paramK === "string") {
    const a = Buffer.from(paramK);
    const b = Buffer.from(expected);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      return true;
    }
  }

  const jar = await cookies();
  const got = jar.get(QR_COOKIE_NAME)?.value;
  return !!got && got === qrSecretCookieValue();
}
