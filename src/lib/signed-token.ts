import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { SESSION_SECRET } from "./env";

/**
 * Short-lived signed claim tokens issued after a successful review upload.
 * Uses HMAC-SHA256 with the existing SESSION_SECRET — no new secret required.
 *
 * Token shape: `base64url(JSON payload).base64url(HMAC-SHA256(payload, secret))`
 *
 * NOT a JWT — we avoid the algorithm-negotiation class of mistakes by hardcoding
 * the signing algorithm and not embedding any header.
 */

export type ClaimPayload = {
  /** UUID of the ReviewSubmission row this token unlocks. */
  submissionId: string;
  /** Absolute expiry in ms since epoch. */
  exp: number;
};

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 h

function toBase64Url(buf: Buffer): string {
  return buf.toString("base64url");
}

function fromBase64Url(s: string): Buffer {
  return Buffer.from(s, "base64url");
}

export function signClaim(
  payload: Omit<ClaimPayload, "exp"> & { exp?: number },
): string {
  const full: ClaimPayload = {
    submissionId: payload.submissionId,
    exp: payload.exp ?? Date.now() + DEFAULT_TTL_MS,
  };
  const body = toBase64Url(Buffer.from(JSON.stringify(full), "utf8"));
  const sig = createHmac("sha256", SESSION_SECRET).update(body).digest();
  return `${body}.${toBase64Url(sig)}`;
}

/**
 * Returns the decoded payload if the token is valid and unexpired;
 * returns null otherwise. Uses timing-safe comparison.
 */
export function verifyClaim(token: string | null | undefined): ClaimPayload | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;

  let got: Buffer;
  try {
    got = fromBase64Url(sig);
  } catch {
    return null;
  }

  const expected = createHmac("sha256", SESSION_SECRET).update(body).digest();
  if (got.length !== expected.length) return null;
  if (!timingSafeEqual(got, expected)) return null;

  let payload: ClaimPayload;
  try {
    payload = JSON.parse(fromBase64Url(body).toString("utf8"));
  } catch {
    return null;
  }
  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.submissionId !== "string" ||
    typeof payload.exp !== "number"
  ) {
    return null;
  }
  if (payload.exp < Date.now()) return null;
  return payload;
}
