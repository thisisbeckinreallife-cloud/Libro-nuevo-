"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { claimBonus } from "@/lib/claim";
import { rateLimit, hashIp } from "@/lib/rate-limit";
import { issueSession } from "@/lib/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ClaimActionState = {
  error:
    | null
    | "invalid_email"
    | "needs_consent"
    | "rate_limit"
    | "email_exists"
    | "generic";
  email: string;
  name: string;
};

export async function claimAction(
  _prev: ClaimActionState,
  formData: FormData,
): Promise<ClaimActionState> {
  const token = String(formData.get("token") ?? "");
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const consent = formData.get("consent") === "on";

  if (!consent) {
    return { error: "needs_consent", email, name };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "invalid_email", email, name };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const rl = rateLimit(`claim:${hashIp(ip)}`, 5, 60);
  if (!rl.ok) {
    return { error: "rate_limit", email, name };
  }

  try {
    const result = await claimBonus({ token, email, name: name || null });
    if (result.ok) {
      await issueSession(result.userId);
    } else if (result.reason === "email_exists") {
      return { error: "email_exists", email, name };
    } else {
      // token_claimed or token_not_found between GET render and POST
      redirect("/reservar/agotado");
    }
  } catch {
    return { error: "generic", email, name };
  }

  redirect(`/reservar/${token}/confirmado`);
}
