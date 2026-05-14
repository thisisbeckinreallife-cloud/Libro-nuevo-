"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";

/**
 * GDPR / LSSI-CE cookie banner.
 *
 * Self-contained — no third-party CMP. Persists choice in
 * `localStorage.cookieConsent` for 6 months. Re-appears if the consent
 * schema version changes.
 *
 * Today only "necessary" cookies are actually set (Stripe checkout,
 * workbook session, lang, consent itself). The "analytics" category
 * is a placeholder for when Sprint 3 turns on the internal `Event`
 * tracking — that code will read `window.__cookieConsent.analytics`
 * before recording anything.
 *
 * Hidden on /admin (no value showing the banner to the operator) and
 * on /legal/* pages (the banner would obscure the content the user is
 * trying to read).
 */

const STORAGE_KEY = "cookieConsent";
const CONSENT_VERSION = 1;
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

type Consent = {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (Date.now() - parsed.timestamp > SIX_MONTHS_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(c: Consent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    // Expose globally so analytics code can read it synchronously.
    (window as unknown as { __cookieConsent?: Consent }).__cookieConsent = c;
  } catch {
    // ignore (private mode)
  }
}

export function CookieBanner() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Skip on admin + legal routes — they have their own reason to be quiet.
    const path = window.location.pathname;
    if (path.startsWith("/admin")) return;
    if (path.startsWith("/legal")) return;

    const existing = readConsent();
    if (existing) {
      (window as unknown as { __cookieConsent?: Consent }).__cookieConsent = existing;
      return;
    }
    // Slight delay so it doesn't pop the same frame as the hero.
    const t = setTimeout(() => setVisible(true), 350);
    return () => clearTimeout(t);
  }, []);

  if (!mounted || !visible) return null;

  const accept = () => {
    writeConsent({
      version: CONSENT_VERSION,
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
    setVisible(false);
  };

  const rejectNonEssential = () => {
    writeConsent({
      version: CONSENT_VERSION,
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
    setVisible(false);
  };

  const copy = lang === "es" ? COPY_ES : COPY_EN;

  return (
    <div className="cookie-banner" role="dialog" aria-label={copy.aria}>
      <p className="cookie-banner-text">
        {copy.body}{" "}
        <a href="/legal/cookies">{copy.link}</a>.
      </p>
      <div className="cookie-banner-actions">
        <button
          type="button"
          className="cookie-btn cookie-btn--reject"
          onClick={rejectNonEssential}
        >
          {copy.reject}
        </button>
        <button
          type="button"
          className="cookie-btn cookie-btn--accept"
          onClick={accept}
        >
          {copy.accept}
        </button>
      </div>
    </div>
  );
}

const COPY_ES = {
  aria: "Aviso de cookies",
  body: "Usamos cookies necesarias para que el pago y el workbook funcionen. Las analíticas/marketing solo se activan si las aceptas. Más info en la",
  link: "política de cookies",
  reject: "Solo necesarias",
  accept: "Aceptar todo",
} as const;

const COPY_EN = {
  aria: "Cookie notice",
  body: "We use necessary cookies to make checkout and the workbook work. Analytics/marketing only run if you accept them. More info in our",
  link: "cookie policy",
  reject: "Only necessary",
  accept: "Accept all",
} as const;
