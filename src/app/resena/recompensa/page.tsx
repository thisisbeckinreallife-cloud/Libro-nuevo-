import { redirect } from "next/navigation";
import { getSubmissionById } from "@/lib/review";
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

  // Token integrity is validated by verifyClaim (HMAC-SHA256 against
  // SESSION_SECRET). Previously we ALSO compared `submission.claimToken`
  // to the URL token — that was a leftover from an earlier design where
  // the URL carried an opaque DB id. They're now two different things
  // (DB claimToken is random audit data; URL token is a signed HMAC
  // payload) and the comparison always failed, causing the reward page
  // to redirect every authenticated reader back home.
  const payload = verifyClaim(token ?? null);
  if (!payload) redirect("/");

  const submission = await getSubmissionById(payload.submissionId);
  if (!submission) redirect("/");

  return (
    <RecompensaHero
      token={token!}
      ebookDownloads={submission.ebookDownloads}
      audioDownloads={submission.audioDownloads}
    />
  );
}
