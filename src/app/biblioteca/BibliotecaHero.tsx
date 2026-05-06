"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";

type Access =
  | {
      kind: "ready";
      accessToken: string;
      name: string | null;
      lang: string;
      ebookCount: number;
      audioCount: number;
    }
  | { kind: "refunded" }
  | { kind: "pending"; sessionId: string }
  | { kind: "invalid" };

export function BibliotecaHero({
  access,
  ebookAvailable,
  audioAvailable,
}: {
  access: Access;
  ebookAvailable: boolean;
  audioAvailable: boolean;
}) {
  const { t } = useLang();
  const b = t.biblioteca;

  // Polling for the "pending" state: the user just paid and we're
  // waiting for Stripe to deliver the webhook. Reload after 2s, max
  // 15 attempts (~30s). After that the static body explains how to
  // recover via the Stripe receipt email.
  const [retries, setRetries] = useState(0);
  useEffect(() => {
    if (access.kind !== "pending") return;
    if (retries >= 15) return;
    const t = setTimeout(() => {
      // Soft refresh — re-renders the server component with fresh data.
      window.location.reload();
    }, 2000);
    return () => clearTimeout(t);
  }, [access, retries]);
  useEffect(() => {
    if (access.kind === "pending") setRetries((n) => n + 1);
  }, [access.kind]);

  if (access.kind === "invalid") {
    return (
      <main className="biblioteca-shell">
        <section className="biblioteca-state">
          <h1 className="biblioteca-state-title">{b.notFoundTitle}</h1>
          <p className="biblioteca-state-body">{b.notFoundBody}</p>
        </section>
      </main>
    );
  }

  if (access.kind === "refunded") {
    return (
      <main className="biblioteca-shell">
        <section className="biblioteca-state">
          <h1 className="biblioteca-state-title">{b.refundedTitle}</h1>
          <p className="biblioteca-state-body">{b.refundedBody}</p>
        </section>
      </main>
    );
  }

  if (access.kind === "pending") {
    return (
      <main className="biblioteca-shell">
        <section className="biblioteca-state">
          <h1 className="biblioteca-state-title">{b.pendingTitle}</h1>
          <p className="biblioteca-state-body">{b.pendingBody}</p>
          <p className="biblioteca-state-hint">
            <span className="dot-pulse" /> {b.pendingHint}
          </p>
        </section>
      </main>
    );
  }

  // ready
  const welcome = access.name
    ? b.welcomeWithName.replace("{name}", access.name)
    : b.welcomeAnon;

  // Build the bookmark URL the buyer should save. Uses the
  // accessToken (not the session_id) because that one is permanent.
  const bookmarkUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/biblioteca?token=${encodeURIComponent(access.accessToken)}`
      : `/biblioteca?token=${encodeURIComponent(access.accessToken)}`;

  const audioHref = `/api/biblioteca/audio?token=${encodeURIComponent(access.accessToken)}`;
  const ebookHref = `/api/biblioteca/ebook?token=${encodeURIComponent(access.accessToken)}`;
  const workbookEnterHref = `/api/biblioteca/workbook-enter?token=${encodeURIComponent(access.accessToken)}`;

  return (
    <main className="biblioteca-shell">
      <header className="biblioteca-header">
        <p className="biblioteca-eyebrow">{b.eyebrow}</p>
        <h1 className="biblioteca-h1">
          {b.h1Pre}
          <em>{b.h1Em}</em>
        </h1>
        <p className="biblioteca-welcome">{welcome}</p>
        <p className="biblioteca-intro">{b.intro}</p>
      </header>

      <section className="biblioteca-products">
        {/* AUDIOBOOK */}
        <article className="biblioteca-card biblioteca-card--audio">
          <p className="biblioteca-card-label">{b.audio.label}</p>
          <h2 className="biblioteca-card-title">
            {b.audio.titlePre}
            <em>{b.audio.titleEm}</em>
          </h2>
          <p className="biblioteca-card-body">{b.audio.body}</p>
          <p className="biblioteca-card-meta">{b.audio.duration}</p>
          {audioAvailable ? (
            <a className="biblioteca-cta" href={audioHref}>
              <span>{b.audio.download}</span>
              <span className="arrow">↓</span>
            </a>
          ) : (
            <span className="biblioteca-cta is-disabled" aria-disabled="true">
              <span>{b.ebook.pending}</span>
            </span>
          )}
          <p className="biblioteca-card-foot">
            {access.audioCount > 0
              ? `${access.audioCount} / 5`
              : "0 / 5"}
          </p>
        </article>

        {/* EBOOK */}
        <article
          className={`biblioteca-card biblioteca-card--ebook ${ebookAvailable ? "" : "is-pending"}`}
        >
          <p className="biblioteca-card-label">{b.ebook.label}</p>
          <h2 className="biblioteca-card-title">
            {b.ebook.titlePre}
            <em>{b.ebook.titleEm}</em>
          </h2>
          <p className="biblioteca-card-body">
            {ebookAvailable ? b.ebook.body : b.ebook.pendingDetail}
          </p>
          {ebookAvailable ? (
            <a className="biblioteca-cta" href={ebookHref}>
              <span>{b.ebook.download}</span>
              <span className="arrow">↓</span>
            </a>
          ) : (
            <span className="biblioteca-cta is-disabled" aria-disabled="true">
              <span>{b.ebook.pending}</span>
            </span>
          )}
          {ebookAvailable ? (
            <p className="biblioteca-card-foot">
              {access.ebookCount > 0
                ? `${access.ebookCount} / 5`
                : "0 / 5"}
            </p>
          ) : null}
        </article>
      </section>

      {/* Workbook bridge — included with the purchase. The endpoint
          validates the access token, ensures a User row exists for the
          buyer's email, issues the workbook session cookie, and 302s
          to /workbook. So a single click moves the buyer from "I have
          downloads" to "I'm inside the four exercises". */}
      <section className="biblioteca-workbook">
        <span className="biblioteca-workbook-badge">{b.workbook.eyebrow}</span>
        <h2 className="biblioteca-workbook-title">{b.workbook.h}</h2>
        <p className="biblioteca-workbook-body">{b.workbook.body}</p>
        <ul className="biblioteca-workbook-tiles">
          {b.workbook.items.map((label, i) => (
            <li key={label} className="biblioteca-workbook-tile">
              <span className="biblioteca-workbook-tile-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <a className="biblioteca-workbook-cta" href={workbookEnterHref}>
          <span>{b.workbook.cta}</span>
          <span className="arrow">→</span>
        </a>
      </section>

      <section className="biblioteca-bookmark">
        <p className="biblioteca-bookmark-label">{b.bookmark}</p>
        <code className="biblioteca-bookmark-url">{bookmarkUrl}</code>
      </section>

      <footer className="biblioteca-foot">
        <p>{b.footNote}</p>
      </footer>
    </main>
  );
}
