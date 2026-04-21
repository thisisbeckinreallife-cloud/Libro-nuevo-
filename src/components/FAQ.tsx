"use client";

import { useId, useState } from "react";
import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";

export function FAQ() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <div className="faq-grid">
          <Reveal className="faq-head">
            <div
              className="mono label"
              style={{ color: "var(--accent)", marginBottom: 18 }}
            >
              {t.faq.label}
            </div>
            <h2>
              {t.faq.h2Pre}
              <em>{t.faq.h2Em}</em>
              {t.faq.h2Post}
            </h2>
            <p>{t.faq.blurb}</p>
          </Reveal>

          <Reveal className="faq-list">
            {t.faq.items.map((item, i) => {
              const isOpen = open === i;
              const panelId = `${baseId}-panel-${i}`;
              return (
                <div
                  className={`faq-item${isOpen ? " open" : ""}`}
                  key={item.q}
                >
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen((prev) => (prev === i ? null : i))}
                  >
                    <span>{item.q}</span>
                    <span className="plus" aria-hidden="true" />
                  </button>
                  <div className="faq-a" id={panelId} role="region">
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
