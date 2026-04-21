"use client";

import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";

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
          <div className="label">
            {t.proof.pressLabel}{" "}
            <span className="placeholder-flag">placeholder</span>
          </div>
          <div className="press-logos">
            <div className="press-logo">Vogue</div>
            <div className="press-logo">Forbes</div>
            <div className="press-logo">Harper&rsquo;s</div>
            <div className="press-logo">El País</div>
            <div className="press-logo">Elle</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
