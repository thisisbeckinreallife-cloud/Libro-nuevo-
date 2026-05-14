"use client";

import { BookStatic } from "./BookStatic";
import { BuyDigitalCta } from "./BuyDigitalCta";
import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";
import type { SlotsPayload } from "@/lib/slots";

// Mantiene la prop por compatibilidad con la home, aunque ya no
// renderizamos el SlotsCounter (era exclusivo de la edición física).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Buy({ initialSlots: _initialSlots }: { initialSlots: SlotsPayload }) {
  const { t } = useLang();
  return (
    <section className="buy" id="buy">
      <div className="wrap">
        <div className="buy-grid">
          <Reveal className="buy-visual">
            <div className="book-hero">
              <BookStatic />
            </div>
          </Reveal>

          <Reveal className="buy-text">
            <div className="mono label">{t.buy.secNum}</div>
            <h2>
              {t.buy.h2Line1Pre}
              <em>{t.buy.h2Line1Em}</em>
              <br />
              {t.buy.h2Line2}
            </h2>
            <p>{t.buy.p}</p>

            {/* Oferta principal: pack digital €12 — Stripe checkout. */}
            <BuyDigitalCta />

            <div className="buy-bonus">
              <div className="buy-bonus-head">
                <span className="mono label">{t.buy.bonusStack.label}</span>
                <p className="buy-bonus-intro">{t.buy.bonusStack.intro}</p>
              </div>
              <ul className="buy-bonus-list">
                {t.buy.bonusStack.items.map((item, i) => (
                  <li key={i} className="buy-bonus-item">
                    <span className="buy-bonus-mark" aria-hidden="true" />
                    <div className="buy-bonus-body">
                      <strong className="buy-bonus-title">
                        {item.titlePre}
                        <em>{item.titleEm}</em>
                      </strong>
                      <span className="buy-bonus-detail">{item.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <span className="buy-bonus-foot">{t.buy.bonusStack.foot}</span>
            </div>

            {/* Separador antes de la edición física que llegará más adelante. */}
            <div className="buy-cta-sep" aria-hidden="true">
              <span className="rule" />
              <span className="buy-cta-sep-label">{t.buy.digital.orSep}</span>
              <span className="rule" />
            </div>

            <div className="buy-cta">
              <span className="btn-secondary is-disabled" aria-disabled="true">
                <span>{t.buy.cta}</span>
              </span>
            </div>
            <div className="buy-note">
              <span className="dot" />
              <span>{t.buy.note}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
