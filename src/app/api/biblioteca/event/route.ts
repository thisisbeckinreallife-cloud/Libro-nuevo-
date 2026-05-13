import { NextResponse, type NextRequest } from "next/server";
import { getPurchaseByAccessToken } from "@/lib/purchase";
import { isValidChapterPrefix } from "@/lib/audio-chapters";

/**
 * POST /api/biblioteca/event
 *
 * Body: { token: string, type: string, chapter?: string, metadata?: Record<string, unknown> }
 *
 * Endpoint de tracking ligero para el reproductor web. Acepta eventos
 * del tipo:
 *   - "play_started"
 *   - "play_paused"
 *   - "chapter_changed"
 *   - "chapter_completed"
 *   - "seek"
 *   - "rate_changed"
 *   - "error"
 *
 * No persiste a DB (todavía) — solo loggea estructurado a stdout para
 * que Railway logs los capture. Cuando queramos analíticas reales,
 * añadimos un modelo Prisma `AudioEvent` y empezamos a escribir aquí.
 *
 * Validación: token Purchase paid, prefix válido. Responde 204 siempre
 * (no leakar nada). Errores silenciosos al cliente — el reproductor
 * no debe romperse porque el tracking falle.
 */

export const dynamic = "force-dynamic";

const VALID_TYPES = new Set([
  "play_started",
  "play_paused",
  "chapter_changed",
  "chapter_completed",
  "seek",
  "rate_changed",
  "error",
]);

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: {
    token?: string;
    type?: string;
    chapter?: string;
    metadata?: Record<string, unknown>;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const { token, type, chapter, metadata } = body ?? {};
  if (typeof token !== "string" || typeof type !== "string") {
    return new NextResponse(null, { status: 204 });
  }
  if (!VALID_TYPES.has(type)) {
    return new NextResponse(null, { status: 204 });
  }
  if (chapter && !isValidChapterPrefix(chapter)) {
    return new NextResponse(null, { status: 204 });
  }

  // Validamos que el token sea de una compra paid. Si no, ignoramos
  // el evento (probablemente bot o token caducado).
  const purchase = await getPurchaseByAccessToken(token);
  if (!purchase || purchase.status !== "paid") {
    return new NextResponse(null, { status: 204 });
  }

  // Log estructurado. Railway captura stdout — desde el dashboard se
  // pueden filtrar estos eventos por tipo o por purchaseId.
  console.log("[audio-event]", {
    purchaseId: purchase.id,
    email: purchase.email,
    type,
    chapter: chapter ?? null,
    metadata: metadata ?? null,
    ts: new Date().toISOString(),
  });

  return new NextResponse(null, { status: 204 });
}
