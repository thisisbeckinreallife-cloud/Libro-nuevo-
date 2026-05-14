import type { MetadataRoute } from "next";

/**
 * robots.txt — Next 14 App Router native.
 *
 * Permite indexar landing y páginas públicas. Bloquea áreas privadas
 * (admin, biblioteca, workbook, api). Apunta al sitemap dinámico.
 */
export default function robots(): MetadataRoute.Robots {
  const base =
    (process.env["NEXT_PUBLIC_SITE_URL"] ?? "").replace(/\/$/, "") ||
    "https://arkwright.laralawn.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/oferta", "/contacto", "/como-escuchar", "/resena", "/recuperar-acceso", "/legal/"],
        disallow: ["/admin", "/biblioteca", "/workbook", "/registro", "/api/", "/resena/recompensa"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
