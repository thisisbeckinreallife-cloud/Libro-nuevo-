"use client";

import { useLang } from "@/components/LangProvider";
import type { WorkbookItem } from "@/lib/workbook";

export function WorkbookIndex({ items }: { items: WorkbookItem[] }) {
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
          {items.map((item) => {
            const label = w.items[item.key];
            return (
              <li
                key={item.slug}
                className={`workbook-card${item.available ? "" : " workbook-card--soon"}`}
              >
                <div className="workbook-card-main">
                  <div className="workbook-card-title">{label.title}</div>
                  <div className="workbook-card-desc">{label.description}</div>
                </div>
                {item.available ? (
                  <a
                    className="workbook-card-action"
                    href={`/workbook/file/${item.slug}`}
                  >
                    {w.downloadLabel}
                    <span className="workbook-card-arrow" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="workbook-card-soon mono">{w.soonLabel}</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
