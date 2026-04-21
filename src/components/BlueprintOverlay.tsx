"use client";

import { useEffect, useRef } from "react";

type Props = {
  labels: { top: string; right: string; bottom: string };
};

export function BlueprintOverlay({ labels }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      className="blueprint-overlay"
      viewBox="0 0 400 500"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="bp-frame">
        <line x1="20" y1="20" x2="60" y2="20" />
        <line x1="20" y1="20" x2="20" y2="60" />
        <line x1="380" y1="20" x2="340" y2="20" />
        <line x1="380" y1="20" x2="380" y2="60" />
        <line x1="20" y1="480" x2="60" y2="480" />
        <line x1="20" y1="480" x2="20" y2="440" />
        <line x1="380" y1="480" x2="340" y2="480" />
        <line x1="380" y1="480" x2="380" y2="440" />
      </g>

      <g className="bp-axes">
        <line x1="50" y1="90" x2="50" y2="410" />
        <line x1="350" y1="90" x2="350" y2="410" />
        <line x1="50" y1="250" x2="350" y2="250" />
      </g>

      <g className="bp-ticks">
        <line x1="48" y1="160" x2="52" y2="160" />
        <line x1="48" y1="340" x2="52" y2="340" />
        <line x1="348" y1="160" x2="352" y2="160" />
        <line x1="348" y1="340" x2="352" y2="340" />
      </g>

      <g className="bp-measure">
        <line x1="60" y1="250" x2="340" y2="250" />
        <line x1="60" y1="246" x2="60" y2="254" />
        <line x1="340" y1="246" x2="340" y2="254" />
      </g>

      <g className="bp-labels">
        <text x="200" y="36" textAnchor="middle" className="bp-label">{labels.top}</text>
        <text
          x="368"
          y="250"
          textAnchor="middle"
          className="bp-label"
          transform="rotate(-90 368 250)"
        >
          {labels.right}
        </text>
        <text x="200" y="466" textAnchor="middle" className="bp-label">{labels.bottom}</text>
      </g>

      <g className="bp-crosshair">
        <circle cx="200" cy="250" r="18" />
        <line x1="200" y1="232" x2="200" y2="268" />
        <line x1="182" y1="250" x2="218" y2="250" />
      </g>
    </svg>
  );
}
