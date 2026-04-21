"use client";

import { useLang } from "@/components/LangProvider";
import { RegistrationForm } from "./RegistrationForm";

export function RegistrationHero({ token }: { token: string }) {
  const { t } = useLang();
  const r = t.registration;
  return (
    <main className="registration-page">
      <section className="registration-inner">
        <div className="registration-eyebrow">
          <span className="dot" />
          <span className="mono">{r.eyebrow}</span>
        </div>
        <h1 className="registration-h1">
          {r.h1Pre}
          <em>{r.h1Em}</em>
        </h1>
        <p className="registration-intro">{r.intro}</p>
        <div className="registration-edition mono">{r.editionLine}</div>
        <RegistrationForm token={token} />
      </section>
    </main>
  );
}
