"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useLang } from "@/components/LangProvider";
import { uploadScreenshotAction, type UploadState } from "./actions";

const INITIAL: UploadState = { error: null, email: "" };
const MAX_BYTES = 5 * 1024 * 1024;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn-primary resena-submit"
      disabled={pending}
    >
      <span>{pending ? "…" : label}</span>
      <span className="arrow" />
    </button>
  );
}

export function UploadForm({ amazonUrl }: { amazonUrl: string }) {
  const { t } = useLang();
  const r = t.resena;
  const [state, formAction] = useFormState(uploadScreenshotAction, INITIAL);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<
    null | "too_big" | "bad_type" | "empty"
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalError(null);
    const file = e.target.files?.[0];
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLocalError("bad_type");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError("too_big");
      e.target.value = "";
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  const errorKey = localError ?? state.error;
  const errorMessage = (() => {
    switch (errorKey) {
      case "too_big":
        return r.errors.tooBig;
      case "bad_type":
        return r.errors.badType;
      case "empty":
        return r.errors.empty;
      case "duplicate":
        return r.errors.duplicate;
      case "rate_limit":
        return r.errors.rateLimit;
      case "invalid_email":
        return r.errors.invalidEmail;
      case "needs_email":
        return r.errors.needsEmail;
      case "generic":
        return r.errors.generic;
      default:
        return null;
    }
  })();

  return (
    <form action={formAction} className="resena-form" noValidate>
      {/* Honeypot — bots fill this; humans don't see it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          opacity: 0,
        }}
      />

      <ol className="resena-steps">
        <li>
          <span className="resena-step-num">1</span>
          <div className="resena-step-body">
            <strong>{r.steps[0].title}</strong>
            <p>{r.steps[0].body}</p>
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="resena-cta"
            >
              <span>{r.amazonCta}</span>
              <span className="arrow" />
            </a>
          </div>
        </li>
        <li>
          <span className="resena-step-num">2</span>
          <div className="resena-step-body">
            <strong>{r.steps[1].title}</strong>
            <p>{r.steps[1].body}</p>
          </div>
        </li>
        <li>
          <span className="resena-step-num">3</span>
          <div className="resena-step-body">
            <strong>{r.steps[2].title}</strong>
            <p>{r.steps[2].body}</p>
          </div>
        </li>
      </ol>

      <div className="resena-upload">
        <label className={`resena-dropzone ${preview ? "has-preview" : ""}`}>
          <input
            ref={fileInputRef}
            name="screenshot"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            capture="environment"
            required
            onChange={onFileChange}
          />
          {preview ? (
            <img
              className="resena-preview"
              src={preview}
              alt=""
              role="img"
              aria-label={r.previewAlt}
            />
          ) : (
            <>
              <span className="resena-dropzone-icon" aria-hidden="true">
                ↑
              </span>
              <span className="resena-dropzone-label">{r.uploadLabel}</span>
              <span className="resena-dropzone-hint">{r.uploadHint}</span>
            </>
          )}
        </label>
      </div>

      <label className="resena-field">
        <span className="resena-label">{r.emailLabel}</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          defaultValue={state.email}
          aria-invalid={errorKey === "invalid_email" || errorKey === "needs_email"}
        />
      </label>

      {errorMessage ? (
        <div className="resena-error" role="alert" aria-live="polite">
          {errorMessage}
        </div>
      ) : null}

      <SubmitButton label={r.submit} />
    </form>
  );
}
