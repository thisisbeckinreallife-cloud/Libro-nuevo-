"use server";

import { readSessionUserId } from "@/lib/session";
import {
  deleteEntry,
  upsertEntry,
  type EntryValue,
  type SectionSlug,
} from "@/lib/workbook-entries";

export type SaveResult = { ok: true } | { ok: false; reason: "unauthorized" };

export async function saveEntry(
  section: SectionSlug,
  fieldId: string,
  value: EntryValue,
): Promise<SaveResult> {
  const userId = await readSessionUserId();
  if (!userId) return { ok: false, reason: "unauthorized" };
  await upsertEntry(userId, section, fieldId, value);
  return { ok: true };
}

export async function removeEntry(
  section: SectionSlug,
  fieldId: string,
): Promise<SaveResult> {
  const userId = await readSessionUserId();
  if (!userId) return { ok: false, reason: "unauthorized" };
  await deleteEntry(userId, section, fieldId);
  return { ok: true };
}
