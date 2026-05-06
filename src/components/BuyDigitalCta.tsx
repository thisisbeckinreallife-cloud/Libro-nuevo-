"use client";

import { useState, useTransition } from "react";
import { useLang } from "./LangProvider";

/**
 * Digital offer (12€) CTA — Stripe Checkout starter.
 *
 * Posts to `/api/checkout`, then redirects to the Session URL Stripe
 * returns. If the API is not yet configured (env vars unset), the
 * endpoint returns 503 and the button locks into a "Próximamente
 * disponible" state. No code changes needed once Stripe is wired —
 * the next click just succeeds.
 */
export function BuyDigitalCta() {
  const { t, lang } = useLang();
  const d = t.buy.digital;
  const [isPending, startTransition] = useTransition();
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang }),
        });
        if (res.status === 503) {
          // Stripe not configured yet — lock the button into the
          // "coming soon" state for the rest of the session.
          setUnavailable(true);
          return;
        }
        if (!res.ok) {
          setError("checkout_failed");
          return;
        }
        const data = (await res.json()) as { url?: string };
        if (!data.url) {
          setError("checkout_failed");
          return;
        }
        window.location.assign(data.url);
      } catch {
        setError("checkout_failed");
      }
    });
  };

  const label = unavailable
    ? d.ctaUnavailable
    : isPending
      ? d.ctaPending
      : d.cta;

  return (
    <div className="buy-digital">
      <div className="buy-digital-head">
        <span className="mono label">{d.tag}</span>
        <h3 className="buy-digital-h">{d.h}</h3>
        <p className="buy-digital-detail">{d.detail}</p>
      </div>
      <ul className="buy-digital-bullets">
        {d.bullets.map((b, i) => (
          <li key={i}>
            <span className="buy-digital-mark" aria-hidden="true">·</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`btn-primary buy-digital-cta ${unavailable ? "is-disabled" : ""}`}
        onClick={onClick}
        disabled={isPending || unavailable}
      >
        <span>{label}</span>
        <span className="arrow" />
      </button>
      {error ? (
        <p className="buy-digital-error" role="alert">
          {/* Generic — we don't surface stripe internals. The user can retry. */}
          {/* No i18n key here on purpose: it's a one-off, not part of the offer surface. */}
          Error al abrir el pago. Reintenta en un momento.
        </p>
      ) : null}
    </div>
  );
}
