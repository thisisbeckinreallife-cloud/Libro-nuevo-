"use client";

import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";

export function Transformation() {
  const { t } = useLang();
  return (
    <section className="transformation" id="method">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="section-num">{t.transformation.secNum}</div>
          <h2 className="section-title">
            {t.transformation.h2Pre}
            <em>{t.transformation.h2PreEm}</em>
            {t.transformation.h2Mid}
            <em>{t.transformation.h2Post}</em>
            {t.transformation.h2PostEm}
            {t.transformation.h2Tail}
          </h2>
        </Reveal>

        <Reveal className="transform-grid">
          <div className="transform-col before">
            <div className="mono label">{t.transformation.before.label}</div>
            <h3>{t.transformation.before.title}</h3>
            <ul>
              {t.transformation.before.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="transform-col after">
            <div className="mono label">{t.transformation.after.label}</div>
            <h3>
              {t.transformation.after.titlePre}
              <em>{t.transformation.after.titleEm}</em>
            </h3>
            <ul>
              {t.transformation.after.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
