"use client";

import Image from "next/image";
import { Book3D } from "@/components/Book3D";
import { useLang } from "@/components/LangProvider";
import { OfertaCta } from "./OfertaCta";
import { OfertaStickyCta } from "./OfertaStickyCta";

/**
 * Landing /oferta — diseñada para máxima conversión.
 *
 * Estructura siguiendo Hormozi (Value Equation, Grand Slam Offer, MAGIC)
 * y Suby (Godfather Offer, Halo Strategy):
 *   01. Hero magnético
 *   02. Problema (PAS)
 *   03. Solución (PAS)
 *   04. Stack de valor (Godfather paso 2: Build Value)
 *   05. Rationale (Godfather paso 1: por qué a este precio)
 *   06. Garantía (Godfather paso 6: Power Guarantee)
 *   07. Autoridad
 *   08. Social proof
 *   09. FAQ
 *   10. CTA final + sticky mobile
 *
 * Todos los CTAs disparan el mismo POST /api/checkout (Stripe live).
 * Solo 1 click → Stripe → /biblioteca tras pagar.
 */
export function OfertaLanding() {
  const { t } = useLang();
  const o = t.oferta;

  return (
    <main className="oferta-shell">
      {/* 01 — HERO */}
      <section className="oferta-hero">
        <div className="oferta-hero-grid">
          <div className="oferta-hero-text">
            <p className="oferta-eyebrow">{o.hero.eyebrow}</p>
            <h1 className="oferta-hero-h1">{o.hero.headline}</h1>
            <p className="oferta-hero-sub">{o.hero.subheadline}</p>
            <OfertaCta label={o.hero.ctaPrimary} variant="primary-large" />
            <p className="oferta-hero-trust">{o.hero.trustMicrocopy}</p>
          </div>
          <div className="oferta-hero-visual">
            <div className="book-hero">
              <Book3D />
            </div>
          </div>
        </div>
      </section>

      {/* 02 — PROBLEMA (PAS) */}
      <section className="oferta-block oferta-problem">
        <p className="oferta-eyebrow">{o.problem.eyebrow}</p>
        <h2 className="oferta-h2">{o.problem.headline}</h2>
        <p className="oferta-intro">{o.problem.intro}</p>
        <ul className="oferta-pains">
          {o.problem.pains.map((p) => (
            <li key={p} className="oferta-pain">
              <span className="oferta-pain-mark" aria-hidden="true">
                ✕
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 03 — SOLUCIÓN */}
      <section className="oferta-block oferta-solution">
        <p className="oferta-eyebrow">{o.solution.eyebrow}</p>
        <h2 className="oferta-h2">{o.solution.headline}</h2>
        <p className="oferta-intro">{o.solution.intro}</p>
        <ul className="oferta-pillars">
          {o.solution.pillars.map((pl) => (
            <li key={pl.title} className="oferta-pillar">
              <h3 className="oferta-pillar-title">{pl.title}</h3>
              <p className="oferta-pillar-body">{pl.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 04 — STACK DE VALOR */}
      <section className="oferta-block oferta-stack">
        <p className="oferta-eyebrow">{o.stack.eyebrow}</p>
        <h2 className="oferta-h2">{o.stack.headline}</h2>
        <ul className="oferta-stack-list">
          {o.stack.items.map((it) => (
            <li key={it.title} className="oferta-stack-item">
              <div className="oferta-stack-item-main">
                <span className="oferta-stack-check" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <h3 className="oferta-stack-item-title">{it.title}</h3>
                  <p className="oferta-stack-item-detail">{it.detail}</p>
                </div>
              </div>
              <span className="oferta-stack-item-valor">{it.valor}</span>
            </li>
          ))}
        </ul>
        <div className="oferta-stack-totals">
          <p className="oferta-stack-total-anclado">{o.stack.totalAnclado}</p>
          <p className="oferta-stack-precio">{o.stack.precioFinal}</p>
        </div>
        <OfertaCta label={o.stack.cta} variant="primary-large" />
      </section>

      {/* 05 — RATIONALE */}
      <section className="oferta-block oferta-rationale">
        <p className="oferta-eyebrow">{o.rationale.eyebrow}</p>
        <h2 className="oferta-h2">{o.rationale.headline}</h2>
        <div className="oferta-rationale-body">
          {o.rationale.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* 06 — GARANTÍA */}
      <section className="oferta-block oferta-guarantee">
        <p className="oferta-eyebrow">{o.guarantee.eyebrow}</p>
        <h2 className="oferta-h2">{o.guarantee.headline}</h2>
        <p className="oferta-guarantee-body">{o.guarantee.body}</p>
        <p className="oferta-guarantee-micro">{o.guarantee.microcopy}</p>
      </section>

      {/* 07 — AUTORIDAD */}
      <section className="oferta-block oferta-authority">
        <p className="oferta-eyebrow">{o.authority.eyebrow}</p>
        <h2 className="oferta-h2">{o.authority.headline}</h2>
        <div className="oferta-authority-grid">
          <div className="oferta-authority-portrait">
            <Image
              src="/lara-portrait.png"
              alt="Lara Lawn"
              width={420}
              height={520}
              sizes="(max-width: 900px) 60vw, 320px"
            />
          </div>
          <div className="oferta-authority-text">
            <p className="oferta-authority-bio">{o.authority.bio}</p>
            <blockquote className="oferta-authority-quote">
              {o.authority.quote}
            </blockquote>
          </div>
        </div>
      </section>

      {/* 08 — SOCIAL PROOF */}
      <section className="oferta-block oferta-testimonials">
        <p className="oferta-eyebrow">{o.testimonials.eyebrow}</p>
        <h2 className="oferta-h2">{o.testimonials.headline}</h2>
        <ul className="oferta-testimonials-list">
          {o.testimonials.items.map((it) => (
            <li key={it.name} className="oferta-testimonial">
              <p className="oferta-testimonial-text">“{it.text}”</p>
              <p className="oferta-testimonial-meta">
                <strong>{it.name}</strong> · {it.role}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 09 — FAQ */}
      <section className="oferta-block oferta-faq">
        <p className="oferta-eyebrow">{o.faq.eyebrow}</p>
        <h2 className="oferta-h2">{o.faq.headline}</h2>
        <div className="oferta-faq-list">
          {o.faq.items.map((f) => (
            <details key={f.question} className="oferta-faq-item">
              <summary className="oferta-faq-q">{f.question}</summary>
              <p className="oferta-faq-a">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 10 — CTA FINAL */}
      <section className="oferta-block oferta-final">
        <h2 className="oferta-final-h">{o.finalCta.headline}</h2>
        <p className="oferta-final-sub">{o.finalCta.subheadline}</p>
        <OfertaCta label={o.finalCta.cta} variant="primary-large" />
      </section>

      {/* Sticky bottom CTA — mobile only */}
      <OfertaStickyCta />
    </main>
  );
}
