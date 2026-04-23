"use client";

import { BookStatic } from "./BookStatic";
import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";
import { SlotsCounter } from "./SlotsCounter";
import type { SlotsPayload } from "@/lib/slots";

export function Buy({ initialSlots }: { initialSlots: SlotsPayload }) {
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

            <div className="buy-options">
              <div className="buy-option featured">
                <span className="tag">{t.buy.featuredTag}</span>
                <div className="buy-option-left">
                  <div className="format">{t.buy.featuredFormat}</div>
                  <div className="detail">{t.buy.featuredDetail}</div>
                </div>
                <div className="buy-option-right">
                  <span className="price">27&nbsp;€</span>
                </div>
              </div>
            </div>

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

            <SlotsCounter initial={initialSlots} variant="light" showSubcopy />

            <div className="buy-cta">
              <a
                href="https://amazon.com"
                className="btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{t.buy.cta}</span>
                <span className="arrow" />
              </a>
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
