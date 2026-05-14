import "server-only";

import crypto from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Server-side error logger — Sentry replacement using our own
 * Postgres table. Best-effort: if the DB write itself fails, we log
 * to stderr and swallow the error so the original request flow
 * doesn't blow up because the error logger blew up.
 *
 * Called from API routes that want to surface a 5xx in /admin/errors.
 */

export type LogErrorInput = {
  source: string; // "checkout" | "webhook" | "contacto" | "biblioteca" | ...
  error: unknown;
  path?: string | undefined;
  userAgent?: string | null | undefined;
  ip?: string | null | undefined;
  meta?: Prisma.InputJsonValue | undefined;
};

function hashIp(ip: string | null | undefined): string | undefined {
  if (!ip) return undefined;
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

function asError(e: unknown): { message: string; stack?: string } {
  if (e instanceof Error) {
    return { message: e.message, ...(e.stack ? { stack: e.stack } : {}) };
  }
  return { message: typeof e === "string" ? e : JSON.stringify(e) };
}

export async function logError(input: LogErrorInput): Promise<void> {
  const { source, error, path, userAgent, ip, meta } = input;
  const { message, stack } = asError(error);

  // Always emit to stderr too — useful for Railway logs even before
  // someone opens /admin/errors.
  console.error(`[${source}]`, message, stack ?? "");

  try {
    await prisma.errorLog.create({
      data: {
        source,
        message: message.slice(0, 2000),
        ...(stack ? { stack: stack.slice(0, 8000) } : {}),
        ...(path ? { path: path.slice(0, 500) } : {}),
        ...(userAgent ? { userAgent: userAgent.slice(0, 500) } : {}),
        ...(hashIp(ip) ? { ipHash: hashIp(ip) } : {}),
        ...(meta !== undefined ? { meta } : {}),
      },
    });
  } catch (dbErr) {
    // Don't recurse — the error logger failing is not actionable
    // by the caller, just print.
    console.error("[logError] failed to persist", dbErr);
  }
}
