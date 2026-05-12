import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";

/**
 * Reward resolver — supports two delivery modes per file:
 *
 *  1. Filesystem (default for small files): drop the file into
 *     `private/rewards/` and the route streams it.
 *       private/rewards/ebook.{epub,pdf,mobi}
 *       private/rewards/audio.{mp3,m4a,wav}
 *
 *  2. External URL (used for the audiobook — too big for git):
 *     set `REWARD_EBOOK_URL` or `REWARD_AUDIO_URL` to a public download
 *     link (e.g. a GitHub Release asset). The route 302-redirects.
 *
 * If neither mode produces a result, the UI renders "Próximamente
 * disponible" (resolver returns null).
 */

export type RewardKind = "ebook" | "audio";

export type ResolvedReward =
  | {
      kind: RewardKind;
      mode: "filesystem";
      absolutePath: string;
      filename: string;
      contentType: string;
    }
  | {
      kind: RewardKind;
      mode: "url";
      url: string;
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
    // m4b is the standard audiobook container (AAC inside MP4, with
    // chapter markers). Apple Books, VLC and every modern phone treat
    // it like an audio file. Adding it lets us serve real audiobook
    // files without re-muxing them into a chapterless .m4a/.mp3.
    exts: ["mp3", "m4a", "m4b", "wav"],
    mime: {
      mp3: "audio/mpeg",
      m4a: "audio/mp4",
      m4b: "audio/mp4",
      wav: "audio/wav",
    },
  },
};

const REWARDS_DIR = path.join(process.cwd(), "private", "rewards");

const ENV_URL_KEY: Record<RewardKind, string> = {
  ebook: "REWARD_EBOOK_URL",
  audio: "REWARD_AUDIO_URL",
};

/**
 * Pick a content-type based on the URL's extension. Fallback is
 * `application/octet-stream` so the browser still downloads it even
 * if the URL has no recognisable suffix.
 */
function contentTypeForUrl(kind: RewardKind, url: string): { ext: string; contentType: string } {
  const spec = ACCEPTED[kind];
  // Strip query string before sniffing the extension.
  const clean = url.split(/[?#]/)[0]!;
  const ext = clean.split(".").pop()?.toLowerCase() ?? "";
  if (spec.exts.includes(ext)) {
    return { ext, contentType: spec.mime[ext] ?? "application/octet-stream" };
  }
  // No usable extension on the URL — return defaults per kind.
  const fallbackExt = spec.exts[0]!;
  return { ext: fallbackExt, contentType: spec.mime[fallbackExt]! };
}

export async function resolveReward(
  kind: RewardKind,
): Promise<ResolvedReward | null> {
  // 1) External URL takes precedence — set REWARD_AUDIO_URL on Railway
  //    once the GitHub Release asset is up, and the route stops touching
  //    the filesystem for that kind.
  const urlEnv = (process.env[ENV_URL_KEY[kind]] ?? "").trim();
  if (urlEnv) {
    const { ext, contentType } = contentTypeForUrl(kind, urlEnv);
    return {
      kind,
      mode: "url",
      url: urlEnv,
      filename: `${kind}.${ext}`,
      contentType,
    };
  }

  // 2) Filesystem fallback — original behaviour for small files.
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
    mode: "filesystem",
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
