"use server";

import { redirect } from "next/navigation";
import { createReview, type UploadReason } from "@/lib/review";
import { signClaim } from "@/lib/signed-token";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UploadState = {
  error: null | UploadReason | "invalid_email";
  email: string;
};

export async function uploadScreenshotAction(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const emailRaw = String(formData.get("email") ?? "").trim();
  const file = formData.get("screenshot");

  // Email is optional. Validate format only if provided.
  if (emailRaw.length > 0 && !EMAIL_RE.test(emailRaw)) {
    return { error: "invalid_email", email: emailRaw };
  }

  if (!(file instanceof File)) {
    return { error: "empty", email: emailRaw };
  }

  const result = await createReview({
    file,
    email: emailRaw.length > 0 ? emailRaw : null,
  });

  if (!result.ok) {
    return { error: result.reason, email: emailRaw };
  }

  const token = signClaim({ submissionId: result.submissionId });
  redirect(`/resena/recompensa?t=${encodeURIComponent(token)}`);
}
