"use client";

import Link from "next/link";
import { useLang } from "@/components/LangProvider";

const SLUGS = ["diagnostico", "funeral", "proxima-vida", "lunes"] as const;

export function WorkbookIndex() {
  const { t } = useLang();
  const w = t.workbook;
  return (
    <main className="registration-page">
      <section className="workbook-inner">
        <div className="registration-eyebrow">
          <span className="dot" />
          <span className="mono">{w.eyebrow}</span>
        </div>
        <h1 className="registration-h1">{w.h1}</h1>
        <p className="registration-intro">{w.intro}</p>

        <ul className="workbook-list">
          {SLUGS.map((slug, i) => {
            const section = w.sections[slug];
            return (
              <li key={slug} className="workbook-card">
                <div className="workbook-card-main">
                  <div className="workbook-card-num mono">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="workbook-card-title">{section.title}</div>
                    <div className="workbook-card-desc">{section.description}</div>
                  </div>
                </div>
                <Link className="workbook-card-action" href={`/workbook/${slug}`}>
                  {section.cta}
                  <span className="workbook-card-arrow" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
