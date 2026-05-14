"use client";

import { useState, useTransition } from "react";
import { useLang } from "@/components/LangProvider";
import type { OfertaPricingTier } from "@/i18n/dictionaries";
import { OfertaWaitlistModal } from "./OfertaWaitlistModal";

/**
 * 3-tier pricing block — Hormozi shop.acquisition.com layout adapted
 * for a single product.
 *
 *  - Tier "digital" (€12)        → live, fires Stripe Checkout
 *  - Tier "paperback" (€29)      → waitlist (email capture)
 *  - Tier "collector" (€120)     → waitlist (email capture)
 *
 * The Stripe call mirrors `OfertaCta`. We keep it inline here so each
 * card owns its own pending / error state without prop drilling.
 */
export function OfertaPricingCards() {
  const { lang, t } = useLang();
  const o = t.oferta.pricing;

  const [openTier, setOpenTier] = useState<"paperback" | "collector" | null>(
    null,
  );

  return (
    <>
      <section className="oferta-pricing" id="pricing">
        <header className="oferta-pricing-header">
          <p className="oferta-eyebrow">{o.eyebrow}</p>
          <h2 className="oferta-h2">{o.headline}</h2>
          <p>{o.subheadline}</p>
        </header>
        <div className="oferta-pricing-grid">
          {o.tiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              lang={lang}
              onWaitlist={(id) => setOpenTier(id)}
            />
          ))}
        </div>
      </section>

      {openTier ? (
        <OfertaWaitlistModal
          tier={openTier}
          onClose={() => setOpenTier(null)}
        />
      ) : null}
    </>
  );
}

function PricingCard({
  tier,
  lang,
  onWaitlist,
}: {
  tier: OfertaPricingTier;
  lang: string;
  onWaitlist: (id: "paperback" | "collector") => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const isLive = tier.status === "live";

  const onClick = () => {
    if (!isLive) {
      if (tier.id === "paperback" || tier.id === "collector") {
        onWaitlist(tier.id);
      }
      return;
    }
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
    <article
      className={`oferta-pcard ${tier.featured ? "oferta-pcard--featured" : ""}`}
    >
      {tier.featured ? (
        <span className="oferta-pcard-ribbon">Más elegido</span>
      ) : null}
      <span
        className={`oferta-pcard-status oferta-pcard-status--${tier.status}`}
      >
        {tier.statusLabel}
      </span>
      <h3 className="oferta-pcard-name">{tier.name}</h3>
      <p className="oferta-pcard-subtitle">{tier.subtitle}</p>
      <p className="oferta-pcard-price">
        {tier.priceAmount}
        <span className="oferta-pcard-price-currency">
          {tier.priceCurrency}
        </span>
      </p>
      <p className="oferta-pcard-price-caption">{tier.priceCaption}</p>
      <ul className="oferta-pcard-features">
        {tier.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <button
        type="button"
        className={`oferta-pcard-cta ${
          isLive ? "oferta-pcard-cta--primary" : "oferta-pcard-cta--outline"
        }`}
        onClick={onClick}
        disabled={isPending || unavailable}
      >
        {unavailable
          ? "Próximamente"
          : isPending
            ? "Abriendo Stripe…"
            : tier.cta}
      </button>
      {error ? (
        <p className="oferta-pcard-cta-error" role="alert">
          Error al abrir el pago. Reintenta en un momento.
        </p>
      ) : null}
    </article>
  );
}
