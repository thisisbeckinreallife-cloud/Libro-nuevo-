"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";

export function StickyMobileCTA() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`sticky-cta${show ? " show" : ""}`}>
      <div className="row">
        <div className="price">{t.sticky.title}</div>
        <a href="#buy" className="btn">
          {t.sticky.cta}
        </a>
      </div>
    </div>
  );
}
