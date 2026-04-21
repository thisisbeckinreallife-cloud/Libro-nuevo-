"use client";

import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";

export function BookIntro() {
  const { t } = useLang();
  return (
    <section className="book-intro" id="book">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="section-num">{t.book.secNum}</div>
        </Reveal>
        <div className="book-intro-grid">
          <Reveal className="book-intro-left">
            <div className="mono label">{t.book.label}</div>
            <h2>
              {t.book.h2Line1}
              <br />
              {t.book.h2Line2Prefix}
              <em>{t.book.h2Line2Em}</em>
              {t.book.h2Line2Suffix}
            </h2>
            <p>{t.book.p1}</p>
            <p>
              {t.book.p2Pre}
              <em>{t.book.p2Em}</em>
            </p>
          </Reveal>

          <Reveal>
            <div className="book-facts">
              {t.book.factsLabels.map((row) => (
                <div className="book-facts-row" key={row.k}>
                  <span className="k">{row.k}</span>
                  <span className="v italic">{row.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
