import type { Metadata } from "next";
import {
  getPurchaseByAccessToken,
  getPurchaseBySessionId,
} from "@/lib/purchase";
import { BibliotecaHero } from "./BibliotecaHero";

/**
 * /biblioteca — buyer-only library after a Stripe Checkout payment.
 *
 *   ?session_id=cs_xxx   → first hit from Stripe success_url
 *   ?token=ACCESS_TOKEN  → bookmarkable URL the buyer keeps
 *
 * Server-renders the right state for the URL it gets:
 *   - has Purchase, paid → show downloads (delegates to BibliotecaHero)
 *   - has Purchase, refunded → "compra reembolsada"
 *   - has session_id but no Purchase yet → "estamos confirmando…"
 *     (the client polls; webhook usually lands within 2-3s)
 *   - bare URL or invalid token → "enlace no válido"
 *
 * No middleware here — the gate is the Purchase row itself.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // Don't index the buyer's downloads URL.
  robots: { index: false, follow: false, nocache: true },
  title: "Biblioteca · The Arkwright Method",
};

type SP = Promise<{
  session_id?: string | string[];
  token?: string | string[];
}>;

function pick(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

type ResolvedAccess =
  | { kind: "ready"; accessToken: string; name: string | null; lang: string; ebookCount: number; audioCount: number }
  | { kind: "refunded" }
  | { kind: "pending"; sessionId: string }
  | { kind: "invalid" };

async function resolveAccess(sp: Awaited<SP>): Promise<ResolvedAccess> {
  const token = pick(sp.token);
  const sessionId = pick(sp.session_id);

  if (token) {
    const p = await getPurchaseByAccessToken(token);
    if (!p) return { kind: "invalid" };
    if (p.status === "refunded") return { kind: "refunded" };
    if (p.status !== "paid") return { kind: "pending", sessionId: p.stripeSessionId };
    return {
      kind: "ready",
      accessToken: p.accessToken,
      name: p.name,
      lang: p.lang,
      ebookCount: p.ebookDownloads,
      audioCount: p.audioDownloads,
    };
  }

  if (sessionId) {
    const p = await getPurchaseBySessionId(sessionId);
    if (!p) return { kind: "pending", sessionId };
    if (p.status === "refunded") return { kind: "refunded" };
    if (p.status !== "paid") return { kind: "pending", sessionId };
    return {
      kind: "ready",
      accessToken: p.accessToken,
      name: p.name,
      lang: p.lang,
      ebookCount: p.ebookDownloads,
      audioCount: p.audioDownloads,
    };
  }

  return { kind: "invalid" };
}

export default async function BibliotecaPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const access = await resolveAccess(sp);

  // The page is a thin shell — all the visual logic lives in the
  // client component, including the polling for "pending" state.
  return (
    <BibliotecaHero
      access={access}
      // Flag to the client which assets are actually downloadable
      // today (audio yes, ebook only when PRODUCT_EBOOK_URL is set).
      ebookAvailable={Boolean((process.env["PRODUCT_EBOOK_URL"] ?? "").trim())}
      audioAvailable={Boolean((process.env["PRODUCT_AUDIO_URL"] ?? "").trim())}
    />
  );
}
