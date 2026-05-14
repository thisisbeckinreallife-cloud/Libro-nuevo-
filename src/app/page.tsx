import { OfertaLanding } from "@/components/oferta/OfertaLanding";

export const dynamic = "force-dynamic";

/**
 * Home (`/`).
 *
 * Same Hormozi-style conversion layout as `/oferta` (organic and paid
 * traffic get the same buyer experience), with one extra editorial
 * Before/After block injected via `variant="home"`.
 *
 * Nav and Footer are mounted globally in `RootLayout`, so they don't
 * need to be wired here.
 */
export default function Home() {
  return <OfertaLanding variant="home" />;
}
