"use client";

import { useState, useTransition } from "react";
import { useLang } from "@/components/LangProvider";

/**
 * Single-offer pricing block — one product, one price.
 *
 * The earlier 3-tier layout (digital / paperback / collector) was
 * removed: we only sell the €12 digital pack today. Showing imagined
 * future editions broke user trust ("don't offer what we're not
 * selling").
 *
 * The card now anchors the value (165 € itemised → 12 €) and is the
 * only checkout button on the page. Rendered twice in the landing:
 * once above the fold and once after the value-stack section.
 */
export function OfertaPricingCards({ id }: { id?: string } = {}) {
  const { lang, t } = useLang();
  const o = t.oferta.pricing;
  const offer = o.offer;

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const onClick = () => {
    setError(false);
    startTransition(async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang }),
        });
        if (res.status === 503) {
          setUnavailable(true);
          return;
        }
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = (await res.json()) as { url?: string };
        if (!data.url) {
          setError(true);
          return;
        }
        window.location.assign(data.url);
      } catch {
        setError(true);
      }
    });
  };

  return (
    <section className="oferta-pricing" id={id ?? "pricing"}>
      <header className="oferta-pricing-header">
        <p className="oferta-eyebrow">{o.eyebrow}</p>
        <h2 className="oferta-h2">{o.headline}</h2>
        <p>{o.subheadline}</p>
      </header>
      <div className="oferta-pricing-single">
        <article className="oferta-pcard oferta-pcard--solo">
          <span className="oferta-pcard-status oferta-pcard-status--live">
            {offer.statusLabel}
          </span>
          <h3 className="oferta-pcard-name">{offer.name}</h3>
          <p className="oferta-pcard-subtitle">{offer.subtitle}</p>
          <p className="oferta-pcard-anchor">{offer.priceAnchor}</p>
          <p className="oferta-pcard-price">
            {offer.priceAmount}
            <span className="oferta-pcard-price-currency">
              {offer.priceCurrency}
            </span>
          </p>
          <p className="oferta-pcard-price-caption">{offer.priceCaption}</p>
          <ul className="oferta-pcard-features">
            {offer.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button
            type="button"
            className="oferta-pcard-cta oferta-pcard-cta--primary"
            onClick={onClick}
            disabled={isPending || unavailable}
          >
            {unavailable
              ? "Próximamente"
              : isPending
                ? "Abriendo Stripe…"
                : offer.cta}
          </button>
          {error ? (
            <p className="oferta-pcard-cta-error" role="alert">
              Error al abrir el pago. Reintenta en un momento.
            </p>
          ) : null}
        </article>
      </div>
    </section>
  );
}
