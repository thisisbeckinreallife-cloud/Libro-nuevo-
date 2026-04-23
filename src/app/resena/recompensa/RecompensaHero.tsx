"use client";

import { useState } from "react";
import { useLang } from "@/components/LangProvider";

const MAX_DOWNLOADS = 2;

type Kind = "ebook" | "audio";

export function RecompensaHero({
  token,
  ebookDownloads,
  audioDownloads,
}: {
  token: string;
  ebookDownloads: number;
  audioDownloads: number;
}) {
  const { t } = useLang();
  const r = t.resena.reward;

  const [ebookUsed, setEbookUsed] = useState(ebookDownloads);
  const [audioUsed, setAudioUsed] = useState(audioDownloads);
  const [status, setStatus] = useState<{
    kind: Kind;
    tone: "info" | "error";
    msg: string;
  } | null>(null);
  const [busy, setBusy] = useState<Kind | null>(null);

  const q = encodeURIComponent(token);

  const ebookLeft = Math.max(0, MAX_DOWNLOADS - ebookUsed);
  const audioLeft = Math.max(0, MAX_DOWNLOADS - audioUsed);

  async function triggerDownload(kind: Kind) {
    setStatus(null);
    setBusy(kind);
    try {
      const res = await fetch(`/api/reward/${kind}?t=${q}`, {
        cache: "no-store",
      });
      if (res.status === 503) {
        setStatus({ kind, tone: "info", msg: r.emailFallback });
        return;
      }
      if (res.status === 429) {
        setStatus({ kind, tone: "error", msg: r.exhausted });
        return;
      }
      if (!res.ok) {
        setStatus({ kind, tone: "error", msg: r.genericError });
        return;
      }

      const blob = await res.blob();
      const cd = res.headers.get("content-disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      const filename =
        match?.[1] ?? (kind === "ebook" ? "ebook" : "audio-rsb");

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      if (kind === "ebook") setEbookUsed((n) => n + 1);
      else setAudioUsed((n) => n + 1);
    } catch {
      setStatus({ kind, tone: "error", msg: r.genericError });
    } finally {
      setBusy(null);
    }
  }

  const renderCard = (opts: {
    kind: Kind;
    label: string;
    titlePre: string;
    titleEm: string;
    body: string;
    left: number;
  }) => {
    const { kind, label, titlePre, titleEm, body, left } = opts;
    const exhausted = left === 0;
    const pending = busy === kind;
    return (
      <article className="recompensa-card">
        <div className="recompensa-card-label mono">{label}</div>
        <h3 className="recompensa-card-title">
          {titlePre}
          <em>{titleEm}</em>
        </h3>
        <p className="recompensa-card-body">{body}</p>

        {exhausted ? (
          <span className="recompensa-exhausted">{r.exhausted}</span>
        ) : (
          <button
            type="button"
            className="btn-primary recompensa-download"
            onClick={() => triggerDownload(kind)}
            disabled={pending}
          >
            <span>{pending ? r.preparing : r.download}</span>
            <span className="arrow" />
          </button>
        )}

        <span className="recompensa-remaining mono">
          {r.remaining.replace("{n}", String(left))}
        </span>

        {status && status.kind === kind ? (
          <div
            className={`recompensa-status recompensa-status--${status.tone}`}
            role="status"
            aria-live="polite"
          >
            {status.msg}
          </div>
        ) : null}
      </article>
    );
  };

  return (
    <main className="recompensa-page">
      <section className="recompensa-inner">
        <div className="recompensa-eyebrow">
          <span className="dot" />
          <span className="mono">{r.eyebrow}</span>
        </div>
        <h1 className="recompensa-h1">
          {r.h1Pre}
          <em>{r.h1Em}</em>
        </h1>
        <p className="recompensa-intro">{r.intro}</p>

        <div className="recompensa-grid">
          {renderCard({
            kind: "ebook",
            label: r.ebookLabel,
            titlePre: r.ebookTitlePre,
            titleEm: r.ebookTitleEm,
            body: r.ebookBody,
            left: ebookLeft,
          })}
          {renderCard({
            kind: "audio",
            label: r.audioLabel,
            titlePre: r.audioTitlePre,
            titleEm: r.audioTitleEm,
            body: r.audioBody,
            left: audioLeft,
          })}
        </div>

        <p className="recompensa-foot">{r.footNote}</p>
      </section>
    </main>
  );
}
