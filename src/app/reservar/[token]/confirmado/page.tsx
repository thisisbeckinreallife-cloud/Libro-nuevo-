import { notFound, redirect } from "next/navigation";
import { lookupToken } from "@/lib/claim";
import { readSessionUserId } from "@/lib/session";
import { ConfirmadoHero } from "./ConfirmadoHero";

export const dynamic = "force-dynamic";

export default async function ReservarConfirmadoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const lookup = await lookupToken(token);
  if (lookup.kind === "unknown" || lookup.kind === "revoked") notFound();

  const sessionUserId = await readSessionUserId();
  const matches =
    lookup.kind === "claimed" && !!sessionUserId && sessionUserId === lookup.claimantUserId;
  if (!matches) redirect(`/reservar/${token}`);

  return <ConfirmadoHero />;
}
