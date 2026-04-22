import { redirect } from "next/navigation";
import { readSessionUserId } from "@/lib/session";
import { getEntries } from "@/lib/workbook-entries";
import { DiagnosticoClient } from "./DiagnosticoClient";

export const dynamic = "force-dynamic";

export default async function DiagnosticoPage() {
  const userId = await readSessionUserId();
  if (!userId) redirect("/registro");
  const rows = await getEntries(userId, "diagnostico");
  const initial: Record<string, unknown> = {};
  for (const r of rows) initial[r.fieldId] = r.value;
  return <DiagnosticoClient initial={initial} />;
}
