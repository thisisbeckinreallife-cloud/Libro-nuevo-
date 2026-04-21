import "server-only";

import { prisma } from "./prisma";

export type ClaimInput = {
  token: string;
  email: string;
  name: string | null;
};

export type ClaimResult =
  | { ok: true; userId: string; tokenId: string }
  | {
      ok: false;
      reason: "token_not_found" | "token_claimed" | "email_exists";
    };

type TokenRow = { id: string; status: "unissued" | "claimed" | "revoked" };

export async function claimBonus(input: ClaimInput): Promise<ClaimResult> {
  const emailNorm = input.email.trim().toLowerCase();
  const name = input.name?.trim() || null;

  return prisma.$transaction(async (tx) => {
    // Serialise concurrent claims on the same token
    const tokenRows = await tx.$queryRaw<TokenRow[]>`
      SELECT id, status::text AS status
      FROM bonus_tokens
      WHERE token = ${input.token}
      FOR UPDATE
    `;
    const tokenRow = tokenRows[0];
    if (!tokenRow) return { ok: false as const, reason: "token_not_found" as const };
    if (tokenRow.status !== "unissued") {
      return { ok: false as const, reason: "token_claimed" as const };
    }

    const existingUser = await tx.user.findUnique({
      where: { email: emailNorm },
      select: { id: true },
    });
    if (existingUser) {
      return { ok: false as const, reason: "email_exists" as const };
    }

    const user = await tx.user.create({
      data: { email: emailNorm, name },
      select: { id: true },
    });

    await tx.claim.create({
      data: { userId: user.id, tokenId: tokenRow.id },
    });

    await tx.bonusToken.update({
      where: { id: tokenRow.id },
      data: { status: "claimed", claimedAt: new Date() },
    });

    await tx.$executeRaw`
      UPDATE counter_cache
      SET claimed_count = (SELECT COUNT(*)::int FROM claims),
          updated_at = NOW()
      WHERE id = 1
    `;

    return { ok: true as const, userId: user.id, tokenId: tokenRow.id };
  });
}

export async function isTokenClaimedByUser(
  token: string,
  userId: string,
): Promise<boolean> {
  const row = await prisma.bonusToken.findUnique({
    where: { token },
    select: {
      claim: { select: { userId: true } },
    },
  });
  return !!row?.claim && row.claim.userId === userId;
}

export type TokenLookup =
  | { kind: "unknown" }
  | { kind: "revoked" }
  | { kind: "unissued"; tokenId: string }
  | { kind: "claimed"; tokenId: string; claimantUserId: string };

export async function lookupToken(token: string): Promise<TokenLookup> {
  if (!/^[A-Za-z0-9_-]{20,32}$/.test(token)) return { kind: "unknown" };
  const row = await prisma.bonusToken.findUnique({
    where: { token },
    select: {
      id: true,
      status: true,
      claim: { select: { userId: true } },
    },
  });
  if (!row) return { kind: "unknown" };
  if (row.status === "revoked") return { kind: "revoked" };
  if (row.status === "unissued") return { kind: "unissued", tokenId: row.id };
  return {
    kind: "claimed",
    tokenId: row.id,
    claimantUserId: row.claim?.userId ?? "",
  };
}
