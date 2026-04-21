"use client";

import { useLang } from "@/components/LangProvider";

export function WorkbookPlaceholder() {
  const { t } = useLang();
  return (
    <main className="registration-page">
      <section className="registration-inner">
        <div className="registration-eyebrow">
          <span className="dot" />
          <span className="mono">{t.registration.eyebrow}</span>
        </div>
        <h1 className="registration-h1">Workbook Oficial</h1>
        <p className="registration-intro">
          El Workbook estará disponible en los próximos días. Te avisaremos por email.
        </p>
      </section>
    </main>
  );
}
