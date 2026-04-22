import "server-only";

import { prisma } from "./prisma";

export type SectionSlug =
  | "diagnostico"
  | "funeral"
  | "proxima-vida"
  | "lunes";

export type EntryValue =
  | { kind: "slider"; value: number }
  | { kind: "yesno"; value: "yes" | "no" }
  | { kind: "text"; value: string }
  | { kind: "funeral"; value: string; buriedAt: string }
  | { kind: "milestone"; label: string; month: number; done: boolean }
  | { kind: "task"; done: boolean; note: string; doneAt: string | null };

type RawEntry = { section: string; fieldId: string; value: unknown; updatedAt: Date };

export async function getEntries(
  userId: string,
  section: SectionSlug,
): Promise<RawEntry[]> {
  const rows = await prisma.workbookEntry.findMany({
    where: { userId, section },
    select: { section: true, fieldId: true, value: true, updatedAt: true },
    orderBy: { createdAt: "asc" },
  });
  return rows;
}

export async function upsertEntry(
  userId: string,
  section: SectionSlug,
  fieldId: string,
  value: EntryValue,
): Promise<void> {
  await prisma.workbookEntry.upsert({
    where: { userId_section_fieldId: { userId, section, fieldId } },
    create: { userId, section, fieldId, value: value as object },
    update: { value: value as object, updatedAt: new Date() },
  });
}

export async function deleteEntry(
  userId: string,
  section: SectionSlug,
  fieldId: string,
): Promise<void> {
  await prisma.workbookEntry
    .delete({
      where: { userId_section_fieldId: { userId, section, fieldId } },
    })
    .catch(() => {});
}
