"use client";

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
              <div className="book-cover">
                <div>
                  <div className="book-cover-top">{t.hero.coverTopline}</div>
                </div>
                <div>
                  <div className="book-mark">{t.hero.coverMark}</div>
                  <h2 className="book-cover-title">
                    {t.hero.coverTitleLine1}
                    <br />
                    <em>{t.hero.coverTitleLine2}</em>
                  </h2>
                </div>
                <div className="book-cover-author">{t.hero.coverAuthor}</div>
              </div>
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
                  <span className="price">—€</span>
                  <span className="placeholder-flag">{t.buy.priceFlag}</span>
                </div>
              </div>
              <div className="buy-option">
                <div className="buy-option-left">
                  <div className="format">{t.buy.ebookFormat}</div>
                  <div className="detail">{t.buy.ebookDetail}</div>
                </div>
                <div className="buy-option-right">
                  <span className="price">—€</span>
                  <span className="placeholder-flag">{t.buy.priceFlag}</span>
                </div>
              </div>
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
