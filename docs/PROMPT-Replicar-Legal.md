# PROMPT · Replicar el ámbito legal completo en otra landing

> Copia TODO lo que hay debajo de la línea `=== INICIO DEL PROMPT ===`
> y pégalo en Claude Code (o equivalente) dentro del proyecto destino.
> Antes de pegar, sustituye el bloque `DATOS DEL TITULAR` con los datos
> reales de esa landing. Lo demás funciona tal cual.

---

`=== INICIO DEL PROMPT ===`

Eres un ingeniero full-stack. Vas a añadir el **ámbito legal completo**
(4 páginas legales + banner de cookies GDPR) a esta landing de
infoproducto digital. No inventes funcionalidades fuera de esto. Cuando
termines, haz commit y push.

## Contexto de stack (asúmelo; si algo no encaja, pregúntame antes de improvisar)

- Next.js 14 App Router + TypeScript.
- i18n propio mediante un hook `useLang()` que expone `{ lang, t, setLang }`,
  con `lang` ∈ `"es" | "en"`. Si este proyecto NO tiene `useLang`, dime
  cómo gestiona idiomas y adapta los componentes a ese mecanismo (no
  instales librerías de i18n).
- CSS global en `src/app/globals.css` con custom properties tipo
  `--ink`, `--paper`, `--paper-warm`, `--accent`, `--muted`,
  `--rule-soft`, `--serif`, `--sans`, `--mono`, `--ease`. Si no existen,
  créalas con valores razonables o mapéalas a las del proyecto. NO uses
  Tailwind para estas páginas: clases CSS planas.
- Hay un `src/components/Footer.tsx` y un `src/app/layout.tsx`.

## DATOS DEL TITULAR  ← SUSTITUYE ESTO ANTES DE EJECUTAR

```
RAZON_SOCIAL      = INNERAXIS S.L.
FORMA_JURIDICA    = Sociedad Limitada
CIF               = B22620348
DOMICILIO         = Calle Ruiseñor 22, 45280 Olías del Rey (Toledo), España
EMAIL_LEGAL       = info@inneraxisinstitute.com
DOMINIO           = https://arkwright.laralawn.com
JURISDICCION      = Juzgados y Tribunales de Toledo
REGISTRO_MERCANTIL= Registro Mercantil de Toledo (tomo/folio/hoja pendientes
                    — deja placeholder explícito si no se han facilitado)
PRODUCTO          = "El método Arkwright" de Lara Lawn (ebook + audiolibro
                    + workbook online). Precio 12 €, pago único Stripe.
POLITICA_REFUND   = SIN garantía de devolución. Waiver explícito del
                    derecho de desistimiento (Art. 103.m RDL 1/2007).
FECHA_ACTUALIZACION = 14 de mayo de 2026  /  May 14, 2026
PROCESADORES      = Stripe (pagos, US), Resend (emails, US),
                    Railway (hosting+BD, US), GitHub (descargas, US)
```

> Si POLITICA_REFUND fuese CON garantía, dímelo: cambia la cláusula 5 de
> términos (no se renuncia al desistimiento) y la FAQ de devoluciones.

## Normativa que estas páginas deben cumplir (no la cites de más, pero respétala)

- **Ley 34/2002 (LSSI-CE)** — Art. 10 (datos identificativos del
  prestador) y Art. 22.2 (cookies con consentimiento).
- **RGPD (Reglamento UE 2016/679)** + **LOPDGDD (Ley Orgánica 3/2018)** —
  responsable, base jurídica, finalidades, conservación, encargados,
  derechos del interesado, reclamación ante la AEPD.
- **RD-Ley 1/2007 (Consumidores y Usuarios)** — Art. 103.m): renuncia al
  derecho de desistimiento en contenido digital con ejecución inmediata
  y consentimiento previo del consumidor.
- **Ley 7/1998** — condiciones generales de la contratación.

## Archivos a crear (6)

```
src/app/legal/aviso-legal/page.tsx
src/app/legal/privacidad/page.tsx
src/app/legal/terminos/page.tsx
src/app/legal/cookies/page.tsx
src/components/LegalLayout.tsx
src/components/CookieBanner.tsx
```

## Archivos a modificar (3)

```
src/components/Footer.tsx     → fila .footer-legal con 4 links + copyright
src/app/layout.tsx            → montar <CookieBanner /> al final del provider
src/app/globals.css           → bloques .legal-*, .cookie-banner-*, .footer-legal
```

---

### 1. `src/components/LegalLayout.tsx`

Wrapper compartido de las 4 páginas. Client component.

```tsx
"use client";

import type { ReactNode } from "react";
import { useLang } from "./LangProvider";

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  const { lang } = useLang();
  return (
    <main className="legal-shell">
      <article className="legal-article">
        <header className="legal-header">
          <p className="legal-eyebrow">Legal</p>
          <h1 className="legal-h1">{title}</h1>
          <p className="legal-meta">
            {lang === "es" ? "Última actualización: " : "Last updated: "}
            {lastUpdated}
          </p>
        </header>
        <div className="legal-content">{children}</div>
        <footer className="legal-foot">
          <a href="/" className="legal-back">
            {lang === "es" ? "← Volver al inicio" : "← Back to home"}
          </a>
        </footer>
      </article>
    </main>
  );
}
```

### 2. `src/components/CookieBanner.tsx`

Banner GDPR self-contained, SIN librería. Reglas obligatorias:

- `localStorage.cookieConsent` versionado (`CONSENT_VERSION`) y con
  caducidad 6 meses (guía AEPD). Si cambia la versión, reaparece.
- Categorías: `necessary` (siempre true), `analytics`, `marketing`.
- Dos botones: "Aceptar todo" / "Solo necesarias".
- Oculto en rutas `/admin/*` y `/legal/*`.
- Expone `window.__cookieConsent` (objeto consent) para que cualquier
  tracking posterior lea `analytics` antes de disparar.
- Copy bilingüe ES/EN según `useLang()`.

```tsx
"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";

const STORAGE_KEY = "cookieConsent";
const CONSENT_VERSION = 1;
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

type Consent = {
  version: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (Date.now() - parsed.timestamp > SIX_MONTHS_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(c: Consent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    (window as unknown as { __cookieConsent?: Consent }).__cookieConsent = c;
  } catch {}
}

export function CookieBanner() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const path = window.location.pathname;
    if (path.startsWith("/admin")) return;
    if (path.startsWith("/legal")) return;
    const existing = readConsent();
    if (existing) {
      (window as unknown as { __cookieConsent?: Consent }).__cookieConsent =
        existing;
      return;
    }
    const t = setTimeout(() => setVisible(true), 350);
    return () => clearTimeout(t);
  }, []);

  if (!mounted || !visible) return null;

  const accept = () => {
    writeConsent({
      version: CONSENT_VERSION,
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
    setVisible(false);
  };
  const rejectNonEssential = () => {
    writeConsent({
      version: CONSENT_VERSION,
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
    setVisible(false);
  };

  const copy = lang === "es" ? COPY_ES : COPY_EN;

  return (
    <div className="cookie-banner" role="dialog" aria-label={copy.aria}>
      <p className="cookie-banner-text">
        {copy.body} <a href="/legal/cookies">{copy.link}</a>.
      </p>
      <div className="cookie-banner-actions">
        <button
          type="button"
          className="cookie-btn cookie-btn--reject"
          onClick={rejectNonEssential}
        >
          {copy.reject}
        </button>
        <button
          type="button"
          className="cookie-btn cookie-btn--accept"
          onClick={accept}
        >
          {copy.accept}
        </button>
      </div>
    </div>
  );
}

const COPY_ES = {
  aria: "Aviso de cookies",
  body: "Usamos cookies necesarias para que el pago y el contenido funcionen. Las analíticas/marketing solo se activan si las aceptas. Más info en la",
  link: "política de cookies",
  reject: "Solo necesarias",
  accept: "Aceptar todo",
} as const;

const COPY_EN = {
  aria: "Cookie notice",
  body: "We use necessary cookies to make checkout and content work. Analytics/marketing only run if you accept them. More info in our",
  link: "cookie policy",
  reject: "Only necessary",
  accept: "Accept all",
} as const;
```

### 3. `src/app/legal/aviso-legal/page.tsx`  (LSSI-CE)

Client component. Primera línea EXACTA:
`/* eslint-disable react/no-unescaped-entities */` (las páginas legales
tienen muchas comillas y apóstrofos literales y rompen el build sin esto).

Estructura: `export default` que hace `if (lang === "en") return <EN/>`
si no `<ES/>`. Ambas usan `<LegalLayout title=... lastUpdated=...>`.

Secciones ES (replica con los DATOS DEL TITULAR):
1. **Datos identificativos del titular** — denominación social, CIF,
   domicilio, email, datos registrales (placeholder si faltan).
2. **Objeto** — el Sitio comercializa PRODUCTO + divulgación de contenidos.
3. **Condiciones de uso** — acceso gratuito salvo conexión; usar el Sitio
   implica aceptar términos + privacidad + cookies (links internos).
4. **Propiedad intelectual** — todo el contenido es del titular/autor,
   prohibida reproducción/distribución sin autorización escrita.
5. **Responsabilidad** — no responde de uso indebido; info divulgativa,
   no asesoramiento financiero/fiscal/psicológico.
6. **Enlaces externos** — no responde de terceros (Stripe, Amazon, RRSS).
7. **Legislación aplicable y jurisdicción** — ley española, sumisión a
   JURISDICCION salvo fuero del consumidor.

EN: misma estructura, traducida ("Legal notice").

### 4. `src/app/legal/privacidad/page.tsx`  (RGPD + LOPDGDD)

Mismo patrón (eslint-disable, ES/EN, LegalLayout). Secciones:
1. **Responsable del tratamiento** — titular, CIF, domicilio, contacto.
2. **Qué datos recogemos y para qué** — tabla `<table>` con columnas
   Finalidad / Datos / Base jurídica / Conservación. Filas mínimas:
   - Procesar la compra digital · email, nombre, datos de pago (Stripe) ·
     Ejecución del contrato (Art. 6.1.b) · 10 años (obligaciones fiscales).
   - Entregar acceso al producto · email, token, contador · contrato ·
     mientras el acceso esté activo + 5 años.
   - Email transaccional · email, nombre · contrato · 3 años desde último
     contacto.
   - (Si hay workbook/área de cuenta) progreso · email, respuestas ·
     contrato · mientras la cuenta esté activa.
   - (Si hay funnel de reseña) captura, hash IP, email · consentimiento
     (Art. 6.1.a) · 3 años o hasta retirada.
   - Contacto vía formulario · email, nombre, mensaje · consentimiento ·
     1 año o hasta resolución.
   Ajusta filas a lo que realmente recoja ESTA landing.
3. **Encargados del tratamiento** — lista PROCESADORES, cada uno con país
   (US) y "acogido a las cláusulas contractuales tipo de la Comisión
   Europea".
4. **Tus derechos** — acceso, rectificación, supresión, limitación,
   portabilidad, oposición, retirar consentimiento. Ejercicio vía
   EMAIL_LEGAL. Reclamación ante la **AEPD** (www.aepd.es).
5. **Seguridad** — HTTPS, BD cifrada en reposo, acceso restringido,
   backups.
6. **Menores** — no dirigido a menores de 18.
7. **Modificaciones** — versión vigente la publicada con su fecha.

EN: traducida ("Privacy policy").

### 5. `src/app/legal/terminos/page.tsx`  (RDL 1/2007 + Ley 7/1998)

Mismo patrón. **Punto crítico = sección 5 (waiver de desistimiento).**
Secciones:
1. **Vendedor** — razón social, CIF, domicilio, contacto.
2. **Producto** — descripción exacta de lo que recibe el comprador
   (formatos, capítulos, duración, bonus si hay). Sé literal: esto es lo
   que blinda el "no devoluciones".
3. **Precio** — importe, impuestos incluidos, pago único Stripe, sin
   suscripción.
4. **Proceso de compra** — `<ol>`: botón → Stripe (email + pago + recibo)
   → redirección a área de acceso inmediato + email con enlace permanente.
5. **Renuncia expresa al derecho de desistimiento** — cita Art. 103.m)
   RDL 1/2007. Incluye un `<blockquote>` con el texto legal:
   *"El suministro de contenido digital que no se preste en un soporte
   material cuando la ejecución haya comenzado con el previo
   consentimiento expreso del consumidor y usuario, con el conocimiento
   por su parte de que en consecuencia pierde su derecho de
   desistimiento."*
   Luego: el comprador ACEPTA EXPRESAMENTE que la ejecución comienza con
   el acceso inmediato y que pierde el desistimiento → el titular NO
   ADMITE DEVOLUCIONES. Justifica que por eso la oferta tiene info
   extensa que debe revisar antes de comprar.
   Estilo del blockquote: `borderLeft: "3px solid var(--accent)"`,
   `paddingLeft: "16px"`, `fontStyle: "italic"`, `color: "var(--ink)"`.
6. **Excepciones — reembolsos voluntarios** — discrecional y excepcional:
   (i) error técnico que impida acceso, (ii) cobro duplicado Stripe,
   (iii) facturación manifiestamente incorrecta. Solicitud por escrito a
   EMAIL_LEGAL.
7. **Garantía legal del contenido digital** — "tal cual", conforme a la
   descripción; ante falta de conformidad (archivos corruptos) el
   vendedor sanea primero (RD-Ley 1/2007 contenidos digitales).
8. **Propiedad intelectual y uso permitido** — licencia personal, no
   exclusiva, intransferible. Prohibido: compartir/subir a sitios
   públicos, revender/ceder/alquilar, reproducir/transformar sin permiso.
9. **Privacidad** — remite a `/legal/privacidad`.
10. **Resolución de disputas** — plataforma ODR UE
    (ec.europa.eu/consumers/odr).
11. **Legislación aplicable y jurisdicción** — ley española, JURISDICCION,
    salvo fuero del consumidor.

EN: traducida ("Terms and conditions"). Si POLITICA_REFUND = CON
garantía: reescribe la 5 (no se renuncia; hay X días) y la 6.

### 6. `src/app/legal/cookies/page.tsx`  (Art. 22.2 LSSI-CE)

Mismo patrón. Incluye una función `reopenBanner()` que hace
`localStorage.removeItem("cookieConsent"); window.location.reload();`
dentro de try/catch (modo privado). Secciones:
1. **¿Qué son las cookies?**
2. **Qué cookies usamos**
   - Subtabla **Necesarias (no requieren consentimiento)**: columnas
     Cookie / Proveedor / Finalidad / Duración. Filas reales de ESTA
     landing (típicas: `__stripe_*` Stripe 30min–1año; cookie de sesión
     propia; cookie de idioma 1 año; `cookieConsent` propio 6 meses).
   - **Analytics (requieren consentimiento)**: declara si hoy se usan o
     no. Si el tracking interno está activo, descríbelo; si es
     placeholder, dilo.
   - **Marketing**: declara que no se usan cookies publicitarias de
     terceros (o las que correspondan).
3. **Cómo gestionar tus preferencias** — explica el banner + un
   `<button onClick={reopenBanner}>` "Configurar cookies" con estilo
   inline (accent, blanco, radio 8px). Menciona que bloquear las
   necesarias rompe el pago.
4. **Información sobre cookies de Stripe** — enlace a
   stripe.com/cookies-policy/legal con `target="_blank" rel="noopener"`.
5. **Cambios**.

EN: traducida ("Cookie policy").

### 7. Modificar `src/components/Footer.tsx`

Añade dentro del footer una fila legal y el copyright con la razón
social. Respeta el mecanismo i18n existente:

```tsx
<div className="footer-legal">
  <a href="/legal/privacidad">{isES ? "Privacidad" : "Privacy"}</a>
  <a href="/legal/terminos">{isES ? "Términos" : "Terms"}</a>
  <a href="/legal/cookies">{isES ? "Cookies" : "Cookies"}</a>
  <a href="/legal/aviso-legal">{isES ? "Aviso legal" : "Legal notice"}</a>
</div>
<div className="footer-copy">
  © 2026 {RAZON_SOCIAL} · {/* derechos reservados, vía i18n */}
</div>
```

Añade también un link a `/contacto` en la fila de links si existe esa
página.

### 8. Modificar `src/app/layout.tsx`

Importa y monta el banner como ÚLTIMO hijo dentro del provider de idioma
(después de `{children}` y `<Footer />`):

```tsx
import { CookieBanner } from "@/components/CookieBanner";
// ...
<LangProvider>
  <Nav />
  {children}
  <Footer />
  <CookieBanner />
</LangProvider>
```

### 9. Añadir a `src/app/globals.css`

Pega este bloque al final (ajusta nombres de vars si el proyecto usa
otros). Es el estilo editorial exacto de la referencia:

```css
/* ===== LEGAL PAGES ===== */
.legal-shell { padding: 96px 24px 80px; background: var(--paper); min-height: 100vh; }
.legal-article { max-width: 740px; margin: 0 auto; }
.legal-header { margin-bottom: 48px; border-bottom: 1px solid var(--rule-soft); padding-bottom: 32px; }
.legal-eyebrow { font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: .18em; text-transform: uppercase; color: var(--accent); margin: 0 0 14px; }
.legal-h1 { font-family: var(--serif); font-weight: 600; font-size: clamp(32px,4.5vw,44px); line-height: 1.15; letter-spacing: -.01em; color: var(--ink); margin: 0 0 16px; }
.legal-meta { font-family: var(--mono); font-size: 12px; color: var(--muted); margin: 0; letter-spacing: .04em; }
.legal-content { font-family: var(--sans); font-size: 16px; line-height: 1.65; color: var(--ink-soft); }
.legal-content h2 { font-family: var(--serif); font-weight: 600; font-size: 24px; color: var(--ink); margin: 40px 0 12px; letter-spacing: -.005em; }
.legal-content h3 { font-family: var(--sans); font-weight: 600; font-size: 17px; color: var(--ink); margin: 28px 0 10px; }
.legal-content p { margin: 0 0 14px; }
.legal-content ul, .legal-content ol { margin: 0 0 16px; padding-left: 22px; }
.legal-content li { margin-bottom: 6px; }
.legal-content strong { color: var(--ink); font-weight: 600; }
.legal-content a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
.legal-content a:hover { color: var(--ink); }
.legal-content code { font-family: var(--mono); font-size: 13px; background: var(--paper-warm); padding: 2px 6px; border-radius: 4px; }
.legal-content table { width: 100%; border-collapse: collapse; margin: 16px 0 24px; font-size: 14px; }
.legal-content th, .legal-content td { padding: 10px 14px; border: 1px solid var(--rule-soft); text-align: left; vertical-align: top; }
.legal-content th { background: var(--paper-warm); font-weight: 600; color: var(--ink); }
.legal-foot { margin-top: 56px; padding-top: 24px; border-top: 1px solid var(--rule-soft); }
.legal-back { font-family: var(--mono); font-size: 13px; color: var(--accent); text-decoration: none; letter-spacing: .04em; }
.legal-back:hover { color: var(--ink); }

/* ===== COOKIE BANNER ===== */
.cookie-banner { position: fixed; bottom: 16px; left: 16px; right: 16px; max-width: 520px; margin: 0 auto; background: var(--ink); color: var(--paper); border-radius: 14px; padding: 20px 22px; box-shadow: 0 16px 48px rgba(10,18,48,.32); z-index: 200; animation: cookieRise .45s var(--ease) both; }
@keyframes cookieRise { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
.cookie-banner-text { font-family: var(--sans); font-size: 13.5px; line-height: 1.55; margin: 0 0 14px; color: rgba(250,249,247,.92); }
.cookie-banner-text a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
.cookie-banner-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.cookie-btn { flex: 1; min-width: 140px; padding: 11px 16px; border-radius: 8px; font-family: var(--sans); font-size: 13.5px; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: all 180ms var(--ease); }
.cookie-btn--accept { background: var(--accent); color: white; }
.cookie-btn--accept:hover { filter: brightness(.92); }
.cookie-btn--reject { background: transparent; color: var(--paper); border-color: rgba(250,249,247,.35); }
.cookie-btn--reject:hover { border-color: var(--paper); }
@media (max-width: 600px) { .cookie-banner { padding: 16px 18px; } .cookie-banner-actions { flex-direction: column; } .cookie-btn { width: 100%; } }

/* ===== FOOTER LEGAL ROW ===== */
.footer-legal { display: flex; gap: 18px; flex-wrap: wrap; }
.footer-legal a { font-family: var(--mono); font-size: 10px; letter-spacing: .18em; text-transform: uppercase; opacity: .45; transition: opacity .2s; color: var(--paper); text-decoration: none; }
.footer-legal a:hover { opacity: .9; }
@media (max-width: 700px) { .footer-legal { gap: 14px; } }
```

## Reglas de implementación

- TODAS las páginas legales son `"use client"` con
  `/* eslint-disable react/no-unescaped-entities */` en la PRIMERA línea.
- Patrón de cada página: `export default function XPage(){ const {lang}=
  useLang(); if(lang==="en") return <XEN/>; return <XES/>; }`.
- Texto bilingüe completo: NO dejes secciones solo en español.
- NO uses servicios externos, NO instales dependencias, NO añadas
  consent management de terceros (Cookiebot, OneTrust, etc.).
- NO toques nada fuera de los 9 archivos listados.
- Tras escribir todo: `npx tsc --noEmit` y `npx next lint`. Corrige
  cualquier error (los warnings de `<img>` preexistentes se ignoran).
- Si i18n NO es `useLang`, adapta los componentes a lo que haya
  (pregúntame si no está claro) — el resto es idéntico.

## Verificación antes de commitear

1. `/legal/aviso-legal`, `/legal/privacidad`, `/legal/terminos`,
   `/legal/cookies` cargan en ES y en EN (toggle de idioma).
2. Footer muestra los 4 links + el copyright con la razón social.
3. Primera visita: el banner aparece a los ~350 ms. Pulsar "Solo
   necesarias" → `localStorage.cookieConsent.analytics === false`. Pulsar
   "Aceptar todo" → `analytics === true`. Refrescar → no reaparece.
4. El banner NO aparece en `/legal/*` ni `/admin/*`.
5. `window.__cookieConsent` está poblado tras elegir.
6. En `/legal/cookies`, el botón "Configurar cookies" borra el consent y
   recarga (el banner vuelve a salir).
7. `npx tsc --noEmit` limpio.

## Cierre

Haz un commit:

```
feat(legal): páginas legales (LSSI-CE/RGPD/RDL 1/2007) + cookie banner
```

y push a la rama por defecto.

`=== FIN DEL PROMPT ===`

---

## Notas para ti (no van en el prompt)

- El waiver del Art. 103.m solo es válido si: (a) está ANTES de la
  pasarela de pago de forma visible, (b) la FAQ de la oferta responde
  honestamente que no hay devoluciones, (c) la descripción del producto
  es exhaustiva. Si la nueva landing oculta esto, el waiver decae.
- Si esa landing usa otra pasarela (no Stripe), cambia "Stripe" por la
  que sea en privacidad §3 y términos §4, y la cookie `__stripe_*` en la
  tabla de cookies.
- Datos del Registro Mercantil: si aún no hay nota simple, deja el texto
  "Inscrita en el Registro Mercantil de [provincia]. Datos de tomo,
  folio y hoja pendientes de inscripción definitiva" — es válido como
  provisional.
- Revisa los textos legales con un abogado antes de producción si el
  volumen de ventas es alto. Este prompt da una base sólida y conforme,
  no sustituye asesoría jurídica.
