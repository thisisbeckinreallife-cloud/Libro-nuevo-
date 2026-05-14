"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { OfertaCta } from "./OfertaCta";

/**
 * Botón fijo en la parte inferior del viewport (solo móvil) que
 * aparece tras hacer scroll fuera del Hero. Garantiza que el CTA
 * siempre esté a un dedo de distancia, sin importar dónde está el
 * usuario en la landing. En desktop queda oculto por CSS.
 */
export function OfertaStickyCta() {
  const { t } = useLang();
  const o = t.oferta.finalCta;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Mostrar tras los primeros 600 px (~ después del Hero).
      setVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`oferta-sticky ${visible ? "is-visible" : ""}`}
      aria-hidden={!visible}
    >
      <OfertaCta
        label={o.stickyMobileCta}
        variant="primary"
        ariaLabel={o.cta}
      />
    </div>
  );
}
