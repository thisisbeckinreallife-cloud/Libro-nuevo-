import { prisma } from "./prisma";

export const SLOTS_TOTAL = 100;
export const SLOTS_DISPLAY_CAP = SLOTS_TOTAL - 1; // the counter never hits 100
export const NEAR_EXHAUSTION_THRESHOLD = 15;

export type SlotsPayload =
  | { mode: "static" }
  | { mode: "active"; claimed: number; total: number; remaining: number };

function isLiveCounterEnabled(): boolean {
  return process.env.SHOW_LIVE_COUNTER === "true";
}

export async function getSlots(): Promise<SlotsPayload> {
  if (!isLiveCounterEnabled()) return { mode: "static" };
  try {
    const row = await prisma.counterCache.findUnique({ where: { id: 1 } });
    const raw = Math.max(0, row?.claimedCount ?? 0);
    const claimed = Math.min(raw, SLOTS_DISPLAY_CAP);
    return {
      mode: "active",
      claimed,
      total: SLOTS_TOTAL,
      remaining: SLOTS_TOTAL - claimed,
    };
  } catch {
    return { mode: "static" };
  }
}
