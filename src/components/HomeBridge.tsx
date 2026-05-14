"use client";

import { useLang } from "./LangProvider";

/**
 * Editorial bridge — the one block the home (/) has that /oferta does
 * not. Lifts the strongest Before / After framing from the existing
 * Transformation component into a single side-by-side card layout.
 *
 * The same conversion-optimised buyer experience is preserved on both
 * routes; the home just gets this extra emotional beat in the middle.
 */
export function HomeBridge() {
  const { t } = useLang();
  const tr = t.transformation;

  return (
    <section className="home-bridge" aria-label={tr.secNum}>
      <h2 className="home-bridge-h2">
        {tr.h2Pre}
        <em>{tr.h2PreEm}</em>
        {tr.h2Mid}
        <em>{tr.h2Post}</em>
        {tr.h2Tail}
      </h2>
      <div className="home-bridge-grid">
        <article className="home-bridge-col home-bridge-col--before">
          <p className="home-bridge-label">{tr.before.label}</p>
          <h3 className="home-bridge-title">{tr.before.title}</h3>
          <ul className="home-bridge-list">
            {tr.before.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </article>
        <article className="home-bridge-col home-bridge-col--after">
          <p className="home-bridge-label">{tr.after.label}</p>
          <h3 className="home-bridge-title">
            {tr.after.titlePre}
            <em>{tr.after.titleEm}</em>
          </h3>
          <ul className="home-bridge-list">
            {tr.after.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
