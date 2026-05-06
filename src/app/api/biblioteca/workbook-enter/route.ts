import { NextResponse, type NextRequest } from "next/server";
import { upsertContact } from "@/lib/contact";
import { prisma } from "@/lib/prisma";
import { getPurchaseByAccessToken } from "@/lib/purchase";
import { issueSession } from "@/lib/session";

/**
 * GET /api/biblioteca/workbook-enter?token=ACCESS_TOKEN
 *
 * Bridge from the paid funnel to the workbook. Validates the
 * Purchase, ensures a `User` exists with the buyer's email, issues
 * the workbook session cookie (`arkw_sid`), then 302s to /workbook.
 *
 * Idempotent end to end:
 *   - User upsert by email — reuses any pre-existing free-tier account.
 *   - Session is freshly issued every time the buyer clicks; the
 *     previous one stays valid until expiry, but the cookie always
 *     reflects the latest one.
 *
 * Also stamps `source=workbook` onto the marketing Contact row so the
 * buyer's profile shows both sources (`purchase,workbook`). That lets
 * us segment "bought but never opened the workbook" vs. "bought and
 * actively using" in the /admin dashboard and CSV export.
 */

export const dynamic = "force-dynamic";

function notFound() {
  return new NextResponse("Not found", {
    status: 404,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return notFound();

  const purchase = await getPurchaseByAccessToken(token);
  if (!purchase) return notFound();
  if (purchase.status !== "paid") {
    // refunded | pending | failed — same outward response.
    return notFound();
  }

  // Ensure the buyer has a User row. The webhook does this too, but
  // we keep the safety net here in case the click arrives before the
  // webhook lands, or for manual purchases issued via the
  // create-test-purchase script.
  const emailNorm = purchase.email.trim().toLowerCase();
  const user = await prisma.user.upsert({
    where: { email: emailNorm },
    update: purchase.name ? { name: purchase.name } : {},
    create: { email: emailNorm, name: purchase.name },
  });

  await issueSession(user.id);

  // Mark the buyer as an active workbook user — segmentation hint for
  // future email campaigns. Best-effort, errors swallowed inside the
  // helper; we don't want a CRM hiccup to block the redirect.
  await upsertContact({
    email: emailNorm,
    source: "workbook",
    name: purchase.name,
    lang: purchase.lang === "en" ? "en" : "es",
    consentMarketing: true,
  });

  // 303 (See Other) is the canonical "POST/GET → GET this resource"
  // redirect, but a plain 302 works in every browser and avoids the
  // edge case where a 303 is interpreted as a HEAD-eligible response
  // by intermediate proxies.
  const target = new URL("/workbook", req.url);
  return NextResponse.redirect(target, {
    status: 302,
    headers: { "Cache-Control": "private, no-store" },
  });
}
