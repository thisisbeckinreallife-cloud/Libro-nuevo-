"use client";

import { usePathname } from "next/navigation";
import { useLang } from "./LangProvider";

export function Footer() {
  const { t } = useLang();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-logo">
          <img src="/lara-lawn-logo.png" alt="Lara Lawn — Identity Architect" />
        </div>
        <div className="footer-links">
          <a href="/#book">{t.footer.book}</a>
          <a href="/#lara">{t.footer.author}</a>
          <a href="/#faq">{t.nav.faq}</a>
          <a href="mailto:info@laralawn.com">{t.footer.contact}</a>
        </div>
        <div className="footer-copy">
          © 2026 Lara Lawn · {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
