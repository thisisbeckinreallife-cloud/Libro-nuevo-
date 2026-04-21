import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default function WorkbookLayout({ children }: { children: React.ReactNode }) {
  return <div className="registration-shell">{children}</div>;
}
