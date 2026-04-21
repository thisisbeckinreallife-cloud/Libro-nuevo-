"use client";

import { useLang } from "@/components/LangProvider";

export function AgotadoHero() {
  const { t } = useLang();
  const r = t.registration;
  return (
    <main className="registration-page">
      <section className="registration-inner registration-agotado">
        <div className="registration-eyebrow">
          <span className="dot" />
          <span className="mono">{r.eyebrow}</span>
        </div>
        <h1 className="registration-h1">{r.exhaustedH1}</h1>
        <p className="registration-intro">{r.exhaustedBody}</p>
        <a href="/login" className="btn-primary registration-submit">
          <span>{r.exhaustedCta}</span>
          <span className="arrow" />
        </a>
      </section>
    </main>
  );
}
