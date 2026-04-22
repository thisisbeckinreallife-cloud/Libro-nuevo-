"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { removeEntry, saveEntry } from "../actions";
import type { Milestone } from "./page";

type DragState = { fieldId: string; pointerId: number } | null;

export function ProximaVidaClient({ initial }: { initial: Milestone[] }) {
  const { t } = useLang();
  const pv = t.workbook.proximaVida;
  const [milestones, setMilestones] = useState<Milestone[]>(initial);
  const [selected, setSelected] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<DragState>(null);

  const persist = useCallback(async (m: Milestone) => {
    await saveEntry("proxima-vida", m.fieldId, {
      kind: "milestone",
      label: m.label,
      month: m.month,
      done: m.done,
    });
  }, []);

  const updateLocal = (fieldId: string, patch: Partial<Milestone>) => {
    setMilestones((list) =>
      list.map((m) => (m.fieldId === fieldId ? { ...m, ...patch } : m)),
    );
  };

  const addMilestone = async () => {
    const fieldId = `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const m: Milestone = { fieldId, label: "", month: 5, done: false };
    setMilestones((list) => [...list, m]);
    setSelected(fieldId);
    await persist(m);
  };

  const deleteMilestone = async (fieldId: string) => {
    setMilestones((list) => list.filter((m) => m.fieldId !== fieldId));
    if (selected === fieldId) setSelected(null);
    await removeEntry("proxima-vida", fieldId);
  };

  const monthFromEvent = (e: { clientX: number }): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    return Math.round((x / rect.width) * 11);
  };

  const onPillPointerDown = (fieldId: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    dragging.current = { fieldId, pointerId: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setSelected(fieldId);
  };

  const onPillPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const month = monthFromEvent(e);
    updateLocal(dragging.current.fieldId, { month });
  };

  const onPillPointerUp = async (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const { fieldId } = dragging.current;
    dragging.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    const m = milestones.find((x) => x.fieldId === fieldId);
    if (m) await persist(m);
  };

  const selectedMilestone = milestones.find((m) => m.fieldId === selected) ?? null;

  return (
    <main className="registration-page proxima-page">
      <section className="proxima-inner">
        <header className="diagnostico-header">
          <Link href="/workbook" className="diagnostico-back mono">
            ← {t.workbook.common.back}
          </Link>
          <button
            type="button"
            className="btn-primary proxima-add"
            onClick={addMilestone}
          >
            <span>{pv.addMilestone}</span>
            <span className="arrow" />
          </button>
        </header>

        <h1 className="registration-h1 diagnostico-h1">{pv.h1}</h1>
        <p className="registration-intro">{pv.intro}</p>

        <div className="proxima-timeline" aria-label={pv.h1}>
          <div className="proxima-track-wrap">
            <div className="proxima-months" aria-hidden="true">
              {pv.monthLabels.map((m) => (
                <span key={m} className="proxima-month mono">
                  {m}
                </span>
              ))}
            </div>
            <div className="proxima-track" ref={trackRef}>
              <div className="proxima-track-line" />
              {pv.monthLabels.map((_, i) => (
                <span
                  key={i}
                  className="proxima-tick"
                  style={{ left: `${(i / 11) * 100}%` }}
                  aria-hidden="true"
                />
              ))}
              {milestones.map((m) => (
                <button
                  key={m.fieldId}
                  type="button"
                  className={`proxima-pill${m.done ? " is-done" : ""}${
                    selected === m.fieldId ? " is-selected" : ""
                  }`}
                  style={{ left: `${(m.month / 11) * 100}%` }}
                  onPointerDown={onPillPointerDown(m.fieldId)}
                  onPointerMove={onPillPointerMove}
                  onPointerUp={onPillPointerUp}
                  onPointerCancel={onPillPointerUp}
                  aria-label={`${m.label || pv.labelPlaceholder} · ${pv.monthLabels[m.month]}`}
                >
                  <span className="proxima-pill-dot" />
                  <span className="proxima-pill-label">
                    {m.label || pv.labelPlaceholder}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {milestones.length === 0 ? (
          <p className="funeral-empty proxima-empty">{pv.empty}</p>
        ) : null}

        {selectedMilestone ? (
          <div className="proxima-editor">
            <input
              className="proxima-label-input"
              type="text"
              value={selectedMilestone.label}
              placeholder={pv.labelPlaceholder}
              onChange={(e) =>
                updateLocal(selectedMilestone.fieldId, { label: e.target.value })
              }
              onBlur={() => persist(selectedMilestone)}
            />
            <div className="proxima-editor-row">
              <div className="proxima-month-picker mono">
                <span>{pv.monthLabels[selectedMilestone.month]}</span>
              </div>
              <label className="proxima-done-toggle">
                <input
                  type="checkbox"
                  checked={selectedMilestone.done}
                  onChange={async (e) => {
                    const done = e.target.checked;
                    updateLocal(selectedMilestone.fieldId, { done });
                    await persist({ ...selectedMilestone, done });
                  }}
                />
                <span>{selectedMilestone.done ? pv.done : pv.pending}</span>
              </label>
              <button
                type="button"
                className="btn-ghost proxima-delete"
                onClick={() => deleteMilestone(selectedMilestone.fieldId)}
              >
                {pv.delete}
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
