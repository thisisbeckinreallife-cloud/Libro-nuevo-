import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Internal conversion tracking — Plausible/GA replacement using our
 * own Postgres table. Called from API routes (server-side) and from
 * a small client snippet (via POST /api/track).
 *
 * Crucial: the CLIENT snippet should only call us if
 * `window.__cookieConsent.analytics === true`. The server-side calls
 * (webhook → purchase_completed, etc.) are not subject to consent
 * because they are necessary for the contract execution.
 */

export type EventInput = {
  kind:
    | "page_load"
    | "cta_click"
    | "checkout_start"
    | "purchase_completed"
    | "refund_requested"
    | string;
  path?: string | undefined;
  sessionId?: string | undefined;
  utmSource?: string | undefined;
  utmMedium?: string | undefined;
  utmCampaign?: string | undefined;
  referrerHost?: string | undefined;
  abVariant?: string | undefined;
  meta?: Prisma.InputJsonValue | undefined;
};

export async function recordEvent(input: EventInput): Promise<void> {
  try {
    await prisma.event.create({
      data: {
        kind: input.kind.slice(0, 64),
        ...(input.path ? { path: input.path.slice(0, 500) } : {}),
        ...(input.sessionId ? { sessionId: input.sessionId.slice(0, 64) } : {}),
        ...(input.utmSource ? { utmSource: input.utmSource.slice(0, 120) } : {}),
        ...(input.utmMedium ? { utmMedium: input.utmMedium.slice(0, 120) } : {}),
        ...(input.utmCampaign ? { utmCampaign: input.utmCampaign.slice(0, 120) } : {}),
        ...(input.referrerHost ? { referrerHost: input.referrerHost.slice(0, 200) } : {}),
        ...(input.abVariant ? { abVariant: input.abVariant.slice(0, 32) } : {}),
        ...(input.meta !== undefined ? { meta: input.meta } : {}),
      },
    });
  } catch (err) {
    console.error("[events] recordEvent failed", err);
    // Swallow — tracking is best-effort.
  }
}
