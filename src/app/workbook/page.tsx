import { redirect } from "next/navigation";
import { readSessionUserId } from "@/lib/session";
import { WorkbookPlaceholder } from "./WorkbookPlaceholder";

export const dynamic = "force-dynamic";

export default async function WorkbookPage() {
  const userId = await readSessionUserId();
  if (!userId) redirect("/login");
  return <WorkbookPlaceholder />;
}
