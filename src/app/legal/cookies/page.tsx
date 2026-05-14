"use client";

import { LegalLayout } from "@/components/LegalLayout";
import { useLang } from "@/components/LangProvider";

/**
 * Política de cookies — Art. 22.2 LSSI-CE.
 *
 * Hoy solo se usan cookies estrictamente necesarias (Stripe checkout +
 * sesión workbook). No se usan Analytics / Marketing aún. La categoría
 * "Analytics" del banner es placeholder para futuro tracking interno
 * (Sprint 3 / `Event` table).
 */
export default function CookiesPage() {
  const { lang } = useLang();
  if (lang === "en") return <CookiesEN />;
  return <CookiesES />;
}

function reopenBanner() {
  try {
    localStorage.removeItem("cookieConsent");
    window.location.reload();
  } catch {
    // localStorage no disponible (modo privado)
  }
}

function CookiesES() {
  return (
    <LegalLayout title="Política de cookies" lastUpdated="14 de mayo de 2026">
      <p>
        Esta política describe cómo INNERAXIS S.L. utiliza cookies y
        tecnologías similares en{" "}
        <a href="https://arkwright.laralawn.com">arkwright.laralawn.com</a>,
        en cumplimiento del{" "}
        <strong>artículo 22.2 de la Ley 34/2002 (LSSI-CE)</strong> y la
        normativa europea ePrivacy.
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Una cookie es un pequeño archivo que el navegador almacena en tu
        dispositivo cuando visitas una web. Permite, entre otras cosas,
        recordar tus preferencias o reconocer tu sesión en futuras visitas.
      </p>

      <h2>2. Qué cookies usamos</h2>
      <h3>Necesarias (no requieren consentimiento)</h3>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Proveedor</th>
            <th>Finalidad</th>
            <th>Duración</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>__stripe_*</code>
            </td>
            <td>Stripe</td>
            <td>
              Procesar el pago de forma segura y prevenir fraude durante el
              checkout.
            </td>
            <td>30 min – 1 año</td>
          </tr>
          <tr>
            <td>
              <code>workbook-session</code>
            </td>
            <td>INNERAXIS S.L.</td>
            <td>
              Mantener tu sesión en el workbook online y recordar tu
              progreso.
            </td>
            <td>30 días</td>
          </tr>
          <tr>
            <td>
              <code>laraLang</code>
            </td>
            <td>INNERAXIS S.L.</td>
            <td>
              Recordar tu preferencia de idioma (ES / EN) entre visitas.
            </td>
            <td>1 año</td>
          </tr>
          <tr>
            <td>
              <code>cookieConsent</code>
            </td>
            <td>INNERAXIS S.L.</td>
            <td>
              Guardar tu elección sobre cookies para no volver a mostrarte
              el banner.
            </td>
            <td>6 meses</td>
          </tr>
        </tbody>
      </table>

      <h3>Analytics (requieren consentimiento)</h3>
      <p>
        Hoy <strong>no utilizamos</strong> cookies de analítica. En el
        futuro podrían incorporarse cookies propias para medir
        anónimamente el rendimiento del Sitio (páginas más visitadas,
        fuente del visitante, conversión). Solo se activarán si has dado
        consentimiento explícito a través del banner.
      </p>

      <h3>Marketing (requieren consentimiento)</h3>
      <p>
        No utilizamos cookies de publicidad o de terceros con fines
        publicitarios.
      </p>

      <h2>3. Cómo gestionar tus preferencias</h2>
      <p>
        Puedes aceptar, rechazar o modificar tus preferencias en cualquier
        momento desde el banner que aparece la primera vez que visitas el
        Sitio. Si quieres volver a verlo, pulsa el siguiente botón:
      </p>
      <p>
        <button
          onClick={reopenBanner}
          style={{
            display: "inline-block",
            padding: "10px 18px",
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontFamily: "var(--sans)",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Configurar cookies
        </button>
      </p>
      <p>
        También puedes configurar tu navegador para bloquear o eliminar las
        cookies. Ten en cuenta que si bloqueas las cookies necesarias el
        proceso de compra y el workbook pueden no funcionar correctamente.
      </p>

      <h2>4. Información sobre cookies de Stripe</h2>
      <p>
        Para gestionar los pagos delegamos en Stripe Inc., que utiliza sus
        propias cookies dentro del flujo de checkout. Más información en{" "}
        <a
          href="https://stripe.com/cookies-policy/legal"
          target="_blank"
          rel="noopener"
        >
          stripe.com/cookies-policy/legal
        </a>
        .
      </p>

      <h2>5. Cambios</h2>
      <p>
        Esta política puede actualizarse si introducimos nuevos tipos de
        cookies. La versión vigente es siempre la publicada en este sitio.
      </p>
    </LegalLayout>
  );
}

function CookiesEN() {
  return (
    <LegalLayout title="Cookie policy" lastUpdated="May 14, 2026">
      <p>
        This policy describes how INNERAXIS S.L. uses cookies and similar
        technologies at{" "}
        <a href="https://arkwright.laralawn.com">arkwright.laralawn.com</a>,
        in compliance with{" "}
        <strong>Article 22.2 of Spanish Law 34/2002 (LSSI-CE)</strong> and
        the EU ePrivacy framework.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        A cookie is a small file the browser stores on your device when you
        visit a website. It can be used, among other things, to remember
        your preferences or recognise your session on future visits.
      </p>

      <h2>2. Cookies we use</h2>
      <h3>Strictly necessary (no consent required)</h3>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>__stripe_*</code>
            </td>
            <td>Stripe</td>
            <td>
              Process payment securely and prevent fraud during checkout.
            </td>
            <td>30 min – 1 year</td>
          </tr>
          <tr>
            <td>
              <code>workbook-session</code>
            </td>
            <td>INNERAXIS S.L.</td>
            <td>Keep your workbook session and remember progress.</td>
            <td>30 days</td>
          </tr>
          <tr>
            <td>
              <code>laraLang</code>
            </td>
            <td>INNERAXIS S.L.</td>
            <td>Remember your language preference (ES / EN).</td>
            <td>1 year</td>
          </tr>
          <tr>
            <td>
              <code>cookieConsent</code>
            </td>
            <td>INNERAXIS S.L.</td>
            <td>
              Save your cookie choice to avoid showing the banner again.
            </td>
            <td>6 months</td>
          </tr>
        </tbody>
      </table>

      <h3>Analytics (consent required)</h3>
      <p>
        We <strong>do not</strong> use analytics cookies today. In the
        future, first-party cookies may be added to anonymously measure
        Site performance (most-visited pages, traffic source, conversion).
        They will only be activated if you explicitly consent via the
        banner.
      </p>

      <h3>Marketing (consent required)</h3>
      <p>We do not use advertising or third-party tracking cookies.</p>

      <h2>3. Managing your preferences</h2>
      <p>
        You can accept, reject or modify your preferences at any time from
        the banner that appears the first time you visit. To see it again,
        click the button below:
      </p>
      <p>
        <button
          onClick={reopenBanner}
          style={{
            display: "inline-block",
            padding: "10px 18px",
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontFamily: "var(--sans)",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cookie settings
        </button>
      </p>
      <p>
        You can also configure your browser to block or delete cookies.
        Note that if you block strictly necessary cookies, the purchase
        flow and the workbook may not work correctly.
      </p>

      <h2>4. About Stripe cookies</h2>
      <p>
        To process payments we delegate to Stripe Inc., which uses its own
        cookies within the checkout flow. More info at{" "}
        <a
          href="https://stripe.com/cookies-policy/legal"
          target="_blank"
          rel="noopener"
        >
          stripe.com/cookies-policy/legal
        </a>
        .
      </p>

      <h2>5. Changes</h2>
      <p>
        This policy may be updated if new types of cookies are introduced.
        The current version is the one published on this site.
      </p>
    </LegalLayout>
  );
}
