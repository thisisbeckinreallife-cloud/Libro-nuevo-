/**
 * Email enviado al cliente cuando se procesa un reembolso desde Stripe.
 * Confirma la devolución, explica que el acceso a /biblioteca ha sido
 * revocado, y pide feedback honesto sin presión.
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

export function renderRefundHTML(opts: {
  email: string;
  name: string | null;
  amount?: number | null; // cents
  currency?: string | null;
}): string {
  const greeting = opts.name ? `Hola ${opts.name},` : "Hola,";
  const amountText =
    opts.amount && opts.currency
      ? ` (${(opts.amount / 100).toLocaleString("es-ES", { minimumFractionDigits: 2 })} ${opts.currency.toUpperCase()})`
      : "";

  const homeUrl = siteUrl();

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tu reembolso está procesado</title>
</head>
<body style="margin:0;padding:0;background:#F6F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0E0B0B;line-height:1.5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F1EA;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E8DFD1;">
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="margin:0 0 4px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6360;">Reembolso procesado</p>
              <h1 style="margin:0 0 16px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;font-size:28px;line-height:1.2;color:#0E0B0B;">Tu devolución${amountText} está en camino.</h1>
              <p style="margin:0 0 16px;font-size:15px;color:#1a1515;">
                ${greeting} acabamos de procesar el reembolso. Lo verás en el extracto de tu tarjeta en 5–10 días laborables, según tu banco.
              </p>
              <p style="margin:0 0 16px;font-size:14px;color:#6b6360;">
                A partir de ahora el acceso a tu biblioteca digital queda revocado — los enlaces de descarga dejarán de funcionar.
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#6b6360;">
                Si has cambiado de opinión o tuviste algún problema técnico, responde a este correo y lo resolvemos. Y si simplemente no era para ti, sin rencores: gracias por haberle dado una oportunidad.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #E8DFD1;background:#EFE7DB;">
              <p style="margin:0;font-size:12px;color:#6b6360;">
                ${homeUrl}
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

export async function sendRefundEmail(opts: {
  email: string;
  name: string | null;
  amount?: number | null;
  currency?: string | null;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[refund-email] RESEND_API_KEY no configurada — skip", {
      email: opts.email,
    });
    return false;
  }
  const html = renderRefundHTML(opts);
  try {
    const result = await resend.emails.send({
      from: fromAddress(),
      to: opts.email,
      subject: "Tu reembolso está procesado · Arkwright",
      html,
    });
    if (result.error) {
      console.error("[refund-email] resend error", { email: opts.email, error: result.error });
      return false;
    }
    console.log("[refund-email] sent", {
      email: opts.email,
      emailId: result.data?.id ?? null,
    });
    return true;
  } catch (err) {
    console.error("[refund-email] threw", { email: opts.email, err });
    return false;
  }
}
