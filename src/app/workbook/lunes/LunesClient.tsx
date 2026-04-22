"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { saveEntry } from "../actions";
import type { LunesState } from "./page";

type TaskState = { done: boolean; note: string; doneAt: string | null };

const EMPTY: TaskState = { done: false, note: "", doneAt: null };

export function LunesClient({ initial }: { initial: LunesState }) {
  const { t } = useLang();
  const l = t.workbook.lunes;
  const [state, setState] = useState<LunesState>(initial);
  const noteTimers = useRef<Record<string, number>>({});

  const persist = useCallback(
    async (fieldId: string, next: TaskState) => {
      await saveEntry("lunes", fieldId, {
        kind: "task",
        done: next.done,
        note: next.note,
        doneAt: next.doneAt,
      });
    },
    [],
  );

  const toggle = async (fieldId: string) => {
    const prev = state[fieldId] ?? EMPTY;
    const next: TaskState = {
      ...prev,
      done: !prev.done,
      doneAt: !prev.done ? new Date().toISOString() : null,
    };
    setState((s) => ({ ...s, [fieldId]: next }));
    await persist(fieldId, next);
  };

  const setNote = (fieldId: string, note: string) => {
    const prev = state[fieldId] ?? EMPTY;
    const next: TaskState = { ...prev, note };
    setState((s) => ({ ...s, [fieldId]: next }));
    if (noteTimers.current[fieldId]) clearTimeout(noteTimers.current[fieldId]);
    noteTimers.current[fieldId] = window.setTimeout(() => {
      persist(fieldId, next);
    }, 900);
  };

  const pending = useMemo(
    () => l.items.filter((it) => !state[it.id]?.done),
    [l.items, state],
  );
  const done = useMemo(
    () => l.items.filter((it) => !!state[it.id]?.done),
    [l.items, state],
  );

  return (
    <main className="registration-page lunes-page">
      <section className="lunes-inner">
        <header className="diagnostico-header">
          <Link href="/workbook" className="diagnostico-back mono">
            ← {t.workbook.common.back}
          </Link>
        </header>

        <h1 className="registration-h1 diagnostico-h1">{l.h1}</h1>
        <p className="registration-intro">{l.intro}</p>

        <div className="lunes-grid">
          <div className="lunes-column">
            <div className="lunes-column-title mono">
              {l.columnPending}
              <span>{pending.length}</span>
            </div>
            <ul className="lunes-list">
              {pending.map((it) => (
                <LunesItem
                  key={it.id}
                  item={it}
                  state={state[it.id] ?? EMPTY}
                  onToggle={() => toggle(it.id)}
                  onNoteChange={(v) => setNote(it.id, v)}
                  t={l}
                />
              ))}
            </ul>
          </div>
          <div className="lunes-column lunes-column--done">
            <div className="lunes-column-title mono">
              {l.columnDone}
              <span>{done.length}</span>
            </div>
            {done.length === 0 ? (
              <p className="lunes-empty">—</p>
            ) : (
              <ul className="lunes-list">
                {done.map((it) => (
                  <LunesItem
                    key={it.id}
                    item={it}
                    state={state[it.id] ?? EMPTY}
                    onToggle={() => toggle(it.id)}
                    onNoteChange={(v) => setNote(it.id, v)}
                    t={l}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function LunesItem({
  item,
  state,
  onToggle,
  onNoteChange,
  t,
}: {
  item: { id: string; title: string; framing: string };
  state: TaskState;
  onToggle: () => void;
  onNoteChange: (v: string) => void;
  t: {
    noteLabel: string;
    notePlaceholder: string;
    markDone: string;
    markPending: string;
    doneAt: string;
  };
}) {
  return (
    <li className={`lunes-item${state.done ? " is-done" : ""}`}>
      <button
        type="button"
        className="lunes-check"
        onClick={onToggle}
        aria-label={state.done ? t.markPending : t.markDone}
        aria-pressed={state.done}
      >
        {state.done ? "✓" : ""}
      </button>
      <div className="lunes-body">
        <div className="lunes-title">{item.title}</div>
        <div className="lunes-framing">{item.framing}</div>
        {state.done && state.doneAt ? (
          <div className="lunes-donemeta mono">
            {t.doneAt} ·{" "}
            {new Date(state.doneAt).toLocaleDateString("es", {
              day: "numeric",
              month: "short",
            })}
          </div>
        ) : null}
        {state.done ? (
          <label className="lunes-note">
            <span className="lunes-note-label mono">{t.noteLabel}</span>
            <textarea
              className="lunes-note-textarea"
              placeholder={t.notePlaceholder}
              rows={2}
              value={state.note}
              onChange={(e) => onNoteChange(e.target.value)}
            />
          </label>
        ) : null}
      </div>
    </li>
  );
}
