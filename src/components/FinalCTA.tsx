"use client";

import { useEffect, useRef } from "react";
import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";
import { SlotsCounter } from "./SlotsCounter";
import type { SlotsPayload } from "@/lib/slots";
import { useReducedMotion } from "@/lib/motion";

export function FinalCTA({ initialSlots }: { initialSlots: SlotsPayload }) {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const wm = watermarkRef.current;
    if (!section || !wm) return;
    let rafId: number | null = null;
    const update = () => {
      rafId = null;
      const rect = section.getBoundingClientRect();
      const clampedY = Math.max(-rect.height, Math.min(rect.height, -rect.top));
      const offset = clampedY * -0.1;
      wm.style.transform = `translate(0, calc(-50% + ${offset}px)) rotate(90deg)`;
    };
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  return (
    <section className="final-cta" ref={sectionRef}>
      <div className="final-cta-watermark" ref={watermarkRef}>
        {t.hero.coverMark}
      </div>
      <Reveal className="final-cta-inner">
        <div className="mono">{t.final.mono}</div>
        <h2>
          {t.final.h2Pre}
          <em>{t.final.h2Em}</em>
          <br />
          {t.final.h2Post}
        </h2>
        <p>{t.final.p}</p>
        <SlotsCounter initial={initialSlots} variant="dark" />
        <div className="cta-buttons">
          <a href="#buy" className="btn-primary-light">
            <span>{t.final.ctaPrimary}</span>
            <span className="arrow" />
          </a>
          <a href="#extracts" className="btn-ghost-light">
            <span>{t.final.ctaGhost}</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
