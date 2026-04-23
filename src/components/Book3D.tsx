"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useLang } from "./LangProvider";

export function Book3D() {
  const { t, lang } = useLang();
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    let ry = -24;
    let rx = -6;
    let targetRy = ry;
    let targetRx = rx;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;
    let activePointer: number | null = null;

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

    const onPointerDown = (e: PointerEvent) => {
      // Skip drag when pressing on the rotation buttons
      const target = e.target as HTMLElement | null;
      if (target?.closest(".book-controls")) return;
      // Ignore secondary pointers to avoid pinch-conflicts
      if (activePointer !== null) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      activePointer = e.pointerId;
      dragging = true;
      wrap.classList.add("dragging");
      wrap.classList.remove("idle");
      lastX = e.clientX;
      lastY = e.clientY;
      wrap.setPointerCapture(e.pointerId);
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== activePointer) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      ry += dx * 0.5;
      rx = clampPitch(rx - dy * 0.3);
      targetRy = ry;
      targetRx = rx;
      apply();
    };

    const endDrag = (e: PointerEvent) => {
      if (e.pointerId !== activePointer) return;
      activePointer = null;
      if (!dragging) return;
      dragging = false;
      wrap.classList.remove("dragging");
      wrap.releasePointerCapture?.(e.pointerId);
      startIdle();
    };

    const onHover = (e: PointerEvent) => {
      if (dragging || e.pointerType !== "mouse") return;
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetRy = -24 + px * 22;
      targetRx = clampPitch(-6 - py * 14);
      wrap.classList.remove("idle");
      startTick();
    };

    const onLeave = (e: PointerEvent) => {
      if (dragging || e.pointerType !== "mouse") return;
      targetRy = -24;
      targetRx = -6;
      startTick();
      startIdle();
    };

    const rotateBy = (delta: number) => {
      wrap.classList.remove("idle");
      targetRy = ry + delta;
      startTick();
      startIdle();
    };

    wrap.addEventListener("pointerdown", onPointerDown);
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerup", endDrag);
    wrap.addEventListener("pointercancel", endDrag);
    wrap.addEventListener("pointermove", onHover);
    wrap.addEventListener("pointerleave", onLeave);

    const leftBtn = wrap.querySelector<HTMLButtonElement>("#rotLeft");
    const rightBtn = wrap.querySelector<HTMLButtonElement>("#rotRight");
    const onLeft = () => rotateBy(-90);
    const onRight = () => rotateBy(90);
    leftBtn?.addEventListener("click", onLeft);
    rightBtn?.addEventListener("click", onRight);

    startIdle();

    return () => {
      wrap.removeEventListener("pointerdown", onPointerDown);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerup", endDrag);
      wrap.removeEventListener("pointercancel", endDrag);
      wrap.removeEventListener("pointermove", onHover);
      wrap.removeEventListener("pointerleave", onLeave);
      leftBtn?.removeEventListener("click", onLeft);
      rightBtn?.removeEventListener("click", onRight);
      if (idleTimer) clearTimeout(idleTimer);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  const suffix = lang === "en" ? "en" : "es";
  const frontSrc = `/book/cover-front-${suffix}.jpg`;
  const backSrc = `/book/cover-back-${suffix}.jpg`;
  const spineSrc = `/book/cover-spine-${suffix}.png`;

  return (
    <div
      className="hero-book-wrap idle"
      ref={wrapRef}
      id="heroBook"
      aria-label={t.hero.bookAria}
    >
      <div className="book-stage" ref={stageRef}>
        <div className="face front">
          <Image
            src={frontSrc}
            alt={`${t.hero.coverTitleLine1} ${t.hero.coverTitleLine2} — ${t.hero.coverAuthor}`}
            fill
            sizes="(max-width: 1000px) 90vw, 620px"
            quality={92}
            priority
            className="book-face-img"
          />
        </div>
        <div className="face back">
          <Image
            src={backSrc}
            alt=""
            fill
            sizes="(max-width: 1000px) 90vw, 620px"
            quality={92}
            className="book-face-img"
          />
        </div>
        <div className="face spine">
          <Image
            src={spineSrc}
            alt=""
            fill
            sizes="(max-width: 1000px) 80px, 110px"
            quality={92}
            className="book-face-img"
          />
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
