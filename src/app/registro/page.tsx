import { redirect } from "next/navigation";
import { readSessionUserId } from "@/lib/session";
import { RegistrationHero } from "./RegistrationHero";

export const dynamic = "force-dynamic";

export default async function ReservarPage() {
  const userId = await readSessionUserId();
  if (userId) redirect("/workbook");
  return <RegistrationHero />;
}
