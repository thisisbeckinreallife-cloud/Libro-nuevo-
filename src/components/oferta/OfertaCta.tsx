"use client";

import { useState, useTransition } from "react";
import { useLang } from "@/components/LangProvider";

/**
 * Botón único que dispara Stripe Checkout. A diferencia de
 * `BuyDigitalCta` (que envuelve tag + headline + bullets + botón),
 * este componente es SOLO el botón — usado varias veces a lo largo
 * de /oferta donde el contexto lo aporta la sección que lo rodea.
 *
 * Si Stripe no está configurado, queda en modo "Próximamente"
 * silenciosamente. Si falla la red, muestra un texto mínimo de error
 * en `aria-live` y permite reintentar.
 */
type Variant = "primary" | "primary-large" | "ghost";

export function OfertaCta({
  label,
  variant = "primary",
  ariaLabel,
}: {
  label: string;
  variant?: Variant;
  ariaLabel?: string;
}) {
  const { lang, t } = useLang();
  const [isPending, startTransition] = useTransition();
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState(false);

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

  const shownLabel = unavailable
    ? t.buy.digital.ctaUnavailable
    : isPending
      ? t.buy.digital.ctaPending
      : label;

  return (
    <div className={`oferta-cta-wrap oferta-cta-wrap--${variant}`}>
      <button
        type="button"
        className={`oferta-cta oferta-cta--${variant} ${
          unavailable ? "is-disabled" : ""
        }`}
        onClick={onClick}
        disabled={isPending || unavailable}
        aria-label={ariaLabel ?? label}
      >
        <span>{shownLabel}</span>
        <span className="oferta-cta-arrow" aria-hidden="true">
          →
        </span>
      </button>
      {error ? (
        <p className="oferta-cta-error" role="alert" aria-live="polite">
          Error al abrir el pago. Reintenta en un momento.
        </p>
      ) : null}
    </div>
  );
}
