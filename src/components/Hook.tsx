"use client";

import { useLang } from "./LangProvider";
import { Reveal } from "./Reveal";

export function Hook() {
  const { t } = useLang();
  return (
    <section className="hook">
      <Reveal className="hook-inner">
        <div className="hook-label">
          <span className="dot" />
          <span className="mono">{t.hook.label}</span>
        </div>
        <p className="hook-quote">
          {t.hook.pre}
          <em>{t.hook.em1}</em>
          {t.hook.mid}
          <em>{t.hook.em2}</em>
          {t.hook.post}
        </p>
        <div className="hook-attr">{t.hook.attr}</div>
      </Reveal>
    </section>
  );
}
