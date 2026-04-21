"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useLang } from "@/components/LangProvider";
import { claimAction, type ClaimActionState } from "./actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary registration-submit" disabled={pending}>
      <span>{pending ? "…" : label}</span>
      <span className="arrow" />
    </button>
  );
}

const INITIAL: ClaimActionState = { error: null, email: "", name: "" };

export function RegistrationForm({ token }: { token: string }) {
  const { t } = useLang();
  const [state, formAction] = useFormState(claimAction, INITIAL);
  const r = t.registration;

  const errorMessage = (() => {
    switch (state.error) {
      case "invalid_email":
        return r.errorInvalidEmail;
      case "needs_consent":
        return r.errorNeedsConsent;
      case "rate_limit":
        return r.errorRateLimit;
      case "email_exists":
        return r.errorEmailExists;
      case "generic":
        return r.errorGeneric;
      default:
        return null;
    }
  })();

  return (
    <form action={formAction} className="registration-form" noValidate>
      <input type="hidden" name="token" value={token} />

      <label className="registration-field">
        <span className="registration-label">{r.emailLabel}</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={state.email}
          aria-invalid={state.error === "invalid_email" || state.error === "email_exists"}
        />
        <span className="registration-privacy">{r.emailPrivacy}</span>
      </label>

      <label className="registration-field">
        <span className="registration-label">
          {r.nameLabel} <span className="registration-optional">· {r.nameOptional}</span>
        </span>
        <input name="name" type="text" autoComplete="given-name" defaultValue={state.name} />
      </label>

      <label className="registration-consent">
        <input name="consent" type="checkbox" required aria-invalid={state.error === "needs_consent"} />
        <span>{r.consentLabel}</span>
      </label>

      {errorMessage ? (
        <div className="registration-error" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <SubmitButton label={r.submit} />
    </form>
  );
}
