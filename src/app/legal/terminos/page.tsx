"use client";

import { LegalLayout } from "@/components/LegalLayout";
import { useLang } from "@/components/LangProvider";

/**
 * Términos y Condiciones — Real Decreto Legislativo 1/2007 de
 * Consumidores y Usuarios + Ley 7/1998 de Condiciones Generales de la
 * Contratación.
 *
 * Punto crítico: waiver del derecho de desistimiento conforme al
 * art. 103.m) del RD-Ley 1/2007, aplicable a contenido digital
 * suministrado sin soporte material y con consentimiento previo del
 * consumidor para iniciar la ejecución (= el acceso inmediato a la
 * biblioteca después del pago).
 */
export default function TerminosPage() {
  const { lang } = useLang();
  if (lang === "en") return <TermsEN />;
  return <TerminosES />;
}

function TerminosES() {
  return (
    <LegalLayout
      title="Términos y condiciones"
      lastUpdated="14 de mayo de 2026"
    >
      <p>
        Estas condiciones generales regulan la contratación de los
        productos digitales ofrecidos por INNERAXIS S.L. a través de{" "}
        <a href="https://arkwright.laralawn.com">arkwright.laralawn.com</a>{" "}
        (en adelante, <strong>"el Sitio"</strong>).
      </p>

      <h2>1. Vendedor</h2>
      <ul>
        <li>
          <strong>Razón social:</strong> INNERAXIS S.L.
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

      <h2>2. Producto</h2>
      <p>El producto digital comercializado en el Sitio comprende:</p>
      <ul>
        <li>
          <strong>Ebook</strong> "El método Arkwright" (Lara Lawn), 25
          capítulos, formatos PDF y EPUB.
        </li>
        <li>
          <strong>Audiolibro</strong> "El método Arkwright", 17 capítulos
          marcados, duración 5h 34min, voz narradora "Despina", castellano
          de España.
        </li>
        <li>
          <strong>Workbook online</strong> con cuatro dinámicas guiadas
          accesibles en{" "}
          <a href="https://arkwright.laralawn.com/workbook">/workbook</a>.
        </li>
        <li>
          <strong>BONUS</strong> (se desbloquean al subir una reseña en
          Amazon a través de{" "}
          <a href="https://arkwright.laralawn.com/resena">/resena</a>):
          ebook y audiolibro del primer libro de Lara Lawn{" "}
          <em>"No eres tú, es tu subconsciente"</em>.
        </li>
      </ul>

      <h2>3. Precio</h2>
      <p>
        El precio del producto es <strong>12 €</strong>, impuestos
        incluidos. El pago se realiza en un único cargo procesado por
        Stripe en el momento de la compra. No hay suscripciones ni
        renovaciones automáticas.
      </p>

      <h2>4. Proceso de compra</h2>
      <ol>
        <li>
          El usuario pulsa el botón de compra en el Sitio y es redirigido a
          la pasarela segura de Stripe.
        </li>
        <li>
          En Stripe introduce su email y sus datos de pago. Stripe envía un
          recibo al email facilitado.
        </li>
        <li>
          Una vez confirmado el pago, el usuario es redirigido a{" "}
          <code>/biblioteca</code>, donde tiene acceso inmediato a la
          totalidad del contenido digital adquirido. Además recibe un email
          con el enlace permanente a su biblioteca.
        </li>
      </ol>

      <h2>5. Renuncia expresa al derecho de desistimiento</h2>
      <p>
        De conformidad con el{" "}
        <strong>
          artículo 103.m) del Real Decreto Legislativo 1/2007, de 16 de
          noviembre
        </strong>
        , por el que se aprueba el texto refundido de la Ley General para
        la Defensa de los Consumidores y Usuarios, el derecho de
        desistimiento <strong>NO RESULTA APLICABLE</strong> a los contratos
        que tengan por objeto:
      </p>
      <blockquote
        style={{
          borderLeft: "3px solid var(--accent)",
          paddingLeft: "16px",
          margin: "16px 0",
          fontStyle: "italic",
          color: "var(--ink)",
        }}
      >
        "El suministro de contenido digital que no se preste en un soporte
        material cuando la ejecución haya comenzado con el previo
        consentimiento expreso del consumidor y usuario, con el
        conocimiento por su parte de que en consecuencia pierde su derecho
        de desistimiento."
      </blockquote>
      <p>
        Al adquirir el producto, el comprador <strong>ACEPTA EXPRESAMENTE</strong>{" "}
        que la ejecución del contrato comienza inmediatamente con el
        acceso a la biblioteca digital, y reconoce que{" "}
        <strong>pierde el derecho de desistimiento</strong> en el momento
        en que se le otorga ese acceso. En consecuencia, INNERAXIS S.L.{" "}
        <strong>NO ADMITE DEVOLUCIONES</strong> una vez efectuada la
        compra.
      </p>
      <p>
        Por este motivo, esta página y la página de oferta del Sitio están
        deliberadamente diseñadas con información extensa sobre el
        producto, la autora y los formatos exactos que se reciben. El
        comprador debe revisar toda esa información antes de pulsar el
        botón de compra.
      </p>

      <h2>6. Excepciones — reembolsos voluntarios</h2>
      <p>
        Sin perjuicio de lo establecido en la cláusula anterior, INNERAXIS
        S.L. puede{" "}
        <strong>
          a su exclusiva discreción y de forma estrictamente excepcional
        </strong>{" "}
        reembolsar el importe pagado en supuestos como (i) error técnico
        que impida el acceso al producto durante un plazo razonable, (ii)
        cobro duplicado por incidencia en Stripe, o (iii) facturación
        manifiestamente incorrecta. La solicitud se hará por escrito a{" "}
        <a href="mailto:info@inneraxisinstitute.com">
          info@inneraxisinstitute.com
        </a>{" "}
        explicando los hechos.
      </p>

      <h2>7. Garantía legal del contenido digital</h2>
      <p>
        El producto se entrega "tal cual" y conforme a la descripción
        publicada en el Sitio. En caso de falta de conformidad (por
        ejemplo, archivos corruptos), el comprador tendrá los derechos que
        le correspondan conforme al{" "}
        <strong>RD-Ley 1/2007 sobre contenidos y servicios digitales</strong>
        : el vendedor procederá, en primer lugar, a sanear el contenido
        defectuoso.
      </p>

      <h2>8. Propiedad intelectual y uso permitido</h2>
      <p>
        El producto digital es propiedad de INNERAXIS S.L. y de Lara Lawn
        como autora. El comprador adquiere una{" "}
        <strong>licencia personal, no exclusiva e intransferible</strong>{" "}
        para acceder al contenido para su uso privado. Queda{" "}
        <strong>expresamente prohibido</strong>:
      </p>
      <ul>
        <li>Compartir, distribuir o subir los archivos a sitios públicos.</li>
        <li>Revender, ceder o alquilar el acceso a la biblioteca.</li>
        <li>
          Reproducir, transformar o adaptar la obra sin autorización por
          escrito.
        </li>
      </ul>

      <h2>9. Privacidad</h2>
      <p>
        El tratamiento de datos personales se rige por la{" "}
        <a href="/legal/privacidad">Política de privacidad</a>.
      </p>

      <h2>10. Resolución de disputas</h2>
      <p>
        Para resolver cualquier controversia, el consumidor podrá acudir a
        la plataforma de Resolución de Litigios en Línea de la Unión
        Europea:{" "}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener"
        >
          ec.europa.eu/consumers/odr
        </a>
        .
      </p>

      <h2>11. Legislación aplicable y jurisdicción</h2>
      <p>
        Estas condiciones se rigen por la legislación española. Para la
        resolución de cualquier conflicto, las partes se someten a los
        Juzgados y Tribunales de Toledo, salvo lo dispuesto en favor del
        consumidor por la legislación aplicable.
      </p>
    </LegalLayout>
  );
}

function TermsEN() {
  return (
    <LegalLayout title="Terms and conditions" lastUpdated="May 14, 2026">
      <p>
        These general terms govern the purchase of digital products offered
        by INNERAXIS S.L. through{" "}
        <a href="https://arkwright.laralawn.com">arkwright.laralawn.com</a>{" "}
        (hereinafter <strong>"the Site"</strong>).
      </p>

      <h2>1. Seller</h2>
      <ul>
        <li>
          <strong>Company:</strong> INNERAXIS S.L.
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

      <h2>2. Product</h2>
      <p>The digital product sold on the Site comprises:</p>
      <ul>
        <li>
          <strong>Ebook</strong> "The Arkwright Method" (Lara Lawn), 25
          chapters, PDF and EPUB formats.
        </li>
        <li>
          <strong>Audiobook</strong> "The Arkwright Method", 17 marked
          chapters, 5h 34min, "Despina" voice, Castilian Spanish.
        </li>
        <li>
          <strong>Online workbook</strong> with four guided exercises
          available at{" "}
          <a href="https://arkwright.laralawn.com/workbook">/workbook</a>.
        </li>
        <li>
          <strong>BONUS</strong> (unlocked by submitting an Amazon review
          through{" "}
          <a href="https://arkwright.laralawn.com/resena">/resena</a>):
          ebook and audiobook of Lara Lawn's first book{" "}
          <em>"It's not you, it's your subconscious"</em>.
        </li>
      </ul>

      <h2>3. Price</h2>
      <p>
        The product price is <strong>€12</strong>, taxes included. Payment
        is processed by Stripe as a single charge at the time of purchase.
        There are no subscriptions or automatic renewals.
      </p>

      <h2>4. Purchase process</h2>
      <ol>
        <li>
          The user clicks the purchase button on the Site and is redirected
          to the secure Stripe checkout.
        </li>
        <li>
          The user provides email and payment data to Stripe. Stripe sends
          a receipt to the provided email.
        </li>
        <li>
          Once payment is confirmed, the user is redirected to{" "}
          <code>/biblioteca</code>, where they have immediate access to all
          the digital content purchased. They also receive an email with
          the permanent link to their library.
        </li>
      </ol>

      <h2>5. Express waiver of the right of withdrawal</h2>
      <p>
        Pursuant to{" "}
        <strong>
          Article 103.m) of Spanish Royal Legislative Decree 1/2007 of 16
          November
        </strong>{" "}
        (consolidated Consumer Rights Act), the right of withdrawal{" "}
        <strong>DOES NOT APPLY</strong> to contracts for:
      </p>
      <blockquote
        style={{
          borderLeft: "3px solid var(--accent)",
          paddingLeft: "16px",
          margin: "16px 0",
          fontStyle: "italic",
          color: "var(--ink)",
        }}
      >
        "The supply of digital content not delivered on a tangible medium
        when performance has begun with the consumer's prior express
        consent and acknowledgement that they thereby lose their right of
        withdrawal."
      </blockquote>
      <p>
        By purchasing the product, the buyer <strong>EXPRESSLY ACCEPTS</strong>{" "}
        that performance of the contract begins immediately upon access to
        the digital library, and acknowledges that they{" "}
        <strong>lose the right of withdrawal</strong> the moment that
        access is granted. Consequently, INNERAXIS S.L.{" "}
        <strong>DOES NOT ACCEPT REFUNDS</strong> after purchase.
      </p>
      <p>
        For this reason, this page and the offer page are deliberately
        designed with extensive information about the product, the author
        and the exact formats received. The buyer must review all of that
        information before clicking the purchase button.
      </p>

      <h2>6. Exceptions — voluntary refunds</h2>
      <p>
        Notwithstanding the previous clause, INNERAXIS S.L. may, at its{" "}
        <strong>sole and strictly exceptional discretion</strong>, refund
        the amount paid in cases such as (i) technical error preventing
        access to the product for a reasonable period, (ii) duplicate
        charge due to Stripe issue, or (iii) manifestly incorrect billing.
        The request must be made in writing to{" "}
        <a href="mailto:info@inneraxisinstitute.com">
          info@inneraxisinstitute.com
        </a>{" "}
        explaining the facts.
      </p>

      <h2>7. Legal guarantee of digital content</h2>
      <p>
        The product is delivered "as is" and as described on the Site. In
        case of non-conformity (e.g. corrupt files), the buyer will have
        the rights granted by{" "}
        <strong>RD-Law 1/2007 on digital content and services</strong>: the
        seller will first proceed to remedy the defective content.
      </p>

      <h2>8. Intellectual property and permitted use</h2>
      <p>
        The digital product is owned by INNERAXIS S.L. and Lara Lawn as
        author. The buyer acquires a{" "}
        <strong>personal, non-exclusive and non-transferable license</strong>{" "}
        to access the content for private use. The following are{" "}
        <strong>expressly forbidden</strong>:
      </p>
      <ul>
        <li>Sharing, distributing or uploading the files to public sites.</li>
        <li>Reselling, transferring or renting library access.</li>
        <li>
          Reproducing, transforming or adapting the work without prior
          written authorisation.
        </li>
      </ul>

      <h2>9. Privacy</h2>
      <p>
        Personal data processing is governed by the{" "}
        <a href="/legal/privacidad">Privacy policy</a>.
      </p>

      <h2>10. Dispute resolution</h2>
      <p>
        To resolve any dispute, consumers may access the EU Online Dispute
        Resolution platform:{" "}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener"
        >
          ec.europa.eu/consumers/odr
        </a>
        .
      </p>

      <h2>11. Governing law and jurisdiction</h2>
      <p>
        These terms are governed by Spanish law. For any conflict, the
        parties submit to the Courts and Tribunals of Toledo, except as
        otherwise required by applicable law for consumer protection.
      </p>
    </LegalLayout>
  );
}
