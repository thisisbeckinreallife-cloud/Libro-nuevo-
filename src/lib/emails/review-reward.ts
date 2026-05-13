/**
 * Email enviado al usuario que sube una reseña en /resena. Contiene el
 * link permanente a /resena/recompensa?t=… para que pueda volver a
 * descargar el ebook/audio de recompensa si cierra la pestaña.
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

export function renderReviewRewardHTML(opts: {
  email: string;
  claimSignedToken: string;
}): string {
  const base = siteUrl();
  const rewardUrl = `${base}/resena/recompensa?t=${encodeURIComponent(opts.claimSignedToken)}`;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tu recompensa por la reseña</title>
</head>
<body style="margin:0;padding:0;background:#F6F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0E0B0B;line-height:1.5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F1EA;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E8DFD1;">
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="margin:0 0 4px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#B4123F;">Recompensa lista</p>
              <h1 style="margin:0 0 16px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;font-size:28px;line-height:1.2;color:#0E0B0B;">Gracias por la reseña.</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#1a1515;">
                Tu recompensa ya está disponible. Guarda este email — el enlace de abajo te lleva a la página de descarga siempre que la necesites.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
                <tr>
                  <td>
                    <a href="${rewardUrl}" style="display:block;background:#B4123F;color:#FFFFFF;text-decoration:none;text-align:center;padding:16px 24px;border-radius:8px;font-weight:600;font-size:16px;">
                      Descargar mi recompensa →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#6b6360;">
                El enlace tiene un límite de 5 descargas por archivo. Más que suficiente para guardarte el archivo en el dispositivo donde quieras escucharlo.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #E8DFD1;background:#EFE7DB;">
              <p style="margin:0 0 4px;font-size:12px;color:#6b6360;">
                ¿Algún problema con la descarga? Responde a este correo y te ayudo.
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

export async function sendReviewRewardEmail(opts: {
  email: string;
  claimSignedToken: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[review-reward] RESEND_API_KEY no configurada — skip", {
      email: opts.email,
    });
    return false;
  }
  const html = renderReviewRewardHTML(opts);
  try {
    const result = await resend.emails.send({
      from: fromAddress(),
      to: opts.email,
      subject: "Tu recompensa por la reseña · Arkwright",
      html,
    });
    if (result.error) {
      console.error("[review-reward] resend error", { email: opts.email, error: result.error });
      return false;
    }
    console.log("[review-reward] sent", {
      email: opts.email,
      emailId: result.data?.id ?? null,
    });
    return true;
  } catch (err) {
    console.error("[review-reward] threw", { email: opts.email, err });
    return false;
  }
}
