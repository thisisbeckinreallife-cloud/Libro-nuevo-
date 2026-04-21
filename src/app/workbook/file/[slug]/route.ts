import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { readSessionUserId } from "@/lib/session";
import { WORKBOOK_DIR, findWorkbookItem } from "@/lib/workbook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const userId = await readSessionUserId();
  if (!userId) {
    return new NextResponse("unauthorized", { status: 401 });
  }

  const { slug } = await params;
  const item = findWorkbookItem(slug);
  if (!item) {
    return new NextResponse("not found", { status: 404 });
  }

  const filepath = path.join(WORKBOOK_DIR, item.filename);
  let buf: Buffer;
  try {
    buf = await fs.readFile(filepath);
  } catch {
    return new NextResponse("not available", { status: 404 });
  }

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${item.filename}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
