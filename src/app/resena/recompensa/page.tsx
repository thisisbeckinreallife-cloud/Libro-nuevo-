import { redirect } from "next/navigation";
import { getSubmissionById } from "@/lib/review";
import { rewardAvailability } from "@/lib/reward-files";
import { verifyClaim } from "@/lib/signed-token";
import { RecompensaHero } from "./RecompensaHero";

export const dynamic = "force-dynamic";

export default async function RecompensaPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string | string[] }>;
}) {
  const params = await searchParams;
  const tRaw = params.t;
  const token = Array.isArray(tRaw) ? tRaw[0] : tRaw;

  const payload = verifyClaim(token ?? null);
  if (!payload) redirect("/");

  const submission = await getSubmissionById(payload.submissionId);
  if (!submission || submission.claimToken !== token) redirect("/");

  const availability = await rewardAvailability();

  return (
    <RecompensaHero
      token={token!}
      availability={availability}
      ebookDownloads={submission.ebookDownloads}
      audioDownloads={submission.audioDownloads}
    />
  );
}
