import "server-only";

import crypto from "node:crypto";

/**
 * Admin token gate for the /admin dashboard and /api/admin/* endpoints.
 *
 * The token comes from the `ADMIN_EXPORT_TOKEN` env var. We compare it
 * with `crypto.timingSafeEqual` to avoid leaking length-mismatch info.
 *
 * If the env var is missing or empty, NO request is allowed — fail
 * closed. That way a misconfigured deploy can't leak the contacts list.
 */

export function adminTokenIsValid(provided: string | null | undefined): boolean {
  const expected = (process.env["ADMIN_EXPORT_TOKEN"] ?? "").trim();
  if (!expected) return false;
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
