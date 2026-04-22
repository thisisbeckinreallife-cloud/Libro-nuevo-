"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { saveEntry } from "../actions";

type SliderAnswer = { kind: "slider"; value: number };
type YesNoAnswer = { kind: "yesno"; value: "yes" | "no" };
type Answer = SliderAnswer | YesNoAnswer;

const SWIPE_THRESHOLD = 90;

export function DiagnosticoClient({
  initial,
}: {
  initial: Record<string, unknown>;
}) {
  const { t } = useLang();
  const d = t.workbook.diagnostico;
  const questions = d.questions;
  const firstUnanswered = useMemo(() => {
    const i = questions.findIndex((q) => !(q.id in initial));
    return i === -1 ? questions.length : i;
  }, [questions, initial]);

  const [idx, setIdx] = useState(firstUnanswered);
  const [answers, setAnswers] = useState<Record<string, Answer>>(
    initial as Record<string, Answer>,
  );
  const [saving, setSaving] = useState(false);

  const commit = async (fieldId: string, answer: Answer) => {
    setAnswers((s) => ({ ...s, [fieldId]: answer }));
    setSaving(true);
    await saveEntry("diagnostico", fieldId, answer);
    setSaving(false);
    setIdx((i) => i + 1);
  };

  const restart = () => setIdx(0);

  const current = questions[idx];
  const done = idx >= questions.length;

  return (
    <main className="registration-page diagnostico-page">
      <section className="diagnostico-inner">
        <header className="diagnostico-header">
          <Link href="/workbook" className="diagnostico-back mono">
            ← {t.workbook.common.back}
          </Link>
          <div className="diagnostico-progress" aria-hidden="true">
            {questions.map((_, i) => (
              <span
                key={i}
                className={`diagnostico-dot${i < idx ? " is-done" : ""}${i === idx ? " is-active" : ""}`}
              />
            ))}
          </div>
        </header>

        {!done ? (
          <>
            <div className="diagnostico-lead">
              <h1 className="registration-h1 diagnostico-h1">{d.h1}</h1>
              <p className="registration-intro">{d.intro}</p>
            </div>
            <QuestionCard
              key={current.id}
              question={current}
              initial={answers[current.id]}
              onCommit={(ans) => commit(current.id, ans)}
              saving={saving}
            />
          </>
        ) : (
          <FinalCard
            answers={answers}
            onRestart={restart}
            t={{
              doneTitle: d.doneTitle,
              doneIntro: d.doneIntro,
              restart: d.restart,
              antCaption: d.antCaption,
              back: t.workbook.common.back,
            }}
          />
        )}
      </section>
    </main>
  );
}

function QuestionCard({
  question,
  initial,
  onCommit,
  saving,
}: {
  question: {
    id: string;
    kind: "slider" | "yesno";
    question: string;
    hint?: string;
    minLabel?: string;
    maxLabel?: string;
  };
  initial?: Answer;
  onCommit: (ans: Answer) => void;
  saving: boolean;
}) {
  if (question.kind === "slider") {
    const init = initial?.kind === "slider" ? initial.value : 5;
    return (
      <SliderCard
        question={question}
        initial={init}
        onCommit={onCommit}
        saving={saving}
      />
    );
  }
  return (
    <YesNoCard
      question={question}
      initial={initial?.kind === "yesno" ? initial.value : null}
      onCommit={onCommit}
      saving={saving}
    />
  );
}

function SliderCard({
  question,
  initial,
  onCommit,
  saving,
}: {
  question: { id: string; question: string; hint?: string; minLabel?: string; maxLabel?: string };
  initial: number;
  onCommit: (ans: Answer) => void;
  saving: boolean;
}) {
  const [value, setValue] = useState<number>(initial);
  return (
    <article className="diagnostico-card diagnostico-card--slider">
      <p className="diagnostico-question">{question.question}</p>
      <div className="diagnostico-slider-value" aria-live="polite">
        <span>{value}</span>
        <small>/ 10</small>
      </div>
      <input
        className="diagnostico-slider"
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label={question.question}
      />
      <div className="diagnostico-slider-labels">
        <span className="mono">{question.minLabel ?? "0"}</span>
        <span className="mono">{question.maxLabel ?? "10"}</span>
      </div>
      {question.hint ? (
        <p className="diagnostico-hint">{question.hint}</p>
      ) : null}
      <button
        type="button"
        className="btn-primary diagnostico-next"
        onClick={() => onCommit({ kind: "slider", value })}
        disabled={saving}
      >
        <span>Siguiente</span>
        <span className="arrow" />
      </button>
    </article>
  );
}

function YesNoCard({
  question,
  initial,
  onCommit,
  saving,
}: {
  question: { id: string; question: string; hint?: string };
  initial: "yes" | "no" | null;
  onCommit: (ans: Answer) => void;
  saving: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<number>(0);
  const dragging = useRef<{ startX: number; pointerId: number } | null>(null);
  const [flying, setFlying] = useState<"yes" | "no" | null>(null);

  const commit = (v: "yes" | "no") => {
    setFlying(v);
    setTimeout(() => onCommit({ kind: "yesno", value: v }), 280);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (flying) return;
    dragging.current = { startX: e.clientX, pointerId: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setDrag(e.clientX - dragging.current.startX);
  };
  const onPointerUp = () => {
    if (!dragging.current) return;
    if (drag > SWIPE_THRESHOLD) {
      commit("yes");
    } else if (drag < -SWIPE_THRESHOLD) {
      commit("no");
    } else {
      setDrag(0);
    }
    dragging.current = null;
  };

  const tilt = drag / 20;
  const style: React.CSSProperties = flying
    ? {
        transform: `translate(${flying === "yes" ? 640 : -640}px, -40px) rotate(${flying === "yes" ? 18 : -18}deg)`,
        opacity: 0,
        transition: "transform .28s ease-out, opacity .28s ease-out",
      }
    : {
        transform: `translate(${drag}px, 0) rotate(${tilt}deg)`,
        transition: dragging.current ? "none" : "transform .3s var(--ease)",
      };

  return (
    <>
      <div
        className={`diagnostico-card diagnostico-card--yesno${drag > 40 ? " is-yes-leaning" : ""}${drag < -40 ? " is-no-leaning" : ""}`}
        ref={cardRef}
        style={style}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="diagnostico-swipe-hint" aria-hidden="true">
          <span className="is-no">NO ←</span>
          <span className="is-yes">→ SÍ</span>
        </div>
        <p className="diagnostico-question">{question.question}</p>
        {initial !== null ? (
          <p className="diagnostico-prev mono">
            Tu última respuesta: {initial === "yes" ? "Sí" : "No"}
          </p>
        ) : null}
      </div>
      <div className="diagnostico-yesno-buttons">
        <button
          type="button"
          className="btn-ghost diagnostico-no"
          onClick={() => commit("no")}
          disabled={saving || !!flying}
        >
          No
        </button>
        <button
          type="button"
          className="btn-primary diagnostico-yes"
          onClick={() => commit("yes")}
          disabled={saving || !!flying}
        >
          <span>Sí</span>
          <span className="arrow" />
        </button>
      </div>
    </>
  );
}

function FinalCard({
  answers,
  onRestart,
  t,
}: {
  answers: Record<string, Answer>;
  onRestart: () => void;
  t: {
    doneTitle: string;
    doneIntro: string;
    restart: string;
    antCaption: string;
    back: string;
  };
}) {
  // Derive a tiny synthesis: how many "yes" answers, slider average
  const yn = Object.values(answers).filter((a) => a.kind === "yesno") as YesNoAnswer[];
  const sl = Object.values(answers).filter((a) => a.kind === "slider") as SliderAnswer[];
  const yesCount = yn.filter((a) => a.value === "yes").length;
  const avg = sl.length
    ? Math.round(sl.reduce((acc, a) => acc + a.value, 0) / sl.length)
    : 0;

  return (
    <article className="diagnostico-final">
      <div className="diagnostico-final-visual">
        <Image
          src="/workbook/hormiga.jpg"
          alt=""
          width={600}
          height={800}
          sizes="(max-width: 640px) 100vw, 420px"
          className="diagnostico-final-image"
          priority
        />
        <span className="diagnostico-final-caption mono">{t.antCaption}</span>
      </div>
      <div className="diagnostico-final-text">
        <h1 className="registration-h1 diagnostico-h1">{t.doneTitle}</h1>
        <p className="registration-intro">{t.doneIntro}</p>
        <ul className="diagnostico-synth">
          <li>
            <strong>{yesCount}</strong>
            <span>respuestas afirmativas de {yn.length}</span>
          </li>
          <li>
            <strong>{avg}</strong>
            <span>punto medio en los sliders</span>
          </li>
          <li>
            <em>guardado automáticamente en tu cuaderno</em>
          </li>
        </ul>
        <div className="diagnostico-final-actions">
          <button type="button" className="btn-ghost" onClick={onRestart}>
            {t.restart}
          </button>
          <Link href="/workbook" className="btn-primary diagnostico-continue">
            <span>{t.back}</span>
            <span className="arrow" />
          </Link>
        </div>
      </div>
    </article>
  );
}
