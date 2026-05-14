"use client";

import Image from "next/image";
import { Book3D } from "@/components/Book3D";
import { useLang } from "@/components/LangProvider";
import { HomeBridge } from "@/components/HomeBridge";
import { OfertaPricingCards } from "./OfertaPricingCards";
import { OfertaStickyCta } from "./OfertaStickyCta";

/**
 * Conversion landing in the Hormozi shop.acquisition.com layout. Used
 * both at `/oferta` (paid traffic) and `/` (organic) so the buyer
 * experience is identical regardless of how they land.
 *
 * Sections:
 *   01 — Hero (5-star line + headline + book3D + sub)
 *   02 — Pricing card (single centred offer, 165 € → 12 €)
 *   03 — Trust band navy (4 stats with copper numbers)
 *   04 — Reviews grid (6 cards, paper background)
 *   05 — Meet Lara (portrait + bio + bullets + pull-quote)
 *   06 — What's inside (3 core + 3 bonus items)
 *   07a — Editorial bridge (home only: Before / After block)
 *   07 — Pricing card REPEATED (after value built)
 *   08 — Guarantee band navy (shield + 30-day text)
 *   09 — FAQ
 *   10 — Final CTA (paper-warm)
 *   11 — Sticky mobile bottom CTA
 *
 * The card fires the existing /api/checkout endpoint (Stripe live).
 *
 * `variant`:
 *   - "oferta" (default): canonical paid landing
 *   - "home":              renders the Editorial bridge between #06 and #07
 */
export function OfertaLanding({
  variant = "oferta",
}: { variant?: "oferta" | "home" } = {}) {
  const { t } = useLang();
  const o = t.oferta;

  return (
    <main className="oferta-shell">
      {/* 01 — HERO */}
      <section className="oferta-hero">
        <div className="oferta-hero-grid">
          <div className="oferta-hero-text">
            <p className="oferta-hero-stars">
              <span className="oferta-hero-stars-icons">★★★★★</span>
              <span>{o.hero.trustMicrocopy}</span>
            </p>
            <p className="oferta-eyebrow">{o.hero.eyebrow}</p>
            <h1 className="oferta-hero-h1">{o.hero.headline}</h1>
            <p className="oferta-hero-sub">{o.hero.subheadline}</p>
          </div>
          <div className="oferta-hero-visual">
            <div className="book-hero">
              <Book3D />
            </div>
          </div>
        </div>
      </section>

      {/* 02 — PRICING CARD */}
      <OfertaPricingCards id="pricing" />

      {/* 03 — TRUST BAND NAVY */}
      <section className="oferta-trust" aria-label={o.trust.eyebrow}>
        <div className="oferta-trust-inner">
          {o.trust.stats.map((s) => (
            <div key={s.label} className="oferta-trust-stat">
              <p className="oferta-trust-num">{s.num}</p>
              <p className="oferta-trust-label">{s.label}</p>
              {s.hasStars ? (
                <p className="oferta-trust-stars" aria-hidden="true">
                  ★★★★★
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* 04 — REVIEWS GRID */}
      <section className="oferta-reviews" id="reviews">
        <header className="oferta-reviews-header">
          <p className="oferta-eyebrow">{o.reviews.eyebrow}</p>
          <h2 className="oferta-h2">{o.reviews.headline}</h2>
        </header>
        <div className="oferta-reviews-grid">
          {o.reviews.items.map((r) => (
            <article key={r.name} className="oferta-review">
              <p className="oferta-review-stars" aria-hidden="true">
                ★★★★★
              </p>
              <p className="oferta-review-text">“{r.text}”</p>
              <div className="oferta-review-meta">
                <span className="oferta-review-avatar" aria-hidden="true">
                  {r.initial}
                </span>
                <span>
                  <strong>{r.name}</strong>
                  {r.role}
                </span>
                <span className="oferta-review-verified">
                  ✓ {r.verifiedLabel}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 05 — MEET LARA */}
      <section className="oferta-lara" id="lara">
        <div className="oferta-lara-grid">
          <div className="oferta-lara-portrait">
            <Image
              src="/lara-portrait.png"
              alt={o.lara.imageAlt}
              width={420}
              height={520}
              sizes="(max-width: 900px) 60vw, 320px"
            />
          </div>
          <div className="oferta-lara-text">
            <p className="oferta-eyebrow">{o.lara.eyebrow}</p>
            <h2 className="oferta-h2">{o.lara.headline}</h2>
            <p className="oferta-lara-bio">{o.lara.bio}</p>
            <ul className="oferta-lara-bullets">
              {o.lara.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <blockquote className="oferta-lara-quote">
              {o.lara.quote}
            </blockquote>
          </div>
        </div>
      </section>

      {/* 06 — WHAT'S INSIDE */}
      <section className="oferta-inside" id="inside">
        <header className="oferta-inside-header">
          <p className="oferta-eyebrow">{o.inside.eyebrow}</p>
          <h2 className="oferta-h2">{o.inside.headline}</h2>
          <p className="oferta-intro" style={{ margin: "0 auto" }}>
            {o.inside.intro}
          </p>
        </header>
        <div className="oferta-inside-grid">
          {o.inside.items.map((it) => (
            <article
              key={it.title}
              className={`oferta-inside-item ${
                it.bonus ? "oferta-inside-item--bonus" : ""
              }`}
            >
              <span className="oferta-inside-item-icon" aria-hidden="true">
                {it.bonus ? "✦" : "✓"}
              </span>
              <h3 className="oferta-inside-item-title">{it.title}</h3>
              <p className="oferta-inside-item-detail">{it.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 07a — EDITORIAL BRIDGE (home only) */}
      {variant === "home" ? <HomeBridge /> : null}

      {/* 07 — PRICING REPEATED */}
      <OfertaPricingCards id="pricing-2" />

      {/* 08 — GUARANTEE BAND NAVY */}
      <section className="oferta-guarantee" aria-label={o.guarantee.main}>
        <div className="oferta-guarantee-inner">
          <div className="oferta-guarantee-row">
            <svg
              className="oferta-guarantee-shield"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <p className="oferta-guarantee-text">
              {o.guarantee.main}
              <span className="oferta-guarantee-sep">{o.guarantee.sep}</span>
            </p>
          </div>
          <p className="oferta-guarantee-fine">{o.guarantee.fineprint}</p>
        </div>
      </section>

      {/* 09 — FAQ */}
      <section className="oferta-faq" id="faq">
        <header className="oferta-faq-header">
          <p className="oferta-eyebrow">{o.faq.eyebrow}</p>
          <h2 className="oferta-h2">{o.faq.headline}</h2>
        </header>
        <div className="oferta-faq-list">
          {o.faq.items.map((f) => (
            <details key={f.question} className="oferta-faq-item">
              <summary className="oferta-faq-q">{f.question}</summary>
              <p className="oferta-faq-a">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 10 — FINAL CTA */}
      <section className="oferta-final">
        <h2 className="oferta-final-h">{o.finalCta.headline}</h2>
        <p className="oferta-final-sub">{o.finalCta.subheadline}</p>
        <a href="#pricing" className="oferta-final-cta">
          {o.finalCta.cta}
          <span aria-hidden="true">→</span>
        </a>
      </section>

      {/* 11 — STICKY MOBILE */}
      <OfertaStickyCta />
    </main>
  );
}
