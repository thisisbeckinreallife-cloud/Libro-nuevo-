"use client";

import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";

export function Differentiation() {
  const { t } = useLang();
  return (
    <section className="diff">
      <div className="diff-marquee">
        <div className="diff-marquee-track">
          <span>Identity</span>
          <span>· Subconscious ·</span>
          <span>Income</span>
          <span>· Environment ·</span>
          <span>Method</span>
          <span>· Architecture ·</span>
          <span>Identity</span>
          <span>· Subconscious ·</span>
          <span>Income</span>
          <span>· Environment ·</span>
          <span>Method</span>
          <span>· Architecture ·</span>
        </div>
      </div>

      <div className="wrap">
        <Reveal className="section-head">
          <div className="section-num">{t.diff.secNum}</div>
          <h2 className="section-title">
            {t.diff.h2Pre}
            <em>{t.diff.h2Em}</em>
            <br />
            {t.diff.h2Post}
          </h2>
        </Reveal>

        <Reveal className="diff-grid">
          {t.diff.cells.map((c) => (
            <div className="diff-cell" key={c.n}>
              <div className="n">{c.n}</div>
              <div>
                <h4>
                  {c.h4Pre}
                  <em>{c.h4Em}</em>
                  <br />
                  {c.h4Post}
                </h4>
                <p>{c.p}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
