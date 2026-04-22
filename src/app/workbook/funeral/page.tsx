import { redirect } from "next/navigation";
import { readSessionUserId } from "@/lib/session";
import { getEntries } from "@/lib/workbook-entries";
import { FuneralClient } from "./FuneralClient";

export const dynamic = "force-dynamic";

export type BurialRecord = {
  fieldId: string;
  text: string;
  buriedAt: string;
};

export default async function FuneralPage() {
  const userId = await readSessionUserId();
  if (!userId) redirect("/registro");
  const rows = await getEntries(userId, "funeral");
  const burials: BurialRecord[] = rows
    .map((r) => {
      const v = r.value as { kind: string; value?: string; buriedAt?: string };
      if (v?.kind !== "funeral") return null;
      return {
        fieldId: r.fieldId,
        text: String(v.value ?? ""),
        buriedAt: String(v.buriedAt ?? r.updatedAt.toISOString()),
      };
    })
    .filter((x): x is BurialRecord => x !== null)
    .sort((a, b) => b.buriedAt.localeCompare(a.buriedAt));
  return <FuneralClient initial={burials} />;
}
