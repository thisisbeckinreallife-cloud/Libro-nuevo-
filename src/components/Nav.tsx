"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "./LangProvider";

export function Nav() {
  const { t, lang, setLang } = useLang();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <a href="/" className="nav-logo" aria-label="Lara Lawn — Identity Architect">
        <img src="/lara-lawn-logo.png" alt="Lara Lawn — Identity Architect" />
      </a>
      <div className="nav-links">
        <a href="/#pricing">{t.nav.book}</a>
        <a href="/#inside">{t.nav.method}</a>
        <a href="/#lara">{t.nav.lara}</a>
        <a href="/#reviews">{t.nav.extracts}</a>
        <a href="/#faq">{t.nav.faq}</a>
      </div>
      <div className="nav-right">
        <div className="lang-toggle" role="group" aria-label="Language">
          <button
            type="button"
            className={lang === "es" ? "active" : ""}
            onClick={() => setLang("es")}
            aria-pressed={lang === "es"}
          >
            ES
          </button>
          <button
            type="button"
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
            aria-pressed={lang === "en"}
          >
            EN
          </button>
        </div>
        <a href="/#pricing" className="nav-cta">
          {t.nav.cta}
        </a>
      </div>
    </nav>
  );
}
