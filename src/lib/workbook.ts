import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

export const WORKBOOK_DIR = path.join(process.cwd(), "workbook-files");

export type WorkbookItemKey = "ex1" | "ex2" | "template" | "checklist";

export type WorkbookItemDef = {
  slug: string;
  key: WorkbookItemKey;
  filename: string;
};

export type WorkbookItem = WorkbookItemDef & { available: boolean };

const DEFS: readonly WorkbookItemDef[] = [
  { slug: "hoja-ejercicios-1", key: "ex1", filename: "hoja-ejercicios-1.pdf" },
  { slug: "hoja-ejercicios-2", key: "ex2", filename: "hoja-ejercicios-2.pdf" },
  { slug: "plantilla", key: "template", filename: "plantilla.pdf" },
  { slug: "checklist", key: "checklist", filename: "checklist.pdf" },
];

export async function getWorkbookItems(): Promise<WorkbookItem[]> {
  return Promise.all(
    DEFS.map(async (d) => {
      try {
        await fs.access(path.join(WORKBOOK_DIR, d.filename));
        return { ...d, available: true };
      } catch {
        return { ...d, available: false };
      }
    }),
  );
}

export function findWorkbookItem(slug: string): WorkbookItemDef | undefined {
  return DEFS.find((d) => d.slug === slug);
}
