import { prisma } from "./prisma";

export const SLOTS_TOTAL = 100;

export type Slots = { claimed: number; total: number };

export async function getSlots(): Promise<Slots> {
  try {
    const row = await prisma.counterCache.findUnique({ where: { id: 1 } });
    const claimed = Math.min(Math.max(0, row?.claimedCount ?? 0), SLOTS_TOTAL);
    return { claimed, total: SLOTS_TOTAL };
  } catch {
    return { claimed: 0, total: SLOTS_TOTAL };
  }
}
