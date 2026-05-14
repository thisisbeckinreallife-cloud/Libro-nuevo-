import type { Metadata } from "next";
import { OfertaLanding } from "@/components/oferta/OfertaLanding";

/**
 * /oferta — landing de máxima conversión.
 *
 * Una sola URL pensada para tráfico de pago (anuncios de Lara, secuencias
 * de email, posts orgánicos con CTA). 1 click hasta Stripe Checkout, 1
 * click más a pagar, redirección a /biblioteca con todo desbloqueado.
 *
 * La home (/) sigue siendo la página editorial larga; esta es la versión
 * "comercial" basada en Hormozi (Value Equation / Grand Slam Offer) y
 * Suby (Godfather Offer).
 */
export const metadata: Metadata = {
  title:
    "El método Arkwright — Ebook + audiolibro · 12 € · Acceso inmediato",
  description:
    "Manual completo para mujeres que ya lo hicieron todo bien y siguen ganando lo mismo. Ebook + audiolibro + workbook. 12 € con 30 días de garantía.",
  openGraph: {
    title: "El método Arkwright — 12 € · Acceso inmediato",
    description:
      "Manual completo para mujeres que ya lo hicieron todo bien y siguen ganando lo mismo. Ebook + audiolibro + workbook. 12 €.",
    type: "website",
  },
};

export default function OfertaPage() {
  return <OfertaLanding />;
}
