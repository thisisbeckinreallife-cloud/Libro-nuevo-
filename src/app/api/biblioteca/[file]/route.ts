import { NextResponse, type NextRequest } from "next/server";
import {
  getPurchaseByAccessToken,
  incrementBibliotecaDownload,
  MAX_DOWNLOADS_PER_FILE,
  type RewardKindBiblioteca,
} from "@/lib/purchase";

/**
 * GET /api/biblioteca/[file]?token=ACCESS_TOKEN
 *
 *   file = "ebook" | "audio"
 *
 * Counterpart of `/api/reward/[file]` for the paid funnel. Same
 * defence-in-depth shape:
 *
 *   1. Lookup Purchase by accessToken (constant-time via Postgres
 *      unique index — there's no plaintext compare to time-attack).
 *   2. Reject anything not `paid` (covers refunded + pending).
 *   3. Reject if the buyer has already hit the per-file download cap.
 *   4. Read the asset URL from env (PRODUCT_EBOOK_URL /
 *      PRODUCT_AUDIO_URL). 503 if not set yet — the ebook env var is
 *      empty by design until the file lands on a GitHub Release.
 *   5. Increment the counter, then 302 to the asset URL. The big MP3
 *      doesn't pass through Railway.
 */

export const dynamic = "force-dynamic";

const VALID: readonly RewardKindBiblioteca[] = ["ebook", "audio"];

const ENV_FOR_KIND: Record<RewardKindBiblioteca, string> = {
  ebook: "PRODUCT_EBOOK_URL",
  audio: "PRODUCT_AUDIO_URL",
};

function notFound() {
  return new NextResponse("Not found", {
    status: 404,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ file: string }> },
): Promise<NextResponse> {
  const { file } = await context.params;
  if (!VALID.includes(file as RewardKindBiblioteca)) return notFound();
  const kind = file as RewardKindBiblioteca;

  const token = req.nextUrl.searchParams.get("token");
  if (!token) return notFound();

  const purchase = await getPurchaseByAccessToken(token);
  if (!purchase) return notFound();
  if (purchase.status !== "paid") {
    // refunded | pending | failed — same outward response: not found.
    return notFound();
  }

  const counter =
    kind === "ebook" ? purchase.ebookDownloads : purchase.audioDownloads;
  if (counter >= MAX_DOWNLOADS_PER_FILE) {
    return new NextResponse("Download limit reached", {
      status: 429,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const url = (process.env[ENV_FOR_KIND[kind]] ?? "").trim();
  if (!url) {
    // The asset isn't online yet (typical: ebook env var empty until
    // the file is on a GitHub Release). The /biblioteca page renders
    // a "Próximamente" card based on the same env-var presence, so
    // this branch is mostly a safety net for direct hits.
    return NextResponse.json(
      { error: "not_available_yet" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  await incrementBibliotecaDownload(purchase.id, kind);

  return NextResponse.redirect(url, {
    status: 302,
    headers: { "Cache-Control": "private, no-store" },
  });
}
