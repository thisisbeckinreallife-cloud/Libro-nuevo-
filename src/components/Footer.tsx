"use client";

import { useLang } from "./LangProvider";

export function Footer() {
  const { t } = useLang();
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-logo">Lara Lawn</div>
        <div className="footer-links">
          <a href="#book">{t.footer.book}</a>
          <a href="#lara">{t.footer.author}</a>
          <a href="#faq">{t.nav.faq}</a>
          <a href="#">{t.footer.contact}</a>
        </div>
        <div className="footer-copy">
          © 2026 Lara Lawn · {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
