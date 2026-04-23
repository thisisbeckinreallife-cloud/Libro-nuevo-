import { readFile } from "node:fs/promises";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSubmissionById, incrementDownload } from "@/lib/review";
import { resolveReward, type RewardKind } from "@/lib/reward-files";
import { verifyClaim } from "@/lib/signed-token";

/**
 * Private reward download endpoint. Streams the ebook or audio file
 * only when the caller has a valid signed claim token.
 *
 * GET /api/reward/ebook?t=TOKEN
 * GET /api/reward/audio?t=TOKEN
 *
 * All failure modes return 404 except the "file not on disk yet" path,
 * which returns 503 so the UI can distinguish "Próximamente disponible"
 * from "invalid link".
 */

export const dynamic = "force-dynamic";

const MAX_DOWNLOADS_PER_FILE = 2;

const VALID_KINDS: readonly RewardKind[] = ["ebook", "audio"];

function notFound() {
  return new NextResponse("Not found", { status: 404 });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ file: string }> },
): Promise<NextResponse> {
  const { file } = await context.params;
  if (!VALID_KINDS.includes(file as RewardKind)) return notFound();
  const kind = file as RewardKind;

  const token = req.nextUrl.searchParams.get("t");
  const payload = verifyClaim(token);
  if (!payload) return notFound();

  const submission = await getSubmissionById(payload.submissionId);
  if (!submission) return notFound();
  // HMAC signature already proves the token was issued by this server and
  // names this submissionId. We used to also compare `submission.claimToken`
  // to the URL token; that was a leftover from a pre-HMAC design and has
  // been removed (the two fields carry different information now).

  const counter =
    kind === "ebook"
      ? submission.ebookDownloads
      : submission.audioDownloads;
  if (counter >= MAX_DOWNLOADS_PER_FILE) {
    return new NextResponse("Download limit reached", {
      status: 429,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const resolved = await resolveReward(kind);
  if (!resolved) {
    return NextResponse.json(
      { error: "not_available_yet" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let bytes: Buffer;
  try {
    bytes = await readFile(resolved.absolutePath);
  } catch {
    return NextResponse.json(
      { error: "not_available_yet" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  // Only increment the counter once we know we can actually serve.
  await incrementDownload(submission.id, kind);

  // Allocate a fresh ArrayBuffer and copy into it so the TS type narrows
  // from `ArrayBufferLike` (which `@types/node`'s Buffer now uses) to a
  // plain `ArrayBuffer` accepted as BodyInit.
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);

  return new NextResponse(ab, {
    status: 200,
    headers: {
      "Content-Type": resolved.contentType,
      "Content-Length": String(bytes.length),
      "Content-Disposition": `attachment; filename="${resolved.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
