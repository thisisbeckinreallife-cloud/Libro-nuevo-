"use client";

import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";
import { SlotsCounter } from "./SlotsCounter";
import type { SlotsPayload } from "@/lib/slots";

export function FinalCTA({ initialSlots }: { initialSlots: SlotsPayload }) {
  const { t } = useLang();
  return (
    <section className="final-cta">
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
