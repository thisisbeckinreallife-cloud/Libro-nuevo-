"use client";

import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";

// Three editorial voices — assigned by card index so the reader sees
// paper → ink (inverted) → paper-warm while scrolling, which breaks
// the uniform-card monotony the mobile view used to have.
const EXTRACT_VARIANTS = ["paper", "ink", "warm"] as const;

export function Extracts() {
  const { t } = useLang();
  return (
    <section className="extracts" id="extracts">
      <div className="wrap">
        <Reveal className="extracts-head">
          <div className="mono label">{t.extracts.label}</div>
          <h2>
            {t.extracts.h2Line1}
            <br />
            {t.extracts.h2Line2Pre}
            <em>{t.extracts.h2Line2Em}</em>
          </h2>
        </Reveal>

        <div className="extract-stack">
          {t.extracts.items.map((e, i) => {
            const variant = EXTRACT_VARIANTS[i % EXTRACT_VARIANTS.length];
            const num = String(i + 1).padStart(2, "0");
            return (
              <Reveal className={`extract extract--${variant}`} key={i}>
                <span className="extract-num" aria-hidden="true">
                  N°{num}
                </span>
                <div className="quote-mark" aria-hidden="true">
                  &ldquo;
                </div>
                <div className="chapter">{e.chapter}</div>
                <blockquote>
                  {e.pre}
                  <em>{e.em}</em>
                  {e.post}
                </blockquote>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
