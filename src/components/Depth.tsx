"use client";

import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";

const ArrowIcon = () => (
  <svg width={24} height={10} viewBox="0 0 24 10" fill="none">
    <path
      d="M0 5H22M18 1L22 5L18 9"
      stroke="currentColor"
      strokeWidth={1}
    />
  </svg>
);

export function Depth() {
  const { t } = useLang();
  return (
    <section className="depth">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="section-num" style={{ color: "var(--accent)" }}>
            {t.depth.secNum}
          </div>
          <h2 className="section-title">
            {t.depth.h2Line1}
            <br />
            {t.depth.h2Line2Pre}
            <em>{t.depth.h2Line2Em}</em>
          </h2>
        </Reveal>

        <Reveal className="depth-list">
          {t.depth.items.map((it) => (
            <div className="depth-item" key={it.n}>
              <div className="n">{it.n}</div>
              <h3>
                {it.titlePre}
                <em>{it.titleEm}</em>
                {it.titlePost}
              </h3>
              <div className="desc">{it.desc}</div>
              <div className="arrow">
                <ArrowIcon />
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
