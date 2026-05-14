"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";

/**
 * Fixed bottom CTA on mobile only. Appears after the hero scrolls
 * out of view. Clicking it scrolls to the pricing grid so the buyer
 * sees the three editions instead of firing Stripe blind. Hidden by
 * CSS on desktop.
 */
export function OfertaStickyCta() {
  const { t } = useLang();
  const o = t.oferta.finalCta;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = () => {
    const el = document.getElementById("pricing");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`oferta-sticky ${visible ? "is-visible" : ""}`}
      aria-hidden={!visible}
    >
      <button type="button" onClick={onClick} aria-label={o.cta}>
        {o.stickyMobileCta}
      </button>
    </div>
  );
}
