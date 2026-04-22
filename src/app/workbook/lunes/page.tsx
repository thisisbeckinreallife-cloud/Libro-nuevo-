import { redirect } from "next/navigation";
import { readSessionUserId } from "@/lib/session";
import { getEntries } from "@/lib/workbook-entries";
import { LunesClient } from "./LunesClient";

export const dynamic = "force-dynamic";

export type LunesState = Record<
  string,
  { done: boolean; note: string; doneAt: string | null }
>;

export default async function LunesPage() {
  const userId = await readSessionUserId();
  if (!userId) redirect("/registro");
  const rows = await getEntries(userId, "lunes");
  const state: LunesState = {};
  for (const r of rows) {
    const v = r.value as {
      kind?: string;
      done?: boolean;
      note?: string;
      doneAt?: string | null;
    };
    if (v?.kind === "task") {
      state[r.fieldId] = {
        done: Boolean(v.done),
        note: String(v.note ?? ""),
        doneAt: v.doneAt ?? null,
      };
    }
  }
  return <LunesClient initial={state} />;
}
