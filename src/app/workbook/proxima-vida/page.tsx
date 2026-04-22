import { redirect } from "next/navigation";
import { readSessionUserId } from "@/lib/session";
import { getEntries } from "@/lib/workbook-entries";
import { ProximaVidaClient } from "./ProximaVidaClient";

export const dynamic = "force-dynamic";

export type Milestone = {
  fieldId: string;
  label: string;
  month: number; // 0..11
  done: boolean;
};

export default async function ProximaVidaPage() {
  const userId = await readSessionUserId();
  if (!userId) redirect("/registro");
  const rows = await getEntries(userId, "proxima-vida");
  const milestones: Milestone[] = rows
    .map((r) => {
      const v = r.value as {
        kind: string;
        label?: string;
        month?: number;
        done?: boolean;
      };
      if (v?.kind !== "milestone") return null;
      return {
        fieldId: r.fieldId,
        label: String(v.label ?? ""),
        month: Math.max(0, Math.min(11, Number(v.month ?? 0))),
        done: Boolean(v.done),
      };
    })
    .filter((x): x is Milestone => x !== null)
    .sort((a, b) => a.month - b.month);
  return <ProximaVidaClient initial={milestones} />;
}
