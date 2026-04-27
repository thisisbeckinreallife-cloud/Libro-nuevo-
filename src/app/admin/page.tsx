import type { Metadata } from "next";
import { adminTokenIsValid } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "./AdminDashboard";

// Keep search engines out — even the gate page leaks the existence of
// the dashboard otherwise.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "Admin · Contactos",
};

/**
 * Admin dashboard for the unified contacts table.
 *
 *   /admin?token=... [&source=workbook|resena] [&lang=es|en] [&q=...]
 *
 * Server-rendered: validates the token here so we never ship contact
 * data to the client unless the request is authorised. The client
 * component handles UI (filter pills, search, copy-to-clipboard).
 *
 * No login form — this is a single-operator surface (you). The token
 * lives in your bookmarks or a password manager. If you want a real
 * login screen later, add it on top.
 */

export const dynamic = "force-dynamic";

type SP = Promise<{
  token?: string | string[];
  source?: string | string[];
  lang?: string | string[];
  q?: string | string[];
}>;

function pick(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export default async function AdminPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const token = pick(sp.token);

  if (!adminTokenIsValid(token)) {
    return (
      <main className="admin-shell">
        <div className="admin-gate">
          <h1>Acceso restringido</h1>
          <p>
            Esta página requiere el parámetro <code>?token=…</code> con el
            valor de <code>ADMIN_EXPORT_TOKEN</code>.
          </p>
        </div>
      </main>
    );
  }

  // Filters from URL.
  const sourceParam = pick(sp.source);
  const langParam = pick(sp.lang);
  const q = pick(sp.q).trim().toLowerCase();

  const filterSource =
    sourceParam === "workbook" || sourceParam === "resena" ? sourceParam : null;
  const filterLang = langParam === "es" || langParam === "en" ? langParam : null;

  // Build where for filtered list.
  const where: Record<string, unknown> = {};
  if (filterSource) where["sources"] = { contains: filterSource };
  if (filterLang) where["lang"] = filterLang;
  if (q) {
    where["OR"] = [
      { email: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ];
  }

  // Run all the counts + the page query in parallel — keeps the page
  // snappy even with thousands of rows.
  const [filtered, totalAll, totalWorkbook, totalResena, totalEs, totalEn] =
    await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { lastSeenAt: "desc" },
        take: 500, // cap UI render — full export is via the CSV endpoint
        select: {
          id: true,
          email: true,
          name: true,
          firstSource: true,
          lastSource: true,
          sources: true,
          lang: true,
          firstSeenAt: true,
          lastSeenAt: true,
        },
      }),
      prisma.contact.count(),
      prisma.contact.count({ where: { sources: { contains: "workbook" } } }),
      prisma.contact.count({ where: { sources: { contains: "resena" } } }),
      prisma.contact.count({ where: { lang: "es" } }),
      prisma.contact.count({ where: { lang: "en" } }),
    ]);

  // Serialize for client (Date → ISO string).
  const rows = filtered.map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    firstSource: r.firstSource,
    lastSource: r.lastSource,
    sources: r.sources,
    lang: r.lang,
    firstSeenAt: r.firstSeenAt.toISOString(),
    lastSeenAt: r.lastSeenAt.toISOString(),
  }));

  return (
    <AdminDashboard
      token={token}
      rows={rows}
      filteredCount={filtered.length}
      stats={{
        all: totalAll,
        workbook: totalWorkbook,
        resena: totalResena,
        es: totalEs,
        en: totalEn,
      }}
      filters={{
        source: filterSource,
        lang: filterLang,
        q,
      }}
    />
  );
}
