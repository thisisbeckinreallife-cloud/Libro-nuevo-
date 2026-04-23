import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";

/**
 * The reward files are intentionally NOT inside `public/` — Lara drops them
 * into `private/rewards/` and this resolver finds them at request time.
 *
 * Supported filename patterns (extension determines MIME):
 *   private/rewards/ebook.{epub,pdf,mobi}
 *   private/rewards/audio.{mp3,m4a,wav}
 *
 * If the file isn't there yet the resolver returns null and the UI renders a
 * "Próximamente disponible" state.
 */

export type RewardKind = "ebook" | "audio";

export type ResolvedReward = {
  kind: RewardKind;
  absolutePath: string;
  filename: string;
  contentType: string;
};

const ACCEPTED: Record<RewardKind, { exts: string[]; mime: Record<string, string> }> = {
  ebook: {
    exts: ["epub", "pdf", "mobi"],
    mime: {
      epub: "application/epub+zip",
      pdf: "application/pdf",
      mobi: "application/x-mobipocket-ebook",
    },
  },
  audio: {
    exts: ["mp3", "m4a", "wav"],
    mime: {
      mp3: "audio/mpeg",
      m4a: "audio/mp4",
      wav: "audio/wav",
    },
  },
};

const REWARDS_DIR = path.join(process.cwd(), "private", "rewards");

export async function resolveReward(
  kind: RewardKind,
): Promise<ResolvedReward | null> {
  let files: string[];
  try {
    files = await readdir(REWARDS_DIR);
  } catch {
    return null;
  }

  const spec = ACCEPTED[kind];
  const target = files.find((f) => {
    const ext = f.split(".").pop()?.toLowerCase();
    if (!ext || !spec.exts.includes(ext)) return false;
    const stem = f.slice(0, f.length - ext.length - 1).toLowerCase();
    return stem === kind;
  });
  if (!target) return null;

  const ext = target.split(".").pop()!.toLowerCase();
  return {
    kind,
    absolutePath: path.join(REWARDS_DIR, target),
    filename: target,
    contentType: spec.mime[ext] ?? "application/octet-stream",
  };
}

export async function rewardAvailability(): Promise<
  Record<RewardKind, boolean>
> {
  const [ebook, audio] = await Promise.all([
    resolveReward("ebook"),
    resolveReward("audio"),
  ]);
  return { ebook: !!ebook, audio: !!audio };
}
