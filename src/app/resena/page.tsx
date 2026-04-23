import { redirect } from "next/navigation";
import { hasQrAccess } from "@/lib/review";
import { ResenaHero } from "./ResenaHero";

export const dynamic = "force-dynamic";

// Default fallback for the Amazon CTA if REVIEW_AMAZON_URL isn't set yet —
// lands the reader on a real search page instead of a dead state.
const AMAZON_FALLBACK =
  "https://www.amazon.es/s?k=Lara+Lawn+Arkwright+Method";

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

  return <ResenaHero amazonUrl={amazonUrl} />;
}
