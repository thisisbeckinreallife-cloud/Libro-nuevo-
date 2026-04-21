"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LangProvider";

export function ConfirmadoHero() {
  const { t } = useLang();
  const r = t.registration;
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => router.push("/workbook"), 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="registration-page">
      <section className="registration-inner registration-confirmed">
        <div className="registration-eyebrow">
          <span className="dot" />
          <span className="mono">{t.registration.eyebrow}</span>
        </div>
        <h1 className="registration-h1">{r.confirmedH1}</h1>
        <p className="registration-intro">{r.confirmedBody}</p>
        <a href="/workbook" className="btn-primary registration-submit">
          <span>{r.confirmedCta}</span>
          <span className="arrow" />
        </a>
      </section>
    </main>
  );
}
