import "server-only";

import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { prisma } from "./prisma";
import { hashIp, rateLimit } from "./rate-limit";

/**
 * Review funnel helpers.
 * Independent from the workbook /registro flow — uses its own cookie
 * (`arkw_resena`) and env var (`REVIEW_QR_SECRET`).
 */

const QR_COOKIE_NAME = "arkw_resena";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIME = new Set<string>([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

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

// ───────────────────────────────────────────────────────────────────
// Upload handling
// ───────────────────────────────────────────────────────────────────

export type UploadReason =
  | "too_big"
  | "bad_type"
  | "empty"
  | "duplicate"
  | "rate_limit"
  | "generic";

export type CreateReviewResult =
  | { ok: true; submissionId: string; claimTokenRaw: string }
  | { ok: false; reason: UploadReason };

export async function createReview(opts: {
  file: File;
  email: string | null;
}): Promise<CreateReviewResult> {
  const { file } = opts;

  // Validate
  if (!file || file.size === 0) return { ok: false, reason: "empty" };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, reason: "too_big" };
  if (!ALLOWED_MIME.has(file.type)) return { ok: false, reason: "bad_type" };

  // Rate-limit per IP
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const ipHashKey = hashIp(ip);
  const rl = rateLimit(`resena:${ipHashKey}`, 3, 10 * 60);
  if (!rl.ok) return { ok: false, reason: "rate_limit" };

  // Bytes + hash.
  // We normalise to a fresh ArrayBuffer-backed Uint8Array because Prisma's
  // `Bytes` column type requires `Uint8Array<ArrayBuffer>` (narrow), while
  // `Buffer.from(file.arrayBuffer())` returns `Buffer<ArrayBufferLike>`
  // under recent `@types/node` — which TS refuses to assign. The explicit
  // generic on the annotation keeps the narrow type after allocation.
  let buf: Uint8Array<ArrayBuffer>;
  try {
    const incoming = new Uint8Array(await file.arrayBuffer());
    const ab = new ArrayBuffer(incoming.byteLength);
    const view: Uint8Array<ArrayBuffer> = new Uint8Array(ab);
    view.set(incoming);
    buf = view;
  } catch {
    return { ok: false, reason: "generic" };
  }
  const screenshotHash = crypto.createHash("sha256").update(buf).digest("hex");

  // Dedupe (same bytes already submitted)
  const dup = await prisma.reviewSubmission.findFirst({
    where: { screenshotHash },
    select: { id: true },
  });
  if (dup) return { ok: false, reason: "duplicate" };

  // Persisted IP hash (hex sha256, not the sanitized bucket key)
  const ipHashPersisted = crypto
    .createHash("sha256")
    .update(ip)
    .digest("hex");

  const userAgent = (h.get("user-agent") ?? "").slice(0, 512) || null;
  const claimTokenRaw = crypto.randomBytes(24).toString("base64url");

  try {
    const row = await prisma.reviewSubmission.create({
      data: {
        email: opts.email,
        screenshot: buf,
        contentType: file.type,
        screenshotHash,
        ipHash: ipHashPersisted,
        userAgent,
        claimToken: claimTokenRaw,
      },
      select: { id: true },
    });
    return { ok: true, submissionId: row.id, claimTokenRaw };
  } catch {
    return { ok: false, reason: "generic" };
  }
}

export async function getSubmissionById(id: string) {
  return prisma.reviewSubmission.findUnique({ where: { id } });
}

export async function incrementDownload(
  id: string,
  kind: "ebook" | "audio",
): Promise<number> {
  const field = kind === "ebook" ? "ebookDownloads" : "audioDownloads";
  const updated = await prisma.reviewSubmission.update({
    where: { id },
    data: {
      [field]: { increment: 1 },
      claimedAt: new Date(),
    },
    select: {
      ebookDownloads: true,
      audioDownloads: true,
    },
  });
  return kind === "ebook" ? updated.ebookDownloads : updated.audioDownloads;
}
