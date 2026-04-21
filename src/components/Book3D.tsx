"use client";

import { useEffect, useRef } from "react";
import { useLang } from "./LangProvider";

export function Book3D() {
  const { t } = useLang();
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    let ry = -28;
    let rx = -6;
    let targetRy = ry;
    let targetRx = rx;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;

    const apply = () => {
      stage.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    apply();

    const clampPitch = (v: number) => Math.max(-35, Math.min(35, v));

    const tick = () => {
      ry += (targetRy - ry) * 0.18;
      rx += (targetRx - rx) * 0.18;
      apply();
      if (Math.abs(targetRy - ry) > 0.05 || Math.abs(targetRx - rx) > 0.05) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const startTick = () => {
      if (rafId == null) rafId = requestAnimationFrame(tick);
    };

    const startIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => wrap.classList.add("idle"), 2200);
    };

    const getPoint = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e && e.touches[0]) return e.touches[0];
      return e as MouseEvent;
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      dragging = true;
      wrap.classList.add("dragging");
      wrap.classList.remove("idle");
      const p = getPoint(e);
      lastX = p.clientX;
      lastY = p.clientY;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const p = getPoint(e);
      const dx = p.clientX - lastX;
      const dy = p.clientY - lastY;
      lastX = p.clientX;
      lastY = p.clientY;
      ry += dx * 0.5;
      rx = clampPitch(rx - dy * 0.3);
      targetRy = ry;
      targetRx = rx;
      apply();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      wrap.classList.remove("dragging");
      startIdle();
    };

    const onHover = (e: MouseEvent) => {
      if (dragging) return;
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetRy = -28 + px * 22;
      targetRx = clampPitch(-6 - py * 14);
      wrap.classList.remove("idle");
      startTick();
    };
    const onLeave = () => {
      if (dragging) return;
      targetRy = -28;
      targetRx = -6;
      startTick();
      startIdle();
    };

    const onLeft = () => {
      wrap.classList.remove("idle");
      targetRy = ry - 90;
      startTick();
      startIdle();
    };
    const onRight = () => {
      wrap.classList.remove("idle");
      targetRy = ry + 90;
      startTick();
      startIdle();
    };

    wrap.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    wrap.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    wrap.addEventListener("mousemove", onHover);
    wrap.addEventListener("mouseleave", onLeave);

    const leftBtn = wrap.querySelector<HTMLButtonElement>("#rotLeft");
    const rightBtn = wrap.querySelector<HTMLButtonElement>("#rotRight");
    leftBtn?.addEventListener("click", onLeft);
    rightBtn?.addEventListener("click", onRight);

    startIdle();

    return () => {
      wrap.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      wrap.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      wrap.removeEventListener("mousemove", onHover);
      wrap.removeEventListener("mouseleave", onLeave);
      leftBtn?.removeEventListener("click", onLeft);
      rightBtn?.removeEventListener("click", onRight);
      if (idleTimer) clearTimeout(idleTimer);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="hero-book-wrap idle"
      ref={wrapRef}
      id="heroBook"
      aria-label={t.hero.bookAria}
    >
      <div className="book-stage" ref={stageRef}>
        <div className="face front">
          <div>
            <div className="cover-top">{t.hero.coverTopline}</div>
          </div>
          <div>
            <div className="cover-mark">{t.hero.coverMark}</div>
            <h2 className="cover-title">
              {t.hero.coverTitleLine1}
              <br />
              <em>{t.hero.coverTitleLine2}</em>
            </h2>
          </div>
          <div className="cover-author">{t.hero.coverAuthor}</div>
        </div>
        <div className="face back">
          <div>
            <div className="cover-top" style={{ marginBottom: 18 }}>
              {t.hero.backLabel}
            </div>
            <p className="back-blurb">{t.hero.coverBlurb}</p>
          </div>
          <div>
            <div className="back-author-line">{t.hero.backExcerptLabel}</div>
            <div className="back-isbn" style={{ marginTop: 18 }}>
              <span>{t.hero.backIsbn}</span>
              <span>{t.hero.backPrice}</span>
            </div>
          </div>
        </div>
        <div className="face spine">
          <div className="spine-text">The Arkwright Method · Lara Lawn</div>
        </div>
        <div className="face edge" />
        <div className="face top" />
        <div className="face bottom" />
      </div>

      <div className="book-controls">
        <button
          type="button"
          className="book-ctrl"
          id="rotLeft"
          aria-label="Rotate left"
          title="Rotate left"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M14 6L8 12L14 18" />
          </svg>
        </button>
        <span className="book-hint">{t.hero.dragHint}</span>
        <button
          type="button"
          className="book-ctrl"
          id="rotRight"
          aria-label="Rotate right"
          title="Rotate right"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M10 6L16 12L10 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
