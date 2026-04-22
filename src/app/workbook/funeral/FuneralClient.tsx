"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/components/LangProvider";
import { saveEntry } from "../actions";
import type { BurialRecord } from "./page";

export function FuneralClient({ initial }: { initial: BurialRecord[] }) {
  const { t } = useLang();
  const f = t.workbook.funeral;
  const [burials, setBurials] = useState<BurialRecord[]>(initial);
  const [text, setText] = useState<string>("");
  const [burning, setBurning] = useState<boolean>(false);

  const bury = async () => {
    const trimmed = text.trim();
    if (!trimmed || burning) return;
    setBurning(true);
    // Wait for dissolve animation to play before committing state
    await new Promise((r) => setTimeout(r, 1200));
    const fieldId = `b-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const buriedAt = new Date().toISOString();
    await saveEntry("funeral", fieldId, {
      kind: "funeral",
      value: trimmed,
      buriedAt,
    });
    setBurials((list) => [{ fieldId, text: trimmed, buriedAt }, ...list]);
    setText("");
    setBurning(false);
  };

  return (
    <main className="registration-page funeral-page">
      <section className="funeral-inner">
        <header className="diagnostico-header">
          <Link href="/workbook" className="diagnostico-back mono">
            ← {t.workbook.common.back}
          </Link>
        </header>

        <h1 className="registration-h1 diagnostico-h1">{f.h1}</h1>
        <p className="registration-intro">{f.intro}</p>

        <div className={`funeral-card${burning ? " is-burning" : ""}`}>
          <textarea
            className="funeral-textarea"
            placeholder={f.placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            disabled={burning}
          />
          <div className="funeral-ashes" aria-hidden="true" />
          <button
            type="button"
            className="btn-primary funeral-bury"
            onClick={bury}
            disabled={burning || !text.trim()}
          >
            <span>{burning ? f.burying : f.bury}</span>
            <span className="arrow" />
          </button>
        </div>

        <section className="funeral-cemetery">
          <div className="funeral-cemetery-title mono">{f.cemeteryTitle}</div>
          {burials.length === 0 ? (
            <p className="funeral-empty">{f.empty}</p>
          ) : (
            <ul className="funeral-list">
              {burials.map((b) => (
                <li key={b.fieldId} className="funeral-entry">
                  <span className="funeral-entry-dagger" aria-hidden="true">
                    †
                  </span>
                  <span className="funeral-entry-text">{b.text}</span>
                  <time
                    className="funeral-entry-date mono"
                    dateTime={b.buriedAt}
                  >
                    {new Date(b.buriedAt).toLocaleDateString("es", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
