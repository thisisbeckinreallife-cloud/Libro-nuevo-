import { NextResponse, type NextRequest } from "next/server";

/**
 * Gates the /resena funnel entry point.
 *
 * When the reader hits /resena?k=SECRET:
 *   1. We validate ?k against REVIEW_QR_SECRET.
 *   2. If valid: drop a signed cookie (so they can revisit without the
 *      param), strip ?k from the URL, and 302 to /resena.
 *   3. If invalid or missing: let the request through — the page will
 *      check the cookie and redirect to / if it's not there either.
 *
 * Cookie writes must happen here because Next 14 Server Components are
 * NOT allowed to mutate cookies; only Route Handlers, Server Actions,
 * and middleware can. Doing this work at the edge keeps the page a
 * pure read-only Server Component.
 */

const QR_COOKIE_NAME = "arkw_resena";
const QR_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const k = req.nextUrl.searchParams.get("k");
  if (!k) return NextResponse.next();

  const expected = process.env["REVIEW_QR_SECRET"] ?? "";
  if (!expected || k !== expected) return NextResponse.next();

  // Valid QR hit: drop the cookie on a redirect that strips ?k.
  const cookieValue = (await sha256Hex(expected)).slice(0, 32);
  const url = req.nextUrl.clone();
  url.searchParams.delete("k");
  const res = NextResponse.redirect(url);
  res.cookies.set(QR_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: QR_COOKIE_MAX_AGE,
  });
  return res;
}

export const config = {
  // Only run middleware on /resena — everything else bypasses the edge.
  matcher: "/resena",
};
