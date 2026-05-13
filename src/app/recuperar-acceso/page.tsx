"use client";

import { useState } from "react";

/**
 * Página pública: el cliente perdió el email de compra → introduce su
 * email y le reenviamos el link a /biblioteca. La respuesta siempre es
 * 200 (no leakamos qué emails compraron), pero mostramos un mensaje
 * neutral de "si tu email coincide…" para que sea creíble en ambos
 * casos.
 */
export default function RecoverAccessPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "rate_limited" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/recover-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.status === 429) {
        setStatus("rate_limited");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error ?? `error_${res.status}`);
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "network_error");
      setStatus("error");
    }
  }

  return (
    <main className="biblioteca-shell">
      <section className="biblioteca-header">
        <p className="biblioteca-eyebrow">Recuperar acceso</p>
        <h1 className="biblioteca-h1">
          ¿Perdiste el<em> email</em>?
        </h1>
        <p className="biblioteca-intro">
          Introduce el email con el que compraste y te lo reenvío
          inmediatamente con el link a tu biblioteca.
        </p>
      </section>

      <section className="recover-form-shell">
        {status === "sent" ? (
          <div className="recover-success" aria-live="polite">
            <p className="recover-success-title">Revisa tu bandeja de entrada.</p>
            <p className="recover-success-body">
              Si tu email coincide con una compra, te lo acabamos de mandar.
              No olvides mirar también <em>Spam</em> o <em>Promociones</em>.
            </p>
            <p className="recover-success-foot">
              ¿No te llega en 5 min? Responde a cualquier email de Lara y te
              ayudamos manualmente.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="recover-form">
            <label htmlFor="email" className="recover-label">
              Email de compra
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              disabled={status === "sending"}
              className="recover-input"
            />
            <button
              type="submit"
              disabled={status === "sending" || !email}
              className="recover-submit"
            >
              {status === "sending" ? "Enviando…" : "Reenviar mi acceso"}
            </button>

            {status === "rate_limited" ? (
              <p className="recover-error" aria-live="polite">
                Demasiados intentos desde tu conexión. Espera una hora y prueba
                de nuevo.
              </p>
            ) : status === "error" ? (
              <p className="recover-error" aria-live="polite">
                No pude procesar tu solicitud ({errorMsg}). Inténtalo de nuevo
                en unos minutos.
              </p>
            ) : null}
          </form>
        )}

        <p className="recover-meta">
          ¿Aún no has comprado? <a href="/">Vuelve a la página de la oferta →</a>
        </p>
      </section>
    </main>
  );
}
