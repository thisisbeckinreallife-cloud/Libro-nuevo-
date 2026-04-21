"use client";

import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";

export function Problem() {
  const { t } = useLang();
  return (
    <section className="problem">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="section-num">{t.problem.secNum}</div>
          <h2 className="section-title">
            {t.problem.h2a}
            <em>{t.problem.h2aEm}</em>
            <br />
            {t.problem.h2b}
          </h2>
        </Reveal>

        <Reveal className="problem-grid" stagger>
          {t.problem.cards.map((c) => (
            <div className="problem-card" key={c.n}>
              <div className="n">{c.n}</div>
              <h3>
                {c.title[0]}
                <em>{c.title[1]}</em>
                {c.title[2]}
              </h3>
              <p>{c.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
