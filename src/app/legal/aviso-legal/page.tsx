"use client";

import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { useLang } from "@/components/LangProvider";

/**
 * Aviso legal — LSSI-CE.
 *
 * Cumple con la Ley 34/2002 de Servicios de la Sociedad de la
 * Información y Comercio Electrónico (España). Información obligatoria:
 * razón social, NIF/CIF, domicilio, contacto, datos del Registro
 * Mercantil.
 *
 * Datos del Registro Mercantil (tomo, folio, hoja) pendientes —
 * rellenar cuando se obtengan vía nota simple del Registro Mercantil
 * de Toledo.
 */
export default function AvisoLegalPage() {
  const { lang } = useLang();
  if (lang === "en") return <AvisoLegalEN />;
  return <AvisoLegalES />;
}

function AvisoLegalES() {
  return (
    <LegalLayout title="Aviso legal" lastUpdated="14 de mayo de 2026">
      <p>
        En cumplimiento de lo establecido por la <strong>Ley 34/2002</strong>,
        de 11 de julio, de Servicios de la Sociedad de la Información y de
        Comercio Electrónico (LSSI-CE), se informa de los siguientes datos
        sobre el titular de este sitio web.
      </p>

      <h2>1. Datos identificativos del titular</h2>
      <ul>
        <li>
          <strong>Denominación social:</strong> INNERAXIS S.L.
        </li>
        <li>
          <strong>CIF:</strong> B22620348
        </li>
        <li>
          <strong>Domicilio social:</strong> Calle Ruiseñor 22, 45280 Olías del
          Rey (Toledo), España
        </li>
        <li>
          <strong>Email de contacto:</strong>{" "}
          <a href="mailto:info@inneraxisinstitute.com">
            info@inneraxisinstitute.com
          </a>
        </li>
        <li>
          <strong>Datos registrales:</strong> Inscrita en el Registro Mercantil
          de Toledo. (Datos de tomo, folio y hoja pendientes de inscripción
          definitiva — se publicarán en cuanto sean firmes.)
        </li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        El presente sitio web, accesible en{" "}
        <a href="https://arkwright.laralawn.com">arkwright.laralawn.com</a>{" "}
        (en adelante, <strong>"el Sitio"</strong>) tiene por objeto la
        comercialización del producto digital{" "}
        <em>"El método Arkwright"</em> de Lara Lawn (ebook + audiolibro +
        workbook online), así como la divulgación de contenidos sobre
        identidad, decisiones económicas y desarrollo personal.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso al Sitio es gratuito salvo en lo relativo al coste de la
        conexión a Internet del usuario. La utilización del Sitio implica la
        aceptación expresa y plena de las{" "}
        <a href="/legal/terminos">condiciones generales de contratación</a>,
        la <a href="/legal/privacidad">política de privacidad</a> y la{" "}
        <a href="/legal/cookies">política de cookies</a>.
      </p>

      <h2>4. Propiedad intelectual</h2>
      <p>
        Todos los contenidos del Sitio (textos, imágenes, audio, vídeo,
        diseño, código fuente, marcas, logotipos y la obra{" "}
        <em>"El método Arkwright"</em>) son titularidad de INNERAXIS S.L. o
        de Lara Lawn como autora, y se encuentran protegidos por la
        legislación española e internacional sobre propiedad intelectual.
      </p>
      <p>
        Queda expresamente prohibida la reproducción, distribución,
        comunicación pública, transformación o cualquier otra forma de
        explotación de los contenidos sin autorización previa por escrito
        del titular.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        INNERAXIS S.L. no se hace responsable de los daños o perjuicios que
        pudieran derivarse del uso indebido del Sitio o de los contenidos.
        La información publicada tiene carácter divulgativo y no constituye
        asesoramiento financiero, fiscal ni psicológico profesional.
      </p>

      <h2>6. Enlaces externos</h2>
      <p>
        El Sitio puede contener enlaces a páginas de terceros (Amazon,
        Stripe, redes sociales). INNERAXIS S.L. no se responsabiliza de los
        contenidos, productos o servicios accesibles a través de dichos
        enlaces.
      </p>

      <h2>7. Legislación aplicable y jurisdicción</h2>
      <p>
        El presente Aviso Legal se rige por la legislación española. Para la
        resolución de cualquier controversia, las partes se someten,
        renunciando a cualquier otro fuero que pudiera corresponderles, a
        los Juzgados y Tribunales de Toledo, salvo que la legislación
        aplicable disponga otra cosa para consumidores y usuarios.
      </p>
    </LegalLayout>
  );
}

function AvisoLegalEN() {
  return (
    <LegalLayout title="Legal notice" lastUpdated="May 14, 2026">
      <p>
        In compliance with <strong>Spanish Law 34/2002</strong> of 11 July
        on Information Society Services and Electronic Commerce (LSSI-CE),
        the following information is provided about the owner of this
        website.
      </p>

      <h2>1. Owner's identification</h2>
      <ul>
        <li>
          <strong>Company name:</strong> INNERAXIS S.L.
        </li>
        <li>
          <strong>Tax ID (CIF):</strong> B22620348
        </li>
        <li>
          <strong>Registered office:</strong> Calle Ruiseñor 22, 45280 Olías
          del Rey (Toledo), Spain
        </li>
        <li>
          <strong>Contact email:</strong>{" "}
          <a href="mailto:info@inneraxisinstitute.com">
            info@inneraxisinstitute.com
          </a>
        </li>
        <li>
          <strong>Registry data:</strong> Registered at the Companies
          Registry of Toledo. (Volume, folio and page details pending
          confirmation — they will be published once finalized.)
        </li>
      </ul>

      <h2>2. Purpose</h2>
      <p>
        This website, available at{" "}
        <a href="https://arkwright.laralawn.com">arkwright.laralawn.com</a>{" "}
        (hereinafter <strong>"the Site"</strong>), is used to commercialise
        the digital product <em>"The Arkwright Method"</em> by Lara Lawn
        (ebook + audiobook + online workbook), and to publish content on
        identity, financial decisions and personal development.
      </p>

      <h2>3. Terms of use</h2>
      <p>
        Access to the Site is free except for the user's own Internet
        connection costs. Using the Site implies full acceptance of the{" "}
        <a href="/legal/terminos">general terms of sale</a>, the{" "}
        <a href="/legal/privacidad">privacy policy</a> and the{" "}
        <a href="/legal/cookies">cookie policy</a>.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        All Site content (text, images, audio, video, design, source code,
        trademarks, logos, and the work <em>"The Arkwright Method"</em>) is
        owned by INNERAXIS S.L. or by Lara Lawn as author, and is protected
        by Spanish and international intellectual property law.
      </p>
      <p>
        Reproduction, distribution, public communication, transformation or
        any other form of exploitation without prior written authorisation
        of the owner is expressly forbidden.
      </p>

      <h2>5. Liability</h2>
      <p>
        INNERAXIS S.L. is not responsible for damages arising from improper
        use of the Site or its content. Published information is
        informative and does not constitute professional financial, tax or
        psychological advice.
      </p>

      <h2>6. External links</h2>
      <p>
        The Site may contain links to third-party sites (Amazon, Stripe,
        social networks). INNERAXIS S.L. is not responsible for the
        content, products or services available through those links.
      </p>

      <h2>7. Governing law and jurisdiction</h2>
      <p>
        This Legal Notice is governed by Spanish law. For any dispute, the
        parties submit, waiving any other jurisdiction that may correspond
        to them, to the Courts and Tribunals of Toledo, unless applicable
        law provides otherwise for consumers and users.
      </p>
    </LegalLayout>
  );
}
