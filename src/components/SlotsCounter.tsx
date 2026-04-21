"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";
import { NEAR_EXHAUSTION_THRESHOLD, type SlotsPayload } from "@/lib/slots";

type Props = {
  initial: SlotsPayload;
  variant?: "light" | "dark";
  showSubcopy?: boolean;
};

export function SlotsCounter({ initial, variant = "light", showSubcopy = false }: Props) {
  const { t } = useLang();
  const [data, setData] = useState<SlotsPayload>(initial);
  const [fetchedAt, setFetchedAt] = useState<number>(Date.now());
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const fetchSlots = async () => {
      try {
        const res = await fetch("/api/slots", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as SlotsPayload;
        if (!cancelled) {
          setData(json);
          setFetchedAt(Date.now());
        }
      } catch {
        /* keep last known value */
      }
    };

    const schedule = () => {
      if (document.visibilityState !== "visible") return;
      timer = window.setTimeout(async () => {
        await fetchSlots();
        schedule();
      }, 60_000);
    };

    const onVis = () => {
      if (document.visibilityState === "visible") {
        fetchSlots();
        schedule();
      } else if (timer) {
        clearTimeout(timer);
      }
    };

    if (initial.mode !== "static") {
      fetchSlots();
      schedule();
      document.addEventListener("visibilitychange", onVis);
    }

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [initial.mode]);

  useEffect(() => {
    if (data.mode === "static") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [data.mode]);

  if (data.mode === "static") {
    return (
      <div className={`slots-counter slots-counter--${variant} slots-counter--static`}>
        <p className="slots-counter-static">{t.slots.staticLine}</p>
        {showSubcopy ? <p className="slots-counter-subcopy">{t.slots.subcopy}</p> : null}
      </div>
    );
  }

  const { claimed, total, remaining } = data;
  const pct = Math.min(100, Math.round((claimed / total) * 100));
  const secs = Math.max(0, Math.floor((now - fetchedAt) / 1000));
  const updated =
    secs < 5
      ? t.slots.updatedJustNow
      : t.slots.updatedSecondsAgo.replace("{s}", String(secs));
  const nearExhaustion = remaining <= NEAR_EXHAUSTION_THRESHOLD;

  return (
    <div className={`slots-counter slots-counter--${variant}`} aria-live="polite">
      <div className="slots-counter-row">
        <span className="slots-counter-num">
          <strong>{claimed}</strong>
          <span className="slots-counter-sep"> {t.slots.of} </span>
          <strong>{total}</strong>
          <span className="slots-counter-label"> · {t.slots.label}</span>
          {nearExhaustion ? (
            <span className="slots-counter-near">
              {" "}
              {t.slots.remainingSuffix.replace("{n}", String(remaining))}
            </span>
          ) : null}
        </span>
        <span className="slots-counter-updated" aria-hidden="true">
          {updated}
        </span>
      </div>
      <div
        className="slots-counter-bar"
        role="progressbar"
        aria-label={t.slots.progressAria}
        aria-valuenow={claimed}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div className="slots-counter-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      {showSubcopy ? <p className="slots-counter-subcopy">{t.slots.subcopy}</p> : null}
    </div>
  );
}
