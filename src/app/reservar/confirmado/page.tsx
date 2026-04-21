import { redirect } from "next/navigation";
import { readSessionUserId } from "@/lib/session";
import { ConfirmadoHero } from "./ConfirmadoHero";

export const dynamic = "force-dynamic";

export default async function ReservarConfirmadoPage() {
  const userId = await readSessionUserId();
  if (!userId) redirect("/reservar");
  return <ConfirmadoHero />;
}
