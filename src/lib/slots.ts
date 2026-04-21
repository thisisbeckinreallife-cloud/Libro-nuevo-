import { prisma } from "./prisma";

export const SLOTS_TOTAL = 100;
export const NEAR_EXHAUSTION_THRESHOLD = 15;

export type SlotsPayload =
  | { mode: "static" }
  | { mode: "active"; claimed: number; total: number; remaining: number }
  | { mode: "exhausted"; total: number };

function isLiveCounterEnabled(): boolean {
  return process.env.SHOW_LIVE_COUNTER === "true";
}

export async function getSlots(): Promise<SlotsPayload> {
  if (!isLiveCounterEnabled()) return { mode: "static" };
  try {
    const row = await prisma.counterCache.findUnique({ where: { id: 1 } });
    const claimed = Math.min(Math.max(0, row?.claimedCount ?? 0), SLOTS_TOTAL);
    if (claimed >= SLOTS_TOTAL) return { mode: "exhausted", total: SLOTS_TOTAL };
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
