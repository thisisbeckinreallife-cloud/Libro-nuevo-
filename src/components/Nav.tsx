"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";

export function Nav() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <a href="#" className="nav-logo">
        Lara Lawn
        <small>{t.nav.tagline}</small>
      </a>
      <div className="nav-links">
        <a href="#book">{t.nav.book}</a>
        <a href="#method">{t.nav.method}</a>
        <a href="#lara">{t.nav.lara}</a>
        <a href="#extracts">{t.nav.extracts}</a>
        <a href="#faq">{t.nav.faq}</a>
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
        <a href="#buy" className="nav-cta">
          {t.nav.cta}
        </a>
      </div>
    </nav>
  );
}
