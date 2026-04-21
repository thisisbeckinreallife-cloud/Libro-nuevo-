import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { LangProvider } from "@/components/LangProvider";

const PRE_HYDRATION_LANG_SCRIPT = `
try {
  var l = localStorage.getItem('laraLang');
  if (l === 'es' || l === 'en') {
    document.documentElement.setAttribute('lang', l);
  }
} catch (e) {}
`;

export const metadata: Metadata = {
  title: "The Arkwright Method — Lara Lawn",
  description:
    "Cómo tu cerebro, tu identidad y tu entorno deciden —sin que lo sepas— cuánto vas a ganar el resto de tu vida. Y cómo cambiarlo antes de perder la mayor oportunidad desde la Revolución Industrial.",
  openGraph: {
    title: "The Arkwright Method — Lara Lawn",
    description:
      "La mayor oportunidad desde 1760. Un nuevo libro de Lara Lawn. Primavera 2026.",
    type: "book",
    locale: "es_ES",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Arkwright Method — Lara Lawn",
    description:
      "La mayor oportunidad desde 1760. Un nuevo libro de Lara Lawn. Primavera 2026.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <Script id="lang-bootstrap" strategy="beforeInteractive">
          {PRE_HYDRATION_LANG_SCRIPT}
        </Script>
      </head>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
