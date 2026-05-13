/**
 * Email transaccional enviado al comprador justo después del webhook de
 * `checkout.session.completed`. Contiene:
 *
 *   - Botón principal a /biblioteca?token=… (reproductor web + descargas).
 *   - Enlaces directos al ebook (PDF) y al audiolibro (m4b).
 *   - Pista a /como-escuchar y a /recuperar-acceso.
 *
 * Si `RESEND_API_KEY` no está configurada, hace no-op y loggea. Así no
 * rompemos el webhook en entornos donde el email todavía no esté listo.
 */

import { Resend } from "resend";

type PurchaseLite = {
  id?: string;
  email: string;
  name: string | null;
  accessToken: string;
  lang: string | null;
};

const FROM_DEFAULT = "Arkwright <hola@laralawn.com>";
const SITE_DEFAULT = "https://arkwright.laralawn.com";

function getResend(): Resend | null {
  const key = (process.env.RESEND_API_KEY ?? "").trim();
  if (!key) return null;
  return new Resend(key);
}

function siteUrl(): string {
  return (
    (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim() || SITE_DEFAULT
  ).replace(/\/$/, "");
}

function fromAddress(): string {
  return (process.env.RESEND_FROM ?? "").trim() || FROM_DEFAULT;
}

/**
 * Renderiza el HTML del email. Mantiene estilos inline para máxima
 * compatibilidad (Gmail, Apple Mail, Outlook).
 */
export function renderPurchaseEmailHTML(purchase: PurchaseLite): string {
  const base = siteUrl();
  const tokenParam = encodeURIComponent(purchase.accessToken);
  const bibliotecaUrl = `${base}/biblioteca?token=${tokenParam}`;
  const audioUrl = `${base}/api/biblioteca/audio?token=${tokenParam}`;
  const ebookUrl = `${base}/api/biblioteca/ebook?token=${tokenParam}`;
  const comoEscucharUrl = `${base}/como-escuchar`;
  const recoveryUrl = `${base}/recuperar-acceso`;

  const greeting = purchase.name
    ? `Hola ${purchase.name},`
    : "Hola,";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tu audiolibro y ebook ya están listos</title>
</head>
<body style="margin:0;padding:0;background:#F6F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0E0B0B;line-height:1.5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F1EA;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E8DFD1;">
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="margin:0 0 4px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#B4123F;">Compra confirmada</p>
              <h1 style="margin:0 0 16px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;font-size:28px;line-height:1.2;color:#0E0B0B;">Tu audiolibro y ebook ya están listos.</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#1a1515;">
                ${greeting} gracias por comprar <em>El método Arkwright</em>. Aquí tienes todo lo necesario para empezar.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
                <tr>
                  <td>
                    <a href="${bibliotecaUrl}" style="display:block;background:#B4123F;color:#FFFFFF;text-decoration:none;text-align:center;padding:16px 24px;border-radius:8px;font-weight:600;font-size:16px;">
                      Acceder a la biblioteca →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#6b6360;">
                Dentro encontrarás el reproductor web (escucha sin instalar nada) y los enlaces de descarga.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 24px;">
              <p style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b6360;">
                Descargas directas
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #d9cfbf;">
                    <a href="${audioUrl}" style="color:#0E0B0B;text-decoration:none;font-size:14px;">
                      <strong>Audiolibro</strong> · m4b con 17 capítulos marcados ↓
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <a href="${ebookUrl}" style="color:#0E0B0B;text-decoration:none;font-size:14px;">
                      <strong>Ebook</strong> · PDF / EPUB ↓
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 24px;">
              <p style="margin:0 0 8px;font-size:13px;color:#6b6360;">
                <strong style="color:#0E0B0B;">¿Cómo escucharlo en tu dispositivo?</strong><br>
                Pasos paso a paso para iPhone, Android, Mac, Windows y coche:
                <a href="${comoEscucharUrl}" style="color:#B4123F;">${comoEscucharUrl}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #E8DFD1;background:#EFE7DB;">
              <p style="margin:0 0 4px;font-size:12px;color:#6b6360;">
                Guarda este email — es tu acceso permanente. Si lo pierdes:
                <a href="${recoveryUrl}" style="color:#B4123F;">${recoveryUrl}</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#6b6360;">
                ¿Problemas? Responde a este correo y te ayudo personalmente.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Envía el email post-compra. Devuelve true si el envío se intentó (no
 * necesariamente entregado — Resend confirma asíncrono). Devuelve false
 * si no hay API key configurada (modo no-op para entornos sin email).
 */
export async function sendPurchaseEmail(
  purchase: PurchaseLite,
): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "[purchase-email] RESEND_API_KEY no configurada — skip envío",
      { purchaseId: purchase.id, email: purchase.email },
    );
    return false;
  }

  const html = renderPurchaseEmailHTML(purchase);

  try {
    const result = await resend.emails.send({
      from: fromAddress(),
      to: purchase.email,
      subject: "Tu audiolibro y ebook ya están listos · El método Arkwright",
      html,
    });
    if (result.error) {
      console.error("[purchase-email] resend error", {
        purchaseId: purchase.id,
        error: result.error,
      });
      return false;
    }
    console.log("[purchase-email] sent", {
      purchaseId: purchase.id,
      email: purchase.email,
      emailId: result.data?.id ?? null,
    });
    return true;
  } catch (err) {
    console.error("[purchase-email] send threw", {
      purchaseId: purchase.id,
      err,
    });
    return false;
  }
}
