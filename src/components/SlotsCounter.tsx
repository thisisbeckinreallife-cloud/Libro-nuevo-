"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";

export type SlotsData = { claimed: number; total: number };

type Props = {
  initial: SlotsData;
  variant?: "light" | "dark";
  showSubcopy?: boolean;
};

export function SlotsCounter({ initial, variant = "light", showSubcopy = false }: Props) {
  const { t } = useLang();
  const [data, setData] = useState<SlotsData>(initial);
  const [fetchedAt, setFetchedAt] = useState<number>(Date.now());
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const fetchSlots = async () => {
      try {
        const res = await fetch("/api/slots", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as SlotsData;
        if (!cancelled) {
          setData({ claimed: json.claimed, total: json.total });
          setFetchedAt(Date.now());
        }
      } catch {
        // network failure is fine — keep showing last known value
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

    fetchSlots();
    schedule();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const exhausted = data.claimed >= data.total;
  const pct = Math.min(100, Math.round((data.claimed / data.total) * 100));
  const secs = Math.max(0, Math.floor((now - fetchedAt) / 1000));
  const updated =
    secs < 5
      ? t.slots.updatedJustNow
      : t.slots.updatedSecondsAgo.replace("{s}", String(secs));

  return (
    <div className={`slots-counter slots-counter--${variant}`} aria-live="polite">
      <div className="slots-counter-row">
        <span className="slots-counter-num">
          {exhausted ? (
            <span className="slots-counter-exhausted">{t.slots.exhaustedLabel}</span>
          ) : (
            <>
              <strong>{data.claimed}</strong>
              <span className="slots-counter-sep"> {t.slots.of} </span>
              <strong>{data.total}</strong>
              <span className="slots-counter-label"> · {t.slots.label}</span>
            </>
          )}
        </span>
        <span className="slots-counter-updated" aria-hidden="true">
          {updated}
        </span>
      </div>
      <div
        className="slots-counter-bar"
        role="progressbar"
        aria-label={t.slots.progressAria}
        aria-valuenow={data.claimed}
        aria-valuemin={0}
        aria-valuemax={data.total}
      >
        <div className="slots-counter-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      {showSubcopy ? <p className="slots-counter-subcopy">{t.slots.subcopy}</p> : null}
    </div>
  );
}
