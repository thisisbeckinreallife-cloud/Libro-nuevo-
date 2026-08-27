import { redirect } from "next/navigation";
import { hasQrAccess } from "@/lib/review";
import { ResenaHero } from "./ResenaHero";

export const dynamic = "force-dynamic";

// Default fallback for the Amazon CTA if REVIEW_AMAZON_URL isn't set yet —
// lands the reader on a real search page for Lara's FIRST book (that's the
// one being reviewed) instead of a dead state.
const AMAZON_FALLBACK =
  "https://www.amazon.es/s?k=Lara+Lawn+no+eres+t%C3%BA+es+tu+subconsciente";

// Lucía (team) receives the review screenshot and grants RECODE access.
const TEAM_EMAIL_FALLBACK = "hola@laralawn.com";

export default async function ResenaPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string | string[] }>;
}) {
  const params = await searchParams;
  const kRaw = params.k;
  const k = Array.isArray(kRaw) ? kRaw[0] : kRaw;

  const allowed = await hasQrAccess(k);
  if (!allowed) redirect("/");

  const amazonUrl =
    (process.env["REVIEW_AMAZON_URL"] ?? "").trim() || AMAZON_FALLBACK;
  const teamEmail =
    (process.env["REVIEW_TEAM_EMAIL"] ?? "").trim() || TEAM_EMAIL_FALLBACK;

  return <ResenaHero amazonUrl={amazonUrl} teamEmail={teamEmail} />;
}
