"use server";

import { redirect } from "next/navigation";
import { createReview, type UploadReason } from "@/lib/review";
import { signClaim } from "@/lib/signed-token";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UploadState = {
  error: null | UploadReason | "invalid_email" | "needs_email";
  email: string;
};

export async function uploadScreenshotAction(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const emailRaw = String(formData.get("email") ?? "").trim();
  const file = formData.get("screenshot");

  // Email is required — we use it to send the downloads later if the
  // reward files aren't on disk yet at upload time, and for remarketing.
  if (emailRaw.length === 0) {
    return { error: "needs_email", email: emailRaw };
  }
  if (!EMAIL_RE.test(emailRaw)) {
    return { error: "invalid_email", email: emailRaw };
  }

  if (!(file instanceof File)) {
    return { error: "empty", email: emailRaw };
  }

  const result = await createReview({ file, email: emailRaw });

  if (!result.ok) {
    return { error: result.reason, email: emailRaw };
  }

  const token = signClaim({ submissionId: result.submissionId });
  redirect(`/resena/recompensa?t=${encodeURIComponent(token)}`);
}
