"use client";

import type { ReactNode } from "react";
import { useLang } from "./LangProvider";

/**
 * Shared layout for the 4 legal pages (privacidad, términos, cookies,
 * aviso-legal). Consistent typography, max-width, last-updated stamp.
 *
 * Each legal page just renders its content as children — this layout
 * handles the visual shell + the "back to home" CTA.
 *
 * Uses the same `biblioteca-shell` reading width as /biblioteca and
 * /como-escuchar so the legal pages don't feel like a different site.
 */
export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  const { lang } = useLang();
  return (
    <main className="legal-shell">
      <article className="legal-article">
        <header className="legal-header">
          <p className="legal-eyebrow">{lang === "es" ? "Legal" : "Legal"}</p>
          <h1 className="legal-h1">{title}</h1>
          <p className="legal-meta">
            {lang === "es"
              ? "Última actualización: "
              : "Last updated: "}
            {lastUpdated}
          </p>
        </header>
        <div className="legal-content">{children}</div>
        <footer className="legal-foot">
          <a href="/" className="legal-back">
            {lang === "es" ? "← Volver al inicio" : "← Back to home"}
          </a>
        </footer>
      </article>
    </main>
  );
}
