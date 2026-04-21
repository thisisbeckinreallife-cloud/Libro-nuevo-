"use client";

import { Book3D } from "./Book3D";
import { useLang } from "./LangProvider";

export function Hero() {
  const { t } = useLang();

  return (
    <section className="hero">
      <div className="hero-watermark">Lara Lawn</div>

      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="dot" />
            <span className="mono">{t.hero.eyebrow}</span>
          </div>

          <h1>
            <span className="line">
              <span className="line-inner">{t.hero.h1Line1}</span>
            </span>
            <span className="line">
              <span className="line-inner">
                <em className="it">{t.hero.h1Line2}</em>
              </span>
            </span>
            <span className="line">
              <span className="line-inner">
                {t.hero.h1Line3Prefix}
                <span className="underline">{t.hero.h1Line3Number}</span>
              </span>
            </span>
          </h1>

          <p className="hero-lede">
            {t.hero.ledePre}
            <em>{t.hero.ledeEm}</em>
          </p>

          <div className="hero-cta-row">
            <a href="#buy" className="btn-primary">
              <span>{t.hero.ctaPrimary}</span>
              <span className="arrow" />
            </a>
            <a href="#extracts" className="btn-ghost">
              <span>{t.hero.ctaGhost}</span>
            </a>
          </div>

          <div className="hero-trust">
            <span>{t.hero.trustYears}</span>
            <span className="sep" />
            <span>{t.hero.trustWomen}</span>
            <span className="sep" />
            <span>Lara Lawn</span>
          </div>
        </div>

        <Book3D />
      </div>

      <div className="hero-meta">
        <span>{t.hero.metaLeft}</span>
        <span className="scroll">{t.hero.metaRight}</span>
      </div>
    </section>
  );
}
