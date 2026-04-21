"use client";

import { useEffect, useRef } from "react";
import { useLang } from "./LangProvider";

export function Insight() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="insight" ref={sectionRef}>
      <div className="insight-inner">
        <div className="insight-label">
          <span className="dot" />
          <span className="mono">{t.insight.label}</span>
        </div>
        <h2>
          {t.insight.h2[0]}
          <span className="strike">{t.insight.h2[1]}</span>
          {t.insight.h2[2]}
          <em>{t.insight.h2[3]}</em>
          {t.insight.h2[4]}
        </h2>
        <div className="insight-body">
          {t.insight.body.map((p, i) => (
            <p key={i}>
              {p.pre}
              <strong>{p.strong}</strong>
              {p.post}
              {p.em ? <em>{p.em}</em> : null}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
