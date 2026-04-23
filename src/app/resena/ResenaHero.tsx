"use client";

import { useLang } from "@/components/LangProvider";
import { UploadForm } from "./UploadForm";

export function ResenaHero({
  amazonUrl,
  rewardsReady,
}: {
  amazonUrl: string | null;
  rewardsReady: boolean;
}) {
  const { t } = useLang();
  const r = t.resena;
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

        <UploadForm amazonUrl={amazonUrl} rewardsReady={rewardsReady} />

        <p className="resena-foot">{r.footNote}</p>
      </section>
    </main>
  );
}
