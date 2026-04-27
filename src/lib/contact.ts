import "server-only";

import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { prisma } from "./prisma";

/**
 * Unified marketing-contact helper.
 *
 * Called from every email-capture flow (workbook signup, review upload,
 * any future CTA) so every address ends up in one queryable table.
 *
 * Idempotent by email: re-entering the same email never duplicates a
 * row — we only update `lastSeenAt`, the `lastSource`, and append the
 * source to the `sources` set if it's new.
 *
 * Designed to be called AFTER the primary `prisma.create()` succeeds.
 * Failures are swallowed so the user-facing flow never breaks: the
 * contacts table is a marketing convenience, not a critical path.
 */

export type ContactSource = "workbook" | "resena";
export type ContactLang = "es" | "en";

export type UpsertContactInput = {
  email: string;
  source: ContactSource;
  name?: string | null;
  lang?: ContactLang;
  consentMarketing?: boolean;
  /** Free-form metadata. Stored as-is in the JSON column. */
  meta?: Prisma.InputJsonValue;
};

/**
 * Best-effort lang detection from the request's Accept-Language header.
 * Falls back to "es" — that's the project's primary audience.
 *
 * Lang lives in `localStorage` on the client (see LangProvider), so
 * server actions don't naturally see it. The forms can pass it
 * explicitly via a hidden input; this helper covers everything else.
 */
export async function detectLang(): Promise<ContactLang> {
  try {
    const h = await headers();
    const accept = (h.get("accept-language") ?? "").toLowerCase();
    if (accept.startsWith("en")) return "en";
    return "es";
  } catch {
    return "es";
  }
}

function normaliseEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * Upsert a contact by email. Never throws — logs and swallows.
 * Returns true on success, false on any failure.
 */
export async function upsertContact(input: UpsertContactInput): Promise<boolean> {
  const email = normaliseEmail(input.email);
  if (!email) return false;

  const lang = input.lang ?? "es";
  const consent = input.consentMarketing ?? true;
  const name = input.name?.trim() || null;

  try {
    const existing = await prisma.contact.findUnique({
      where: { email },
      select: { id: true, sources: true, name: true },
    });

    if (existing) {
      // Append source to the comma-separated set if not already present.
      const seen = new Set(
        existing.sources
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      );
      seen.add(input.source);
      const sources = Array.from(seen).join(",");

      await prisma.contact.update({
        where: { email },
        data: {
          // Don't overwrite a stored name with null on a later visit.
          name: name ?? existing.name,
          lastSource: input.source,
          sources,
          lang,
          consentMarketing: consent,
          // `meta` is replaced wholesale — last write wins. Keep it
          // simple; the Postgres rows are not the audit log.
          ...(input.meta !== undefined ? { meta: input.meta } : {}),
        },
      });
    } else {
      await prisma.contact.create({
        data: {
          email,
          name,
          firstSource: input.source,
          lastSource: input.source,
          sources: input.source,
          lang,
          consentMarketing: consent,
          ...(input.meta !== undefined ? { meta: input.meta } : {}),
        },
      });
    }

    return true;
  } catch (err) {
    // Don't break the user flow on a contacts-table hiccup.
    console.error("[contacts] upsert failed", { email, err });
    return false;
  }
}
