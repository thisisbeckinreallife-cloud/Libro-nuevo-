import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        paper: "var(--paper)",
        "paper-warm": "var(--paper-warm)",
        bone: "var(--bone)",
        rule: "var(--rule)",
        "rule-soft": "var(--rule-soft)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        muted: "var(--muted)",
      },
      fontFamily: {
        serif: ["var(--serif)"],
        sans: ["var(--sans)"],
        mono: ["var(--mono)"],
      },
      maxWidth: {
        wrap: "var(--max)",
      },
      transitionTimingFunction: {
        edit: "cubic-bezier(.2,.7,.2,1)",
      },
    },
  },
  plugins: [],
};
export default config;
