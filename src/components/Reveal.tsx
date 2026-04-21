"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  className?: string;
  stagger?: boolean;
  children: ReactNode;
  id?: string;
};

export function Reveal({
  as,
  className = "",
  stagger = false,
  children,
  id,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
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

  const base = stagger ? "reveal-stagger" : "reveal";
  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`${base}${className ? ` ${className}` : ""}`}
    >
      {children}
    </Tag>
  );
}
