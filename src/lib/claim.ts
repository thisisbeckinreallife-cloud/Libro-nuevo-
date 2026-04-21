import "server-only";

import { prisma } from "./prisma";

export type ClaimInput = {
  email: string;
  name: string | null;
};

export type ClaimResult =
  | { ok: true; userId: string }
  | { ok: false; reason: "email_exists" };

export async function claimBonus(input: ClaimInput): Promise<ClaimResult> {
  const emailNorm = input.email.trim().toLowerCase();
  const name = input.name?.trim() || null;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({
      where: { email: emailNorm },
      select: { id: true },
    });
    if (existing) return { ok: false as const, reason: "email_exists" as const };

    const user = await tx.user.create({
      data: { email: emailNorm, name },
      select: { id: true },
    });

    return { ok: true as const, userId: user.id };
  });
}
