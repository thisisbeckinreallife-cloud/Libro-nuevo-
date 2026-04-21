import { NextResponse } from "next/server";
import { getSlots } from "@/lib/slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const slots = await getSlots();
  return NextResponse.json(slots, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
    },
  });
}
