"use client";

import { useLang } from "@/components/LangProvider";

export function ResenaHero({
  amazonUrl,
  teamEmail,
}: {
  amazonUrl: string;
  teamEmail: string;
}) {
  const { t } = useLang();
  const r = t.resena;

  const mailtoHref = `mailto:${teamEmail}?subject=${encodeURIComponent(
    r.emailSubject,
  )}&body=${encodeURIComponent(r.emailBody)}`;

  return (
    <main className="resena-page">
      <section className="resena-inner">
        <div className="resena-eyebrow">
          <span className="dot" />
          <span className="mono">{r.eyebrow}</span>
        </div>
        <h1 className="resena-h1">
          {r.h1Pre}
          <em>{r.h1Em}</em>
        </h1>
        <p className="resena-intro">{r.intro}</p>

        <ol className="resena-steps">
          <li>
            <span className="resena-step-num">1</span>
            <div className="resena-step-body">
              <strong>{r.steps[0].title}</strong>
              <p>{r.steps[0].body}</p>
              <a
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="resena-cta"
              >
                <span>{r.amazonCta}</span>
                <span className="arrow" />
              </a>
            </div>
          </li>
          <li>
            <span className="resena-step-num">2</span>
            <div className="resena-step-body">
              <strong>{r.steps[1].title}</strong>
              <p>{r.steps[1].body}</p>
            </div>
          </li>
          <li>
            <span className="resena-step-num">3</span>
            <div className="resena-step-body">
              <strong>{r.steps[2].title}</strong>
              <p>{r.steps[2].body}</p>
              <a href={mailtoHref} className="resena-cta">
                <span>{r.contactCta}</span>
                <span className="arrow" />
              </a>
            </div>
          </li>
        </ol>

        <section className="resena-recode">
          <span className="resena-recode-label mono">{r.recode.label}</span>
          <h2 className="resena-recode-title">
            {r.recode.titlePre}
            <em>{r.recode.titleEm}</em>
          </h2>
          <p className="resena-recode-body">{r.recode.body}</p>
          <ol className="resena-recode-modules">
            {r.recode.modules.map((m, i) => (
              <li key={m.title}>
                <span className="resena-recode-num mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="resena-recode-module-body">
                  <strong>{m.title}</strong>
                  <p>{m.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <p className="resena-foot">{r.footNote}</p>
      </section>
    </main>
  );
}
