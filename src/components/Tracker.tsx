"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Internal conversion tracker — Plausible/GA replacement.
 *
 * Lives in the root layout. Wakes up once per session, reads consent
 * from `window.__cookieConsent.analytics` (set by `CookieBanner`),
 * and posts events to `/api/track`. Bails silently if the user
 * rejected analytics — no event ever leaves the browser in that case.
 *
 * Events captured:
 *   - `page_load`     on every client-side route change
 *   - `cta_click`     when an element with `data-track-cta="<label>"` is clicked
 *   - `checkout_start` when something with `data-track-cta="checkout"` is clicked
 *     (special-cased so we can split funnel: clicks vs actual checkout attempts)
 *
 * UTM parameters are sniffed once at first load and remembered for
 * the rest of the session, so a buyer who clicks the CTA 30 seconds
 * after landing is still attributed to the campaign that sent them.
 *
 * Session ID is random, sessionStorage-scoped, not personally
 * identifying. It exists so we can count unique sessions and stitch
 * page_load → cta_click → purchase_completed (the last one is
 * recorded server-side from the Stripe webhook).
 */

type Consent = {
  version: number;
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

const SESSION_KEY = "trkSid";
const UTM_KEY = "trkUtm";

type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  referrerHost?: string;
};

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  const c = (window as unknown as { __cookieConsent?: Consent }).__cookieConsent;
  return Boolean(c && c.analytics === true);
}

function getOrCreateSession(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const sid =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(SESSION_KEY, sid);
    return sid;
  } catch {
    return "no-storage";
  }
}

function loadUtm(): Utm {
  try {
    const raw = window.sessionStorage.getItem(UTM_KEY);
    if (raw) return JSON.parse(raw) as Utm;
  } catch {
    // ignore
  }
  // First touch — sniff URL.
  const params = new URLSearchParams(window.location.search);
  const utm: Utm = {};
  const s = params.get("utm_source");
  const m = params.get("utm_medium");
  const c = params.get("utm_campaign");
  if (s) utm.source = s;
  if (m) utm.medium = m;
  if (c) utm.campaign = c;
  try {
    const ref = document.referrer;
    if (ref) {
      const host = new URL(ref).host;
      // Ignore self-referrals — those clutter the dashboard.
      if (host && host !== window.location.host) utm.referrerHost = host;
    }
  } catch {
    // ignore
  }
  try {
    window.sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
  } catch {
    // ignore
  }
  return utm;
}

function post(payload: Record<string, unknown>): void {
  // Best-effort. We do NOT await — fire & forget keeps the UI snappy.
  try {
    const body = JSON.stringify(payload);
    if (typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {
        /* swallow */
      });
    }
  } catch {
    /* swallow */
  }
}

export function Tracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!hasConsent()) return;
    if (!pathname) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const sid = getOrCreateSession();
    const utm = loadUtm();
    post({
      kind: "page_load",
      path: pathname,
      sessionId: sid,
      ...(utm.source ? { utmSource: utm.source } : {}),
      ...(utm.medium ? { utmMedium: utm.medium } : {}),
      ...(utm.campaign ? { utmCampaign: utm.campaign } : {}),
      ...(utm.referrerHost ? { referrerHost: utm.referrerHost } : {}),
    });
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const onClick = (ev: MouseEvent) => {
      if (!hasConsent()) return;
      const target = ev.target;
      if (!(target instanceof Element)) return;
      const cta = target.closest<HTMLElement>("[data-track-cta]");
      if (!cta) return;
      const label = cta.getAttribute("data-track-cta") || "unknown";
      const sid = getOrCreateSession();
      const utm = loadUtm();
      const kind = label === "checkout" ? "checkout_start" : "cta_click";
      post({
        kind,
        path: window.location.pathname,
        sessionId: sid,
        ...(utm.source ? { utmSource: utm.source } : {}),
        ...(utm.medium ? { utmMedium: utm.medium } : {}),
        ...(utm.campaign ? { utmCampaign: utm.campaign } : {}),
        ...(utm.referrerHost ? { referrerHost: utm.referrerHost } : {}),
        meta: { label },
      });
    };

    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
