/**
 * Schema.org JSON-LD blobs para que Google muestre rich snippets
 * (estrellas, precio, autor, organización) en los resultados.
 *
 * Inyectado en `layout.tsx` para que aparezca en TODAS las páginas
 * (Organization + WebSite). Los schemas específicos de Book y
 * Product se renderizan solo en `/` y `/oferta` para no diluir.
 */

const BASE =
  (process.env["NEXT_PUBLIC_SITE_URL"] ?? "").replace(/\/$/, "") ||
  "https://arkwright.laralawn.com";

function jsonLd(payload: unknown) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * Schemas globales (Organization + WebSite). Para layout.tsx.
 */
export function JsonLdGlobal() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: "INNERAXIS S.L.",
    url: BASE,
    logo: `${BASE}/lara-lawn-logo.png`,
    email: "info@inneraxisinstitute.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle Ruiseñor 22",
      addressLocality: "Olías del Rey",
      addressRegion: "Toledo",
      postalCode: "45280",
      addressCountry: "ES",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: BASE,
    name: "El método Arkwright — Lara Lawn",
    inLanguage: ["es-ES", "en-US"],
    publisher: { "@id": `${BASE}/#organization` },
  };

  return (
    <>
      {jsonLd(organization)}
      {jsonLd(website)}
    </>
  );
}

/**
 * Schemas de Book + Product + Person, específicos de la landing.
 * Renderizar en `/` y `/oferta`.
 */
export function JsonLdLanding() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE}/#author`,
    name: "Lara Lawn",
    jobTitle: "Identity Architect",
    url: "https://laralawn.com",
    image: `${BASE}/lara-portrait.png`,
    sameAs: ["https://laralawn.com"],
  };

  const book = {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${BASE}/#book`,
    name: "El método Arkwright",
    alternateName: "The Arkwright Method",
    author: { "@id": `${BASE}/#author` },
    inLanguage: "es-ES",
    bookFormat: "https://schema.org/EBook",
    numberOfPages: 250,
    publisher: { "@id": `${BASE}/#organization` },
    image: `${BASE}/og-image.jpg`,
    description:
      "Manual operativo para mujeres que ya hicieron terapia, ya leyeron a Brené Brown y siguen ganando lo mismo. Ebook + audiolibro + workbook online.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "10000",
    },
  };

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BASE}/#product`,
    name: "El método Arkwright · Pack completo (ebook + audiolibro + workbook)",
    description:
      "Ebook (25 capítulos PDF + EPUB) + audiolibro (5h 34min) + workbook online (4 dinámicas). Acceso inmediato vía Stripe Checkout.",
    image: `${BASE}/og-image.jpg`,
    brand: { "@id": `${BASE}/#organization` },
    offers: {
      "@type": "Offer",
      url: `${BASE}/oferta`,
      priceCurrency: "EUR",
      price: "12.00",
      availability: "https://schema.org/InStock",
      seller: { "@id": `${BASE}/#organization` },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "10000",
    },
  };

  return (
    <>
      {jsonLd(person)}
      {jsonLd(book)}
      {jsonLd(product)}
    </>
  );
}
