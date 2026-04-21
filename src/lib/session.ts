import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "arkw_sid";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days

function hashSecret(secret: string): string {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

export async function issueSession(userId: string): Promise<void> {
  const secret = crypto.randomBytes(32).toString("base64url");
  const secretHash = hashSecret(secret);
  const expiresAt = new Date(Date.now() + MAX_AGE_SECONDS * 1000);
  await prisma.session.create({
    data: { userId, secretHash, expiresAt },
  });
  const jar = await cookies();
  jar.set(COOKIE_NAME, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function readSessionUserId(): Promise<string | null> {
  const jar = await cookies();
  const cookie = jar.get(COOKIE_NAME)?.value;
  if (!cookie) return null;
  const secretHash = hashSecret(cookie);
  const session = await prisma.session.findUnique({
    where: { secretHash },
    select: { userId: true, expiresAt: true },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) return null;
  return session.userId;
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  const cookie = jar.get(COOKIE_NAME)?.value;
  if (cookie) {
    const secretHash = hashSecret(cookie);
    await prisma.session.deleteMany({ where: { secretHash } });
  }
  jar.delete(COOKIE_NAME);
}
