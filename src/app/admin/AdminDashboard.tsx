"use client";

import { useMemo, useState } from "react";

type Row = {
  id: string;
  email: string;
  name: string | null;
  firstSource: string;
  lastSource: string;
  sources: string;
  lang: string;
  firstSeenAt: string;
  lastSeenAt: string;
};

type Stats = {
  all: number;
  workbook: number;
  resena: number;
  es: number;
  en: number;
};

type Filters = {
  source: "workbook" | "resena" | null;
  lang: "es" | "en" | null;
  q: string;
};

export function AdminDashboard({
  token,
  rows,
  filteredCount,
  stats,
  filters,
}: {
  token: string;
  rows: Row[];
  filteredCount: number;
  stats: Stats;
  filters: Filters;
}) {
  const [search, setSearch] = useState(filters.q);

  const showingFiltered =
    filters.source !== null || filters.lang !== null || filters.q.length > 0;

  // Build the query string the dashboard uses both for filter links and
  // the CSV download URL. Token is included so the link is one-click.
  const buildHref = (overrides: Partial<Filters>) => {
    const next: Filters = { ...filters, ...overrides };
    const params = new URLSearchParams();
    params.set("token", token);
    if (next.source) params.set("source", next.source);
    if (next.lang) params.set("lang", next.lang);
    if (next.q) params.set("q", next.q);
    return `/admin?${params.toString()}`;
  };

  const csvHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("token", token);
    if (filters.source) params.set("source", filters.source);
    if (filters.lang) params.set("lang", filters.lang);
    // `q` is intentionally NOT forwarded — the CSV is the canonical
    // dataset for the active filter pills, not the typed search.
    return `/api/admin/contacts.csv?${params.toString()}`;
  }, [token, filters.source, filters.lang]);

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("token", token);
    if (filters.source) params.set("source", filters.source);
    if (filters.lang) params.set("lang", filters.lang);
    if (search.trim()) params.set("q", search.trim());
    window.location.href = `/admin?${params.toString()}`;
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">RESEÑA · WORKBOOK · CONTACTOS</p>
          <h1 className="admin-title">Lista de contactos</h1>
          <p className="admin-subtitle">
            Cada email capturado en <code>/registro</code> y <code>/resena</code>.
            Exporta a CSV para subir a Resend Audiences o Meta Ads
            Custom Audiences.
          </p>
        </div>
        <a className="admin-cta" href={csvHref} download>
          <span>Descargar CSV</span>
          <span className="arrow">↓</span>
        </a>
      </header>

      <section className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat-value">{stats.all.toLocaleString("es-ES")}</div>
          <div className="admin-stat-label">Total</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{stats.workbook.toLocaleString("es-ES")}</div>
          <div className="admin-stat-label">Workbook</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{stats.resena.toLocaleString("es-ES")}</div>
          <div className="admin-stat-label">Reseña</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{stats.es.toLocaleString("es-ES")}</div>
          <div className="admin-stat-label">Español</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-value">{stats.en.toLocaleString("es-ES")}</div>
          <div className="admin-stat-label">Inglés</div>
        </div>
      </section>

      <section className="admin-filters">
        <div className="admin-filter-group">
          <span className="admin-filter-label">Origen</span>
          <a
            className={`admin-pill ${filters.source === null ? "is-active" : ""}`}
            href={buildHref({ source: null })}
          >
            Todos
          </a>
          <a
            className={`admin-pill ${filters.source === "workbook" ? "is-active" : ""}`}
            href={buildHref({ source: "workbook" })}
          >
            Workbook
          </a>
          <a
            className={`admin-pill ${filters.source === "resena" ? "is-active" : ""}`}
            href={buildHref({ source: "resena" })}
          >
            Reseña
          </a>
        </div>

        <div className="admin-filter-group">
          <span className="admin-filter-label">Idioma</span>
          <a
            className={`admin-pill ${filters.lang === null ? "is-active" : ""}`}
            href={buildHref({ lang: null })}
          >
            Todos
          </a>
          <a
            className={`admin-pill ${filters.lang === "es" ? "is-active" : ""}`}
            href={buildHref({ lang: "es" })}
          >
            ES
          </a>
          <a
            className={`admin-pill ${filters.lang === "en" ? "is-active" : ""}`}
            href={buildHref({ lang: "en" })}
          >
            EN
          </a>
        </div>

        <form className="admin-search" onSubmit={onSearchSubmit}>
          <input
            type="search"
            placeholder="Buscar por email o nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </section>

      <section className="admin-results">
        <div className="admin-results-meta">
          {showingFiltered ? (
            <>
              Mostrando <strong>{filteredCount}</strong> de{" "}
              <strong>{stats.all}</strong> contactos
              {filteredCount === 500 ? " (límite de la tabla; CSV trae todos)" : ""}
            </>
          ) : (
            <>
              <strong>{stats.all}</strong> contactos en total
              {stats.all > 500 ? " · tabla limitada a 500 filas, CSV trae todos" : ""}
            </>
          )}
        </div>

        {rows.length === 0 ? (
          <div className="admin-empty">
            <p>No hay contactos que coincidan con estos filtros.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nombre</th>
                  <th>Orígenes</th>
                  <th>Lang</th>
                  <th>Primera vez</th>
                  <th>Última vez</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="admin-email">
                      <a href={`mailto:${r.email}`}>{r.email}</a>
                    </td>
                    <td>{r.name ?? "—"}</td>
                    <td>
                      {r.sources.split(",").filter(Boolean).map((s) => (
                        <span key={s} className={`admin-tag admin-tag-${s}`}>
                          {s}
                        </span>
                      ))}
                    </td>
                    <td>
                      <span className="admin-tag admin-tag-lang">{r.lang}</span>
                    </td>
                    <td className="admin-date">{fmtDate(r.firstSeenAt)}</td>
                    <td className="admin-date">{fmtDate(r.lastSeenAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
