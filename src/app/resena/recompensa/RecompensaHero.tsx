"use client";

import { useLang } from "@/components/LangProvider";

const MAX_DOWNLOADS = 2;

export function RecompensaHero({
  token,
  availability,
  ebookDownloads,
  audioDownloads,
}: {
  token: string;
  availability: { ebook: boolean; audio: boolean };
  ebookDownloads: number;
  audioDownloads: number;
}) {
  const { t } = useLang();
  const r = t.resena.reward;

  const q = encodeURIComponent(token);
  const ebookUrl = `/api/reward/ebook?t=${q}`;
  const audioUrl = `/api/reward/audio?t=${q}`;

  const ebookLeft = Math.max(0, MAX_DOWNLOADS - ebookDownloads);
  const audioLeft = Math.max(0, MAX_DOWNLOADS - audioDownloads);

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
          <article
            className={`recompensa-card ${
              availability.ebook ? "" : "is-pending"
            }`}
          >
            <div className="recompensa-card-label mono">{r.ebookLabel}</div>
            <h3 className="recompensa-card-title">
              {r.ebookTitlePre}
              <em>{r.ebookTitleEm}</em>
            </h3>
            <p className="recompensa-card-body">{r.ebookBody}</p>
            {availability.ebook ? (
              ebookLeft > 0 ? (
                <a
                  href={ebookUrl}
                  className="btn-primary recompensa-download"
                  download
                >
                  <span>{r.download}</span>
                  <span className="arrow" />
                </a>
              ) : (
                <span className="recompensa-exhausted">{r.exhausted}</span>
              )
            ) : (
              <span className="recompensa-pending mono">{r.soon}</span>
            )}
            {availability.ebook ? (
              <span className="recompensa-remaining mono">
                {r.remaining.replace("{n}", String(ebookLeft))}
              </span>
            ) : null}
          </article>

          <article
            className={`recompensa-card ${
              availability.audio ? "" : "is-pending"
            }`}
          >
            <div className="recompensa-card-label mono">{r.audioLabel}</div>
            <h3 className="recompensa-card-title">
              {r.audioTitlePre}
              <em>{r.audioTitleEm}</em>
            </h3>
            <p className="recompensa-card-body">{r.audioBody}</p>
            {availability.audio ? (
              audioLeft > 0 ? (
                <a
                  href={audioUrl}
                  className="btn-primary recompensa-download"
                  download
                >
                  <span>{r.download}</span>
                  <span className="arrow" />
                </a>
              ) : (
                <span className="recompensa-exhausted">{r.exhausted}</span>
              )
            ) : (
              <span className="recompensa-pending mono">{r.soon}</span>
            )}
            {availability.audio ? (
              <span className="recompensa-remaining mono">
                {r.remaining.replace("{n}", String(audioLeft))}
              </span>
            ) : null}
          </article>
        </div>

        <p className="recompensa-foot">{r.footNote}</p>
      </section>
    </main>
  );
}
