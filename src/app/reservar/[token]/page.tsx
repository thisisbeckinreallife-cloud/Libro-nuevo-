import { notFound, redirect } from "next/navigation";
import { lookupToken } from "@/lib/claim";
import { readSessionUserId } from "@/lib/session";
import { RegistrationHero } from "./RegistrationHero";

export const dynamic = "force-dynamic";

export default async function ReservarTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const lookup = await lookupToken(token);

  if (lookup.kind === "unknown" || lookup.kind === "revoked") notFound();

  if (lookup.kind === "claimed") {
    const sessionUserId = await readSessionUserId();
    if (sessionUserId && sessionUserId === lookup.claimantUserId) {
      redirect("/workbook");
    }
    redirect("/reservar/agotado");
  }

  return <RegistrationHero token={token} />;
}
