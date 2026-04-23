"use client";

import Image from "next/image";
import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";

const PRESS_LOGOS = [
  { src: "/press/forbes_logo_hq.webp", alt: "Forbes", width: 5000, height: 1305 },
  { src: "/press/lofficiel_processed.webp", alt: "L'Officiel", width: 1280, height: 295 },
  { src: "/press/vanityfair_processed.webp", alt: "Vanity Fair", width: 1536, height: 337 },
  { src: "/press/variety_processed.png", alt: "Variety", width: 920, height: 261 },
] as const;

export function Proof() {
  const { t } = useLang();
  return (
    <section className="proof">
      <div className="wrap">
        <Reveal className="proof-head">
          <div>
            <div
              className="mono"
              style={{ color: "var(--accent)", marginBottom: 18 }}
            >
              {t.proof.label}
            </div>
            <h2>
              {t.proof.h2Pre}
              <em>{t.proof.h2Em}</em>
            </h2>
          </div>
          <div className="count">
            {t.proof.count}
            <small>{t.proof.countSmall}</small>
          </div>
        </Reveal>

        <Reveal className="testimonial-grid">
          {t.proof.cards.map((c, i) => (
            <div className="testimonial" key={i}>
              <div className="stars" aria-label="5 stars">
                ★★★★★
              </div>
              <blockquote>{c.quote}</blockquote>
              <div className="who">
                <div className="avatar">{c.initial}</div>
                <div>
                  <div className="name">{c.name}</div>
                  <div className="role">{c.role}</div>
                </div>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal className="press-row">
          <div className="label">{t.proof.pressLabel}</div>
          <div className="press-marquee" aria-label={t.proof.pressLabel}>
            <div className="press-marquee-track">
              {[...PRESS_LOGOS, ...PRESS_LOGOS, ...PRESS_LOGOS].map((logo, i) => (
                <Image
                  key={`${logo.src}-${i}`}
                  src={logo.src}
                  alt={i < PRESS_LOGOS.length ? logo.alt : ""}
                  aria-hidden={i >= PRESS_LOGOS.length}
                  width={logo.width}
                  height={logo.height}
                  sizes="(max-width: 700px) 120px, 180px"
                  quality={92}
                  className="press-logo-img"
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
