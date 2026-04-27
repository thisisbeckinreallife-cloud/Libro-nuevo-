"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { claimBonus } from "@/lib/claim";
import { upsertContact, detectLang, type ContactLang } from "@/lib/contact";
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
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const consent = formData.get("consent") === "on";

  if (!consent) return { error: "needs_consent", email, name };
  if (!EMAIL_RE.test(email)) return { error: "invalid_email", email, name };

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const rl = rateLimit(`claim:${hashIp(ip)}`, 5, 60);
  if (!rl.ok) return { error: "rate_limit", email, name };

  // Lang from the form (the client knows the active locale via
  // localStorage); fall back to Accept-Language header if missing.
  const langRaw = String(formData.get("lang") ?? "");
  const lang: ContactLang =
    langRaw === "es" || langRaw === "en" ? langRaw : await detectLang();

  try {
    const result = await claimBonus({ email, name: name || null });
    if (result.ok) {
      await issueSession(result.userId);
      // Mirror the email into the unified contacts table for marketing.
      // Best-effort — failures are swallowed inside upsertContact.
      await upsertContact({
        email,
        source: "workbook",
        name: name || null,
        lang,
        consentMarketing: true, // workbook form requires consent checkbox
      });
    } else if (result.reason === "email_exists") {
      // Even if the User row already existed, refresh the contact row so
      // lastSeenAt advances and the source set stays accurate.
      await upsertContact({
        email,
        source: "workbook",
        name: name || null,
        lang,
        consentMarketing: true,
      });
      return { error: "email_exists", email, name };
    }
  } catch {
    return { error: "generic", email, name };
  }

  redirect("/registro/confirmado");
}
