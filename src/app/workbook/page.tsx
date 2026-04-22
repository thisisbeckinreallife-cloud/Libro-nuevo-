import { redirect } from "next/navigation";
import { readSessionUserId } from "@/lib/session";
import { getWorkbookItems } from "@/lib/workbook";
import { WorkbookIndex } from "./WorkbookIndex";

export const dynamic = "force-dynamic";

export default async function WorkbookPage() {
  const userId = await readSessionUserId();
  if (!userId) redirect("/registro");
  const items = await getWorkbookItems();
  return <WorkbookIndex items={items} />;
}
