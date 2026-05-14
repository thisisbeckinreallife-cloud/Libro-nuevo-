import type { Metadata } from "next";
import { adminTokenIsValid } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "Admin · Errors",
};

export const dynamic = "force-dynamic";

type SP = Promise<{
  token?: string | string[];
  source?: string | string[];
}>;

function pick(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

/**
 * /admin/errors — lectura de la tabla `error_logs`. Sustituye a
 * Sentry para este proyecto. Solo visible con el mismo token de
 * admin (ADMIN_EXPORT_TOKEN). Lista últimos 200 errores ordenados
 * por fecha desc.
 */
export default async function AdminErrorsPage({
  searchParams,
}: {
  searchParams: SP;
}) {
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

  const filterSource = pick(sp.source);
  const where: Record<string, unknown> = {};
  if (filterSource) where["source"] = filterSource;

  const [rows, totalAll, sourcesAgg] = await Promise.all([
    prisma.errorLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.errorLog.count(),
    prisma.errorLog.groupBy({
      by: ["source"],
      _count: { source: true },
      orderBy: { _count: { source: "desc" } },
    }),
  ]);

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <h1 className="admin-h1">Errores del servidor</h1>
        <p className="admin-sub">
          Mostrando los últimos {rows.length} registros · total{" "}
          {totalAll.toLocaleString("es-ES")} desde el inicio.
        </p>
        <nav className="admin-pills">
          <a
            className={`admin-pill ${!filterSource ? "is-active" : ""}`}
            href={`/admin/errors?token=${encodeURIComponent(token)}`}
          >
            Todos · {totalAll}
          </a>
          {sourcesAgg.map((s) => (
            <a
              key={s.source}
              className={`admin-pill ${filterSource === s.source ? "is-active" : ""}`}
              href={`/admin/errors?token=${encodeURIComponent(token)}&source=${encodeURIComponent(s.source)}`}
            >
              {s.source} · {s._count.source}
            </a>
          ))}
        </nav>
      </header>

      {rows.length === 0 ? (
        <div className="admin-empty">
          <p>Sin errores registrados. 🎉</p>
        </div>
      ) : (
        <ul className="admin-error-list">
          {rows.map((r) => (
            <li key={r.id} className="admin-error-row">
              <div className="admin-error-head">
                <span className="admin-error-source">{r.source}</span>
                <time className="admin-error-time">
                  {r.createdAt.toLocaleString("es-ES")}
                </time>
              </div>
              <p className="admin-error-message">{r.message}</p>
              {r.path ? (
                <p className="admin-error-meta">
                  <span>Path:</span> <code>{r.path}</code>
                </p>
              ) : null}
              {r.stack ? (
                <details className="admin-error-stack">
                  <summary>Stack trace</summary>
                  <pre>{r.stack}</pre>
                </details>
              ) : null}
              {r.meta ? (
                <details className="admin-error-meta-block">
                  <summary>Metadata</summary>
                  <pre>{JSON.stringify(r.meta, null, 2)}</pre>
                </details>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
