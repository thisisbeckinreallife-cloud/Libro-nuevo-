import "server-only";

import crypto from "node:crypto";
import { Prisma, type PurchaseStatus } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Purchase helpers — mirror of `src/lib/review.ts` for the paid flow.
 *
 * The only writer of `Purchase` rows is the Stripe webhook (and the
 * dev-only test-purchase script). Reads happen from `/biblioteca` and
 * the `/api/biblioteca/[file]` endpoint.
 */

export type RewardKindBiblioteca = "ebook" | "audio";

/**
 * Idempotent: matches by `stripeSessionId`. If the row exists we just
 * promote it to `paid` and don't churn the accessToken (the buyer may
 * have already bookmarked the URL).
 */
export async function recordCheckoutCompleted(opts: {
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  email: string;
  name: string | null;
  amount: number; // cents
  currency: string;
  lang: "es" | "en" | string;
  meta?: Prisma.InputJsonValue;
}): Promise<{ accessToken: string; isNew: boolean }> {
  const existing = await prisma.purchase.findUnique({
    where: { stripeSessionId: opts.stripeSessionId },
    select: { id: true, accessToken: true, status: true },
  });

  if (existing) {
    // Already recorded by an earlier delivery of the same webhook —
    // just mark paid (in case the previous run only saw `pending`).
    if (existing.status !== "paid") {
      await prisma.purchase.update({
        where: { id: existing.id },
        data: {
          status: "paid",
          paidAt: new Date(),
          ...(opts.stripePaymentIntentId
            ? { stripePaymentIntentId: opts.stripePaymentIntentId }
            : {}),
        },
      });
    }
    return { accessToken: existing.accessToken, isNew: false };
  }

  const accessToken = crypto.randomUUID();

  await prisma.purchase.create({
    data: {
      email: opts.email.trim().toLowerCase(),
      name: opts.name?.trim() || null,
      stripeSessionId: opts.stripeSessionId,
      stripePaymentIntentId: opts.stripePaymentIntentId,
      amount: opts.amount,
      currency: opts.currency.toLowerCase(),
      status: "paid",
      accessToken,
      lang: opts.lang === "en" ? "en" : "es",
      paidAt: new Date(),
      ...(opts.meta !== undefined ? { meta: opts.meta } : {}),
    },
  });

  return { accessToken, isNew: true };
}

/**
 * Mark a purchase as refunded. Idempotent.
 */
export async function recordRefund(stripeSessionId: string): Promise<boolean> {
  const r = await prisma.purchase.updateMany({
    where: { stripeSessionId, status: { not: "refunded" } },
    data: { status: "refunded", refundedAt: new Date() },
  });
  return r.count > 0;
}

export async function getPurchaseByAccessToken(token: string) {
  if (!token || typeof token !== "string") return null;
  return prisma.purchase.findUnique({ where: { accessToken: token } });
}

export async function getPurchaseBySessionId(sessionId: string) {
  if (!sessionId || typeof sessionId !== "string") return null;
  return prisma.purchase.findUnique({ where: { stripeSessionId: sessionId } });
}

/**
 * Increment the per-kind download counter. Returns the new count.
 */
export async function incrementBibliotecaDownload(
  id: string,
  kind: RewardKindBiblioteca,
): Promise<number> {
  const field = kind === "ebook" ? "ebookDownloads" : "audioDownloads";
  const updated = await prisma.purchase.update({
    where: { id },
    data: { [field]: { increment: 1 } },
    select: { ebookDownloads: true, audioDownloads: true },
  });
  return kind === "ebook" ? updated.ebookDownloads : updated.audioDownloads;
}

/**
 * Cap on free re-downloads per file before the URL gets blocked. The
 * intent isn't DRM (the file is downloadable as a flat MP3/PDF), it's
 * to discourage casual sharing of `/biblioteca?token=…` URLs.
 */
export const MAX_DOWNLOADS_PER_FILE = 5;

export type PurchaseStatusValue = PurchaseStatus;
