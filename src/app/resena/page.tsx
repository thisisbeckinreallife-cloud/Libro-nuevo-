import { redirect } from "next/navigation";
import { hasQrAccess } from "@/lib/review";
import { rewardAvailability } from "@/lib/reward-files";
import { ResenaHero } from "./ResenaHero";

export const dynamic = "force-dynamic";

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

  const availability = await rewardAvailability();
  const rewardsReady = availability.ebook || availability.audio;
  const amazonUrl = (process.env["REVIEW_AMAZON_URL"] ?? "").trim() || null;

  return <ResenaHero amazonUrl={amazonUrl} rewardsReady={rewardsReady} />;
}
