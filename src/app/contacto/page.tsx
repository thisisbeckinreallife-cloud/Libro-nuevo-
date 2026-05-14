"use client";

import { useState } from "react";
import { useLang } from "@/components/LangProvider";

/**
 * Página pública /contacto — form que POSTea a /api/contacto y reenvía
 * el mensaje vía Resend al inbox info@inneraxisinstitute.com.
 *
 * 200 siempre tras rate-limit, no leakamos errores de Resend.
 */
export default function ContactoPage() {
  const { lang } = useLang();
  const isES = lang === "es";
  const t = isES ? COPY_ES : COPY_EN;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "rate_limited" | "error"
  >("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.status === 429) {
        setStatus("rate_limited");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <main className="legal-shell">
        <article className="legal-article">
          <header className="legal-header">
            <p className="legal-eyebrow">{t.eyebrow}</p>
            <h1 className="legal-h1">{t.successTitle}</h1>
          </header>
          <div className="legal-content">
            <p>{t.successBody}</p>
            <p>
              <a href="/" className="legal-back">
                {t.backHome}
              </a>
            </p>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="legal-shell">
      <article className="legal-article">
        <header className="legal-header">
          <p className="legal-eyebrow">{t.eyebrow}</p>
          <h1 className="legal-h1">{t.title}</h1>
          <p className="legal-meta">{t.intro}</p>
        </header>

        <form className="contacto-form" onSubmit={onSubmit}>
          <label className="contacto-field">
            <span className="contacto-label">{t.nameLabel}</span>
            <input
              type="text"
              required
              maxLength={200}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === "sending"}
              placeholder={t.namePlaceholder}
            />
          </label>

          <label className="contacto-field">
            <span className="contacto-label">{t.emailLabel}</span>
            <input
              type="email"
              required
              maxLength={320}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending"}
              placeholder={t.emailPlaceholder}
            />
          </label>

          <label className="contacto-field">
            <span className="contacto-label">{t.messageLabel}</span>
            <textarea
              required
              maxLength={4000}
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === "sending"}
              placeholder={t.messagePlaceholder}
            />
          </label>

          <button
            type="submit"
            className="contacto-submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? t.sending : t.submit}
          </button>

          {status === "rate_limited" ? (
            <p className="contacto-error" role="alert">
              {t.rateLimited}
            </p>
          ) : null}
          {status === "error" ? (
            <p className="contacto-error" role="alert">
              {t.error}
            </p>
          ) : null}

          <p className="contacto-note">
            {t.privacyPrefix}{" "}
            <a href="/legal/privacidad">{t.privacyLink}</a>.
          </p>
        </form>
      </article>
    </main>
  );
}

const COPY_ES = {
  eyebrow: "Contacto",
  title: "Escríbenos",
  intro:
    "Para dudas, problemas con tu compra o cualquier otra cuestión. Respondemos en menos de 48 horas en días laborables.",
  nameLabel: "Tu nombre",
  namePlaceholder: "Nombre y apellido",
  emailLabel: "Tu email",
  emailPlaceholder: "tu@email.com",
  messageLabel: "Tu mensaje",
  messagePlaceholder: "Cuéntanos qué necesitas…",
  submit: "Enviar mensaje",
  sending: "Enviando…",
  rateLimited:
    "Has enviado varios mensajes recientemente. Espera un poco antes de intentarlo otra vez.",
  error:
    "No hemos podido enviar el mensaje. Reintenta en unos minutos o escríbenos directamente a info@inneraxisinstitute.com.",
  successTitle: "Mensaje enviado",
  successBody:
    "Hemos recibido tu mensaje. Te respondemos en menos de 48 horas (días laborables).",
  backHome: "← Volver al inicio",
  privacyPrefix:
    "Solo usaremos tu email para contestarte. Más detalles en nuestra",
  privacyLink: "política de privacidad",
} as const;

const COPY_EN = {
  eyebrow: "Contact",
  title: "Write to us",
  intro:
    "For questions, issues with your purchase or anything else. We reply within 48 hours on business days.",
  nameLabel: "Your name",
  namePlaceholder: "First and last name",
  emailLabel: "Your email",
  emailPlaceholder: "you@email.com",
  messageLabel: "Your message",
  messagePlaceholder: "Tell us what you need…",
  submit: "Send message",
  sending: "Sending…",
  rateLimited:
    "You've sent several messages recently. Wait a bit before trying again.",
  error:
    "We couldn't send the message. Try again in a few minutes or write directly to info@inneraxisinstitute.com.",
  successTitle: "Message sent",
  successBody:
    "We've received your message. We'll reply within 48 hours (business days).",
  backHome: "← Back to home",
  privacyPrefix: "We'll only use your email to reply. More details in our",
  privacyLink: "privacy policy",
} as const;
