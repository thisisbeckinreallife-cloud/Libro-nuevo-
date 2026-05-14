/**
 * Email enviado a quien se registra al workbook gratuito desde
 * `/registro`. Le da un link permanente al workbook por si pierde la
 * cookie de sesión (Stripe Checkout o un navegador en modo incógnito).
 *
 * No-op silencioso si RESEND_API_KEY no está configurada.
 */

import { Resend } from "resend";

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

export function renderWorkbookWelcomeHTML(opts: {
  email: string;
  name: string | null;
}): string {
  const base = siteUrl();
  const workbookUrl = `${base}/workbook`;
  const greeting = opts.name ? `Hola ${opts.name},` : "Hola,";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tu acceso al workbook</title>
</head>
<body style="margin:0;padding:0;background:#F6F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0E0B0B;line-height:1.5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F1EA;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E8DFD1;">
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="margin:0 0 4px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#E91E63;">Workbook gratis</p>
              <h1 style="margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;font-weight:400;font-size:28px;line-height:1.2;color:#0E0B0B;">Bienvenido al workbook.</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#1a1515;">
                ${greeting} ya tienes acceso a las 4 dinámicas guiadas. Empieza por la que quieras — son independientes y guardan tu progreso.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
                <tr>
                  <td>
                    <a href="${workbookUrl}" style="display:block;background:#E91E63;color:#FFFFFF;text-decoration:none;text-align:center;padding:16px 24px;border-radius:8px;font-weight:600;font-size:16px;">
                      Entrar al workbook →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#6b6360;">
                Las 4 dinámicas: <em>Diagnóstico</em>, <em>Funeral</em>, <em>Próxima vida</em>, <em>Lunes</em>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #E8DFD1;background:#EFE7DB;">
              <p style="margin:0 0 4px;font-size:12px;color:#6b6360;">
                Guarda este email — si pierdes la sesión del navegador, el link de arriba te vuelve a meter dentro automáticamente.
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#6b6360;">
                ¿Quieres el libro completo (ebook + audiolibro)? Responde a este correo y te paso la oferta.
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

export async function sendWorkbookWelcomeEmail(opts: {
  email: string;
  name: string | null;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[workbook-welcome] RESEND_API_KEY no configurada — skip", {
      email: opts.email,
    });
    return false;
  }
  const html = renderWorkbookWelcomeHTML(opts);
  try {
    const result = await resend.emails.send({
      from: fromAddress(),
      to: opts.email,
      subject: "Tu acceso al workbook · Arkwright",
      html,
    });
    if (result.error) {
      console.error("[workbook-welcome] resend error", { email: opts.email, error: result.error });
      return false;
    }
    console.log("[workbook-welcome] sent", {
      email: opts.email,
      emailId: result.data?.id ?? null,
    });
    return true;
  } catch (err) {
    console.error("[workbook-welcome] threw", { email: opts.email, err });
    return false;
  }
}
