"use client";

import { useEffect, useState, useTransition } from "react";
import { useLang } from "@/components/LangProvider";

/**
 * Email-capture modal for the tiers that aren't shipping yet (paperback
 * and collector). POSTs to /api/waitlist, which records the (email, tier)
 * pair and upserts the marketing Contacts table. No payment.
 */
export function OfertaWaitlistModal({
  tier,
  onClose,
}: {
  tier: "paperback" | "collector";
  onClose: () => void;
}) {
  const { lang, t } = useLang();
  const w = t.oferta.waitlist;

  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending || done) return;
    setError(null);
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(w.error);
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmed, tier, lang }),
        });
        if (!res.ok) {
          setError(w.error);
          return;
        }
        setDone(true);
      } catch {
        setError(w.error);
      }
    });
  };

  return (
    <div
      className="waitlist-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={w.title}
    >
      <div className="waitlist-modal">
        <button
          type="button"
          className="waitlist-modal-close"
          onClick={onClose}
          aria-label={w.close}
        >
          ×
        </button>

        {done ? (
          <div className="waitlist-modal-success">
            <p className="waitlist-modal-eyebrow">{w.title}</p>
            <h3 className="waitlist-modal-success-title">{w.success}</h3>
            <p className="waitlist-modal-success-body">{w.successDetail}</p>
          </div>
        ) : (
          <>
            <p className="waitlist-modal-eyebrow">
              {tier === "paperback"
                ? lang === "es"
                  ? "Tapa blanda firmada"
                  : "Signed paperback"
                : lang === "es"
                  ? "Edición coleccionista"
                  : "Collector's edition"}
            </p>
            <h3 className="waitlist-modal-h">{w.title}</h3>
            <p className="waitlist-modal-body">{w.subtitle}</p>
            <form className="waitlist-modal-form" onSubmit={submit}>
              <label className="sr-only" htmlFor="waitlist-email">
                {w.emailLabel}
              </label>
              <input
                id="waitlist-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                className="waitlist-modal-input"
                placeholder={w.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
              />
              <button
                type="submit"
                className="waitlist-modal-submit"
                disabled={isPending}
              >
                {isPending ? w.submitting : w.submit}
              </button>
              {error ? (
                <p className="waitlist-modal-error" role="alert">
                  {error}
                </p>
              ) : null}
              <p className="oferta-final-sub" style={{ margin: "8px 0 0" }}>
                {w.privacy}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
