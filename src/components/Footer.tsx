"use client";

import { usePathname } from "next/navigation";
import { useLang } from "./LangProvider";

export function Footer() {
  const { lang, t } = useLang();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  const isES = lang === "es";

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
          <a href="/contacto">{isES ? "Contacto" : "Contact"}</a>
        </div>
        <div className="footer-legal">
          <a href="/legal/privacidad">{isES ? "Privacidad" : "Privacy"}</a>
          <a href="/legal/terminos">{isES ? "Términos" : "Terms"}</a>
          <a href="/legal/cookies">{isES ? "Cookies" : "Cookies"}</a>
          <a href="/legal/aviso-legal">{isES ? "Aviso legal" : "Legal notice"}</a>
        </div>
        <div className="footer-copy">
          © 2026 INNERAXIS S.L. · {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
