"use client";

import { LegalLayout } from "@/components/LegalLayout";
import { useLang } from "@/components/LangProvider";

/**
 * Política de privacidad — GDPR (Reglamento UE 2016/679) + LOPDGDD
 * (Ley Orgánica 3/2018).
 *
 * Cubre: responsable del tratamiento, qué datos, base jurídica,
 * finalidades, plazos de conservación, encargados, derechos del
 * interesado, transferencias internacionales (Stripe US, Resend US),
 * canal para reclamaciones (AEPD).
 */
export default function PrivacidadPage() {
  const { lang } = useLang();
  if (lang === "en") return <PrivacyEN />;
  return <PrivacidadES />;
}

function PrivacidadES() {
  return (
    <LegalLayout
      title="Política de privacidad"
      lastUpdated="14 de mayo de 2026"
    >
      <p>
        Esta política explica cómo INNERAXIS S.L. trata los datos
        personales que recoge a través del Sitio{" "}
        <a href="https://arkwright.laralawn.com">arkwright.laralawn.com</a>,
        en cumplimiento del <strong>RGPD (UE 2016/679)</strong> y la{" "}
        <strong>LOPDGDD (Ley Orgánica 3/2018)</strong>.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>
          <strong>Titular:</strong> INNERAXIS S.L.
        </li>
        <li>
          <strong>CIF:</strong> B22620348
        </li>
        <li>
          <strong>Domicilio:</strong> Calle Ruiseñor 22, 45280 Olías del Rey
          (Toledo), España
        </li>
        <li>
          <strong>Contacto:</strong>{" "}
          <a href="mailto:info@inneraxisinstitute.com">
            info@inneraxisinstitute.com
          </a>
        </li>
      </ul>

      <h2>2. Qué datos recogemos y para qué</h2>
      <table>
        <thead>
          <tr>
            <th>Finalidad</th>
            <th>Datos</th>
            <th>Base jurídica</th>
            <th>Conservación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Procesar tu compra digital</td>
            <td>Email, nombre, datos de pago (procesados por Stripe)</td>
            <td>Ejecución del contrato (Art. 6.1.b RGPD)</td>
            <td>10 años (obligaciones fiscales)</td>
          </tr>
          <tr>
            <td>Entregar el acceso a la biblioteca digital</td>
            <td>Email, token de acceso, contador de descargas</td>
            <td>Ejecución del contrato</td>
            <td>Mientras el acceso esté activo + 5 años</td>
          </tr>
          <tr>
            <td>Enviar el email transaccional de compra</td>
            <td>Email, nombre</td>
            <td>Ejecución del contrato</td>
            <td>3 años desde el último contacto</td>
          </tr>
          <tr>
            <td>Workbook online (guardar progreso)</td>
            <td>Email, respuestas del workbook</td>
            <td>Ejecución del contrato</td>
            <td>Mientras la cuenta esté activa</td>
          </tr>
          <tr>
            <td>Validación de reseñas (funnel /resena)</td>
            <td>Captura subida, hash de IP, email</td>
            <td>Consentimiento (Art. 6.1.a RGPD)</td>
            <td>3 años o hasta retirada del consentimiento</td>
          </tr>
          <tr>
            <td>Contacto vía formulario</td>
            <td>Email, nombre, mensaje</td>
            <td>Consentimiento</td>
            <td>1 año o hasta resolución de la consulta</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Encargados del tratamiento</h2>
      <p>
        Para prestar el servicio compartimos datos estrictamente
        necesarios con los siguientes proveedores, que actúan como{" "}
        <strong>encargados del tratamiento</strong>:
      </p>
      <ul>
        <li>
          <strong>Stripe Inc.</strong> (procesamiento de pagos · Estados
          Unidos · acogido a las cláusulas contractuales tipo de la Comisión
          Europea).
        </li>
        <li>
          <strong>Resend</strong> (envío de emails transaccionales · Estados
          Unidos · cláusulas contractuales tipo).
        </li>
        <li>
          <strong>Railway</strong> (alojamiento de la web y la base de
          datos · Estados Unidos · cláusulas contractuales tipo).
        </li>
        <li>
          <strong>GitHub</strong> (alojamiento de los archivos descargables
          como assets de Releases · Estados Unidos · cláusulas contractuales
          tipo).
        </li>
      </ul>

      <h2>4. Tus derechos</h2>
      <p>
        Puedes ejercer en cualquier momento los siguientes derechos
        escribiendo a{" "}
        <a href="mailto:info@inneraxisinstitute.com">
          info@inneraxisinstitute.com
        </a>{" "}
        e identificándote adecuadamente:
      </p>
      <ul>
        <li>
          <strong>Acceso</strong> a tus datos personales.
        </li>
        <li>
          <strong>Rectificación</strong> de datos inexactos.
        </li>
        <li>
          <strong>Supresión</strong> (cuando ya no sean necesarios para la
          finalidad que motivó su recogida).
        </li>
        <li>
          <strong>Limitación</strong> del tratamiento.
        </li>
        <li>
          <strong>Portabilidad</strong> de los datos en formato estructurado.
        </li>
        <li>
          <strong>Oposición</strong> al tratamiento.
        </li>
        <li>
          <strong>Retirar el consentimiento</strong> otorgado, sin que ello
          afecte a la licitud del tratamiento previo.
        </li>
      </ul>
      <p>
        Si consideras que el tratamiento no se ajusta a la normativa, tienes
        derecho a presentar reclamación ante la{" "}
        <strong>Agencia Española de Protección de Datos (AEPD)</strong>:{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener">
          www.aepd.es
        </a>
        .
      </p>

      <h2>5. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas adecuadas para proteger
        tus datos: cifrado HTTPS en todas las páginas, base de datos
        cifrada en reposo, acceso restringido a personal autorizado, copias
        de seguridad regulares.
      </p>

      <h2>6. Menores</h2>
      <p>
        Los servicios no están dirigidos a menores de 18 años. Si tienes
        conocimiento de que un menor ha facilitado datos sin autorización
        de sus tutores, contáctanos para proceder a la supresión.
      </p>

      <h2>7. Modificaciones</h2>
      <p>
        Esta política puede actualizarse. La versión vigente es siempre la
        publicada en este sitio, con su fecha de "Última actualización".
      </p>
    </LegalLayout>
  );
}

function PrivacyEN() {
  return (
    <LegalLayout title="Privacy policy" lastUpdated="May 14, 2026">
      <p>
        This policy explains how INNERAXIS S.L. processes personal data
        collected through{" "}
        <a href="https://arkwright.laralawn.com">arkwright.laralawn.com</a>,
        in compliance with the <strong>EU GDPR (2016/679)</strong> and the
        Spanish <strong>LOPDGDD (Organic Law 3/2018)</strong>.
      </p>

      <h2>1. Data controller</h2>
      <ul>
        <li>
          <strong>Entity:</strong> INNERAXIS S.L.
        </li>
        <li>
          <strong>Tax ID:</strong> B22620348
        </li>
        <li>
          <strong>Address:</strong> Calle Ruiseñor 22, 45280 Olías del Rey
          (Toledo), Spain
        </li>
        <li>
          <strong>Contact:</strong>{" "}
          <a href="mailto:info@inneraxisinstitute.com">
            info@inneraxisinstitute.com
          </a>
        </li>
      </ul>

      <h2>2. What data we collect and why</h2>
      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Data</th>
            <th>Legal basis</th>
            <th>Retention</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Process your digital purchase</td>
            <td>Email, name, payment data (handled by Stripe)</td>
            <td>Contract (GDPR Art. 6.1.b)</td>
            <td>10 years (tax obligations)</td>
          </tr>
          <tr>
            <td>Deliver access to the digital library</td>
            <td>Email, access token, download counter</td>
            <td>Contract</td>
            <td>While access is active + 5 years</td>
          </tr>
          <tr>
            <td>Send the transactional purchase email</td>
            <td>Email, name</td>
            <td>Contract</td>
            <td>3 years from last contact</td>
          </tr>
          <tr>
            <td>Online workbook (save progress)</td>
            <td>Email, workbook answers</td>
            <td>Contract</td>
            <td>While the account is active</td>
          </tr>
          <tr>
            <td>Review validation (/resena funnel)</td>
            <td>Uploaded screenshot, IP hash, email</td>
            <td>Consent (GDPR Art. 6.1.a)</td>
            <td>3 years or until withdrawal of consent</td>
          </tr>
          <tr>
            <td>Contact form</td>
            <td>Email, name, message</td>
            <td>Consent</td>
            <td>1 year or until query resolution</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Data processors</h2>
      <p>
        To deliver the service we share strictly necessary data with the
        following providers acting as <strong>data processors</strong>:
      </p>
      <ul>
        <li>
          <strong>Stripe Inc.</strong> (payment processing · United States ·
          covered by EU Standard Contractual Clauses).
        </li>
        <li>
          <strong>Resend</strong> (transactional email · United States ·
          Standard Contractual Clauses).
        </li>
        <li>
          <strong>Railway</strong> (web and database hosting · United States
          · Standard Contractual Clauses).
        </li>
        <li>
          <strong>GitHub</strong> (downloadable asset hosting via Releases ·
          United States · Standard Contractual Clauses).
        </li>
      </ul>

      <h2>4. Your rights</h2>
      <p>
        You can exercise the following rights at any time by writing to{" "}
        <a href="mailto:info@inneraxisinstitute.com">
          info@inneraxisinstitute.com
        </a>{" "}
        with proper identification:
      </p>
      <ul>
        <li>
          <strong>Access</strong> to your personal data.
        </li>
        <li>
          <strong>Rectification</strong> of inaccurate data.
        </li>
        <li>
          <strong>Erasure</strong> (when no longer needed for the purpose
          collected).
        </li>
        <li>
          <strong>Restriction</strong> of processing.
        </li>
        <li>
          <strong>Portability</strong> of the data in a structured format.
        </li>
        <li>
          <strong>Objection</strong> to processing.
        </li>
        <li>
          <strong>Withdraw consent</strong> previously granted, without
          affecting the lawfulness of previous processing.
        </li>
      </ul>
      <p>
        If you consider that processing does not comply with regulations,
        you have the right to file a complaint with the{" "}
        <strong>
          Spanish Data Protection Agency (AEPD)
        </strong>
        :{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener">
          www.aepd.es
        </a>
        .
      </p>

      <h2>5. Security</h2>
      <p>
        We apply appropriate technical and organisational measures: HTTPS
        encryption on every page, encrypted database at rest, access
        restricted to authorised personnel, regular backups.
      </p>

      <h2>6. Minors</h2>
      <p>
        Services are not directed at users under 18. If you become aware
        that a minor has provided data without their guardians'
        authorisation, contact us to proceed with deletion.
      </p>

      <h2>7. Changes</h2>
      <p>
        This policy may be updated. The current version is the one
        published on this site, with its "Last updated" date.
      </p>
    </LegalLayout>
  );
}
