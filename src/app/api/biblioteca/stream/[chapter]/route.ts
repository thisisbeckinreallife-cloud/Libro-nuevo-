import { NextResponse, type NextRequest } from "next/server";
import { getPurchaseByAccessToken } from "@/lib/purchase";
import { getChapterUrl, isValidChapterPrefix } from "@/lib/audio-chapters";

/**
 * GET /api/biblioteca/stream/[chapter]?token=ACCESS_TOKEN
 *
 *   chapter = "00" | "01" | ... | "16"
 *
 * Sirve un capítulo individual del audiolibro al reproductor web embebido
 * de /biblioteca. A diferencia de /api/biblioteca/audio (que cuenta como
 * descarga y tiene cap), este endpoint:
 *
 *   1. Valida el access token igual que /api/biblioteca/[file].
 *   2. NO incrementa contadores — los usuarios reproducen muchas veces
 *      cada capítulo, y la cuota de 5 descargas/file es para la copia
 *      offline (m4b o zip), no para streaming.
 *   3. 302-redirige al MP3 individual en GitHub Releases (o a R2 si se
 *      sobreescribe vía env PRODUCT_AUDIO_CHAPTERS_BASE_URL).
 *
 * El navegador hace su Range request directamente al asset (no pasa por
 * Railway), así el seek es instantáneo y no consumimos ancho de banda
 * de la app.
 */

export const dynamic = "force-dynamic";

function notFound() {
  return new NextResponse("Not found", {
    status: 404,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ chapter: string }> },
): Promise<NextResponse> {
  const { chapter } = await context.params;
  if (!isValidChapterPrefix(chapter)) return notFound();

  const token = req.nextUrl.searchParams.get("token");
  if (!token) return notFound();

  const purchase = await getPurchaseByAccessToken(token);
  if (!purchase) return notFound();
  if (purchase.status !== "paid") return notFound();

  const url = getChapterUrl(chapter);
  if (!url) return notFound();

  return NextResponse.redirect(url, {
    status: 302,
    headers: { "Cache-Control": "private, no-store" },
  });
}
