import type { Metadata } from "next";
import { adminTokenIsValid } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "Admin · Analytics",
};

export const dynamic = "force-dynamic";

type SP = Promise<{
  token?: string | string[];
  range?: string | string[];
}>;

function pick(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

type Range = "7d" | "30d" | "90d" | "all";
const RANGES: { key: Range; label: string; days: number | null }[] = [
  { key: "7d", label: "Últimos 7 días", days: 7 },
  { key: "30d", label: "Últimos 30 días", days: 30 },
  { key: "90d", label: "Últimos 90 días", days: 90 },
  { key: "all", label: "Todo el histórico", days: null },
];

function fmtPct(n: number): string {
  if (!Number.isFinite(n) || n === 0) return "0,0%";
  return new Intl.NumberFormat("es-ES", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(n);
}

function fmtInt(n: number | bigint): string {
  const num = typeof n === "bigint" ? Number(n) : n;
  return new Intl.NumberFormat("es-ES").format(num);
}

/**
 * /admin/analytics — dashboard interno de conversión.
 *
 * Lee `events` directamente con Prisma. Sustituye a Plausible / GA4.
 * Solo accesible con `?token=ADMIN_EXPORT_TOKEN`.
 *
 * Métricas mostradas para el rango seleccionado:
 *
 *   - Big numbers: page_load · cta_click · checkout_start · purchase_completed
 *   - Embudo: page_load → checkout_start → purchase_completed con ratios
 *   - Daily series (page_load por día) renderizada como barras CSS
 *   - Top paths · top UTM source/medium/campaign · top referrer hosts
 *   - Breakdown por abVariant si hay alguno registrado
 */
export default async function AdminAnalyticsPage({
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
            Esta página requiere el parámetro <code>?token=…</code> con el valor de{" "}
            <code>ADMIN_EXPORT_TOKEN</code>.
          </p>
        </div>
      </main>
    );
  }

  const rangeParam = (pick(sp.range) || "30d") as Range;
  const range = RANGES.find((r) => r.key === rangeParam) ?? RANGES[1]!;

  const since = range.days
    ? new Date(Date.now() - range.days * 24 * 60 * 60 * 1000)
    : null;

  const whereTime: Record<string, unknown> = {};
  if (since) whereTime["createdAt"] = { gte: since };

  // Run everything in parallel — keeps the dashboard snappy on large
  // tables. Note we slice to top-N at the DB level via take.
  const [
    totalAll,
    byKind,
    topPaths,
    topUtmSource,
    topUtmMedium,
    topUtmCampaign,
    topReferrer,
    abBreakdown,
  ] = await Promise.all([
    prisma.event.count({ where: whereTime }),
    prisma.event.groupBy({
      by: ["kind"],
      where: whereTime,
      _count: { kind: true },
      orderBy: { _count: { kind: "desc" } },
    }),
    prisma.event.groupBy({
      by: ["path"],
      where: { ...whereTime, kind: "page_load", NOT: { path: null } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    prisma.event.groupBy({
      by: ["utmSource"],
      where: { ...whereTime, NOT: { utmSource: null } },
      _count: { utmSource: true },
      orderBy: { _count: { utmSource: "desc" } },
      take: 10,
    }),
    prisma.event.groupBy({
      by: ["utmMedium"],
      where: { ...whereTime, NOT: { utmMedium: null } },
      _count: { utmMedium: true },
      orderBy: { _count: { utmMedium: "desc" } },
      take: 10,
    }),
    prisma.event.groupBy({
      by: ["utmCampaign"],
      where: { ...whereTime, NOT: { utmCampaign: null } },
      _count: { utmCampaign: true },
      orderBy: { _count: { utmCampaign: "desc" } },
      take: 10,
    }),
    prisma.event.groupBy({
      by: ["referrerHost"],
      where: { ...whereTime, NOT: { referrerHost: null } },
      _count: { referrerHost: true },
      orderBy: { _count: { referrerHost: "desc" } },
      take: 10,
    }),
    prisma.event.groupBy({
      by: ["abVariant", "kind"],
      where: { ...whereTime, NOT: { abVariant: null } },
      _count: { abVariant: true },
    }),
  ]);

  // Daily series (last 30 days regardless of range filter — gives a
  // longer visual context).
  const daily = await prisma.$queryRaw<
    Array<{ day: Date; count: bigint }>
  >`
    SELECT date_trunc('day', created_at) AS day,
           COUNT(*)::bigint AS count
    FROM events
    WHERE kind = 'page_load'
      AND created_at >= NOW() - INTERVAL '30 days'
    GROUP BY day
    ORDER BY day ASC
  `;

  // Build the 30-day axis (so empty days still render as zero bars).
  const dayMap = new Map<string, number>();
  for (const row of daily) {
    const k = new Date(row.day).toISOString().slice(0, 10);
    dayMap.set(k, Number(row.count));
  }
  const today = new Date();
  const axis: { date: Date; key: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const k = d.toISOString().slice(0, 10);
    axis.push({ date: d, key: k, count: dayMap.get(k) ?? 0 });
  }
  const dailyMax = axis.reduce((m, a) => Math.max(m, a.count), 0);

  // Funnel.
  const countOf = (k: string): number =>
    byKind.find((b) => b.kind === k)?._count.kind ?? 0;
  const pageLoads = countOf("page_load");
  const ctaClicks = countOf("cta_click");
  const checkoutStarts = countOf("checkout_start");
  const purchases = countOf("purchase_completed");
  const refundRequests = countOf("refund_requested");

  const rateLoadToCheckout = pageLoads > 0 ? checkoutStarts / pageLoads : 0;
  const rateCheckoutToPurchase =
    checkoutStarts > 0 ? purchases / checkoutStarts : 0;
  const rateLoadToPurchase = pageLoads > 0 ? purchases / pageLoads : 0;

  const tokenQS = encodeURIComponent(token);

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <h1 className="admin-h1">Analytics interna</h1>
        <p className="admin-sub">
          {fmtInt(totalAll)} eventos en {range.label.toLowerCase()}. Datos
          recogidos sólo si el visitante aceptó analytics en el banner.
        </p>
        <nav className="admin-pills">
          {RANGES.map((r) => (
            <a
              key={r.key}
              className={`admin-pill ${range.key === r.key ? "is-active" : ""}`}
              href={`/admin/analytics?token=${tokenQS}&range=${r.key}`}
            >
              {r.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="analytics-kpis">
        <KpiCard label="Page loads" value={fmtInt(pageLoads)} />
        <KpiCard label="Clicks en CTA" value={fmtInt(ctaClicks)} />
        <KpiCard label="Checkout iniciado" value={fmtInt(checkoutStarts)} />
        <KpiCard label="Compras" value={fmtInt(purchases)} accent />
        {refundRequests > 0 ? (
          <KpiCard
            label="Solicitudes de devolución"
            value={fmtInt(refundRequests)}
          />
        ) : null}
      </section>

      <section className="analytics-funnel">
        <h2 className="analytics-h2">Embudo</h2>
        <div className="analytics-funnel-rows">
          <FunnelRow
            label="Visitas (page_load)"
            count={pageLoads}
            max={Math.max(pageLoads, 1)}
          />
          <FunnelRow
            label="→ Click checkout"
            count={checkoutStarts}
            max={Math.max(pageLoads, 1)}
            note={`${fmtPct(rateLoadToCheckout)} de las visitas`}
          />
          <FunnelRow
            label="→ Compra confirmada"
            count={purchases}
            max={Math.max(pageLoads, 1)}
            note={`${fmtPct(rateCheckoutToPurchase)} del checkout · ${fmtPct(rateLoadToPurchase)} de las visitas`}
            accent
          />
        </div>
      </section>

      <section className="analytics-section">
        <h2 className="analytics-h2">Visitas por día (últimos 30 días)</h2>
        {dailyMax === 0 ? (
          <div className="admin-empty">Aún no hay visitas registradas.</div>
        ) : (
          <div className="analytics-daily">
            {axis.map((a) => {
              const heightPct = dailyMax > 0 ? (a.count / dailyMax) * 100 : 0;
              const isToday = a.key === new Date().toISOString().slice(0, 10);
              return (
                <div
                  key={a.key}
                  className={`analytics-daily-col ${isToday ? "is-today" : ""}`}
                  title={`${a.key} · ${a.count} visitas`}
                >
                  <span
                    className="analytics-daily-bar"
                    style={{ height: `${Math.max(heightPct, 2)}%` }}
                  />
                  <span className="analytics-daily-label">
                    {a.date.getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="analytics-grid">
        <Table
          title="Páginas más visitadas"
          rows={topPaths.map((r) => ({
            label: r.path ?? "—",
            count: r._count.path,
          }))}
          totalForPct={pageLoads}
        />
        <Table
          title="Top utm_source"
          rows={topUtmSource.map((r) => ({
            label: r.utmSource ?? "—",
            count: r._count.utmSource,
          }))}
          totalForPct={totalAll}
        />
        <Table
          title="Top utm_medium"
          rows={topUtmMedium.map((r) => ({
            label: r.utmMedium ?? "—",
            count: r._count.utmMedium,
          }))}
          totalForPct={totalAll}
        />
        <Table
          title="Top utm_campaign"
          rows={topUtmCampaign.map((r) => ({
            label: r.utmCampaign ?? "—",
            count: r._count.utmCampaign,
          }))}
          totalForPct={totalAll}
        />
        <Table
          title="Referrers"
          rows={topReferrer.map((r) => ({
            label: r.referrerHost ?? "—",
            count: r._count.referrerHost,
          }))}
          totalForPct={totalAll}
        />
        {abBreakdown.length > 0 ? (
          <Table
            title="A/B variants"
            rows={abBreakdown.map((r) => ({
              label: `${r.abVariant ?? "—"} · ${r.kind}`,
              count: r._count.abVariant,
            }))}
            totalForPct={totalAll}
          />
        ) : null}
      </section>

      <p className="analytics-foot">
        Datos guardados localmente en la tabla <code>events</code>. Para
        borrar todo el histórico: ejecuta{" "}
        <code>DELETE FROM events</code> en Railway.
      </p>
    </main>
  );
}

function KpiCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`analytics-kpi ${accent ? "is-accent" : ""}`}>
      <span className="analytics-kpi-label">{label}</span>
      <span className="analytics-kpi-value">{value}</span>
    </div>
  );
}

function FunnelRow({
  label,
  count,
  max,
  note,
  accent = false,
}: {
  label: string;
  count: number;
  max: number;
  note?: string;
  accent?: boolean;
}) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="analytics-funnel-row">
      <div className="analytics-funnel-head">
        <span className="analytics-funnel-label">{label}</span>
        <span className="analytics-funnel-count">{fmtInt(count)}</span>
      </div>
      <div className="analytics-funnel-bar-track">
        <span
          className={`analytics-funnel-bar ${accent ? "is-accent" : ""}`}
          style={{ width: `${Math.max(pct, 1)}%` }}
        />
      </div>
      {note ? <span className="analytics-funnel-note">{note}</span> : null}
    </div>
  );
}

function Table({
  title,
  rows,
  totalForPct,
}: {
  title: string;
  rows: { label: string; count: number }[];
  totalForPct: number;
}) {
  return (
    <div className="analytics-table">
      <h3 className="analytics-table-title">{title}</h3>
      {rows.length === 0 ? (
        <p className="analytics-table-empty">—</p>
      ) : (
        <ul className="analytics-table-rows">
          {rows.map((r, i) => {
            const pct = totalForPct > 0 ? r.count / totalForPct : 0;
            return (
              <li key={`${r.label}-${i}`} className="analytics-table-row">
                <span className="analytics-table-row-label" title={r.label}>
                  {r.label}
                </span>
                <span className="analytics-table-row-count">
                  {fmtInt(r.count)}
                </span>
                <span className="analytics-table-row-pct">{fmtPct(pct)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
