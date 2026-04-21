"use client";

import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";

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
          {t.extracts.items.map((e, i) => (
            <Reveal className="extract" key={i}>
              <div className="quote-mark">&ldquo;</div>
              <div className="chapter">{e.chapter}</div>
              <blockquote>
                {e.pre}
                <em>{e.em}</em>
                {e.post}
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
