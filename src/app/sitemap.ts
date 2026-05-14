import type { MetadataRoute } from "next";

/**
 * sitemap.xml — Next 14 App Router native.
 *
 * Listamos solo URLs públicas e indexables. Excluimos:
 *  - /admin/*       (chrome interno, robots.txt lo bloquea)
 *  - /biblioteca    (gated por accessToken — no público)
 *  - /api/*         (endpoints, no páginas)
 *  - /registro/*    (post-checkout, gated)
 *  - /resena/recompensa (gated por claim token)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    (process.env["NEXT_PUBLIC_SITE_URL"] ?? "").replace(/\/$/, "") ||
    "https://arkwright.laralawn.com";
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/oferta`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contacto`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/como-escuchar`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/resena`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/recuperar-acceso`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/legal/aviso-legal`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/legal/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/legal/terminos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/legal/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
