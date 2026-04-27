import { NextResponse, type NextRequest } from "next/server";
import { adminTokenIsValid } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/contacts.csv?token=...&source=workbook|resena&lang=es|en
 *
 * Streams the contacts table as a CSV file. Used by the /admin
 * dashboard's download button and by anyone who has the admin token
 * bookmarked for direct download.
 *
 * Filters are optional. Without filters → all contacts.
 *
 * The CSV is shaped for direct upload to:
 *   - Resend Audiences (column `email` is detected automatically)
 *   - Meta Ads Custom Audiences (Customer List)
 *   - Any newsletter tool that accepts a CSV with a header row
 */

export const dynamic = "force-dynamic";

type Filter = {
  source?: "workbook" | "resena";
  lang?: "es" | "en";
};

function csvEscape(value: string | null | undefined): string {
  if (value == null) return "";
  const s = String(value);
  // RFC 4180 — quote if it contains comma, quote, CR, or LF.
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!adminTokenIsValid(token)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const f: Filter = {};
  const sourceParam = url.searchParams.get("source");
  if (sourceParam === "workbook" || sourceParam === "resena") f.source = sourceParam;
  const langParam = url.searchParams.get("lang");
  if (langParam === "es" || langParam === "en") f.lang = langParam;

  // Build the where clause. `sources` is a comma-separated set so we
  // use `contains` for "any time this source has been seen", not just
  // the most recent one. That's the more useful default for marketing.
  const where: Record<string, unknown> = {};
  if (f.source) where["sources"] = { contains: f.source };
  if (f.lang) where["lang"] = f.lang;

  const rows = await prisma.contact.findMany({
    where,
    orderBy: { firstSeenAt: "desc" },
    select: {
      email: true,
      name: true,
      firstSource: true,
      lastSource: true,
      sources: true,
      lang: true,
      consentMarketing: true,
      firstSeenAt: true,
      lastSeenAt: true,
    },
  });

  const header = [
    "email",
    "name",
    "first_source",
    "last_source",
    "sources",
    "lang",
    "consent_marketing",
    "first_seen_at",
    "last_seen_at",
  ].join(",");

  const lines = rows.map((r) =>
    [
      csvEscape(r.email),
      csvEscape(r.name),
      csvEscape(r.firstSource),
      csvEscape(r.lastSource),
      csvEscape(r.sources),
      csvEscape(r.lang),
      r.consentMarketing ? "true" : "false",
      r.firstSeenAt.toISOString(),
      r.lastSeenAt.toISOString(),
    ].join(","),
  );

  // Prepend BOM so Excel/Numbers detect UTF-8 (names with accents etc).
  const body = "﻿" + header + "\n" + lines.join("\n") + "\n";

  const filenameDate = new Date().toISOString().slice(0, 10);
  const suffix = [f.source, f.lang].filter(Boolean).join("-");
  const filename =
    suffix.length > 0
      ? `contacts-${suffix}-${filenameDate}.csv`
      : `contacts-${filenameDate}.csv`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
