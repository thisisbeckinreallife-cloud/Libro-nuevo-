# The Arkwright Method — Landing Page

Landing de pre-reserva para el libro **"The Arkwright Method"** de Lara Lawn (primavera 2026). Next.js 14 App Router, TypeScript, Tailwind, ES/EN i18n.

Diseño original: ver [`docs/design-handoff/`](docs/design-handoff/).

---

## Arrancar en local

```bash
npm install
npm run dev
```

→ http://localhost:3000

## Build de producción

```bash
npm run build
npm start
```

## Variables de entorno

Copia [`.env.example`](.env.example) a `.env.local`. Ninguna variable es obligatoria para el build actual — son placeholders para las integraciones futuras (GA4, ConvertKit, Stripe) que el desarrollador ha de cablear antes del lanzamiento.

---

## Deploy en Railway

1. Crea un nuevo proyecto en [Railway](https://railway.app/) y conecta este repo de GitHub.
2. Railway detecta Next.js automáticamente. Usa el build por defecto:
   - **Build command:** `npm run build`
   - **Start command:** `npm start`
3. Configura las variables de entorno del paso anterior (si las usas) en la pestaña **Variables** del servicio.
4. Railway genera un dominio `*.up.railway.app`. Para dominio propio, ve a **Settings → Networking → Custom Domain** y añade un CNAME.

---

## Estructura

```
src/
  app/
    layout.tsx        # root layout, fuentes, pre-hydration lang script
    page.tsx          # compone las 15 secciones
    globals.css       # tokens de diseño + estilos por sección
  components/         # un componente por sección
  i18n/
    dictionaries.ts   # single source of truth ES/EN
docs/
  design-handoff/     # spec original (README + HTML de referencia)
```

## Idiomas

ES / EN con toggle en la nav. El idioma se persiste en `localStorage` (`laraLang`) y se aplica a `<html lang>` antes de la hidratación para evitar flashes en el atributo.

Nota conocida: el contenido de texto se rehidrata en ES primero y salta a EN para usuarios que habían seleccionado EN anteriormente. Solución completa requeriría SSR basado en cookie — fuera de scope de la entrega inicial.

## Decisiones técnicas

- **Sin Framer Motion.** Animaciones con keyframes CSS + IntersectionObserver. La entrega inicial no requería motion lib.
- **Libro 3D en CSS puro.** Seis caras + drag + idle oscillation. Sustituir por render real cuando la portada esté lista (ver `docs/design-handoff/README.md`).
- **Tailwind tokens mapeados a CSS vars.** Los estilos complejos viven en `globals.css`; Tailwind se usa solo como infra de build.

## Handoff original

Ver [`docs/design-handoff/README.md`](docs/design-handoff/README.md) para la especificación completa del diseño (tokens, tipografía, animaciones, secciones) y [`docs/design-handoff/The Arkwright Method.html`](docs/design-handoff/The%20Arkwright%20Method.html) para el prototipo HTML de referencia.

---

## Oferta digital · Stripe checkout (12€ ebook + audiolibro)

El sitio está preparado para vender un pack digital (ebook + audiolibro de
The Arkwright Method) por 12€ vía Stripe Checkout. **Toda la
infraestructura está construida pero desactivada hasta que las env vars
de Stripe estén puestas en Railway.** Mientras tanto:

- El CTA de la landing muestra "Próximamente disponible".
- `/api/checkout` devuelve 503 con `error: "checkout_not_configured"`.
- `/api/stripe/webhook` devuelve 503 si llega un evento.
- `/biblioteca` funciona (puedes generar URLs manuales con un script).

### Activación · 4 pasos

1. **Crear producto + precio en Stripe Dashboard**
   - Producto: "The Arkwright Method · ebook + audiolibro"
   - Precio: 12.00 EUR, one-time
   - Copiar el `priceId` (`price_…`).

2. **Configurar webhook endpoint en Stripe Dashboard**
   - URL: `https://arkwright.laralawn.com/api/stripe/webhook`
   - Eventos a escuchar: `checkout.session.completed`, `charge.refunded`
   - Copiar el `signing secret` (`whsec_…`).

3. **Setear env vars en Railway**
   ```
   STRIPE_SECRET_KEY=sk_live_…   (test_… para pruebas)
   STRIPE_WEBHOOK_SECRET=whsec_…
   STRIPE_PRICE_ID_OFFER_12EUR=price_…
   ```

4. **Subir el ebook a un GitHub Release y setear `PRODUCT_EBOOK_URL`**
   - El audiolibro ya está subido (release `rewards-audio-es-v1`).
   - El ebook iría en otro release (p.ej. `products-arkwright-ebook-es-v1`).
   - `PRODUCT_AUDIO_URL` ya está configurado en Railway por defecto.

Tras esos 4 pasos, el funnel se activa solo. **Cero cambios de código.**

### Vida del flujo

```
1. Usuario hace click en "Comprar pack digital · 12€" en la landing.
2. POST /api/checkout → Stripe Session → redirect a Checkout.
3. Pago → Stripe envía webhook → Purchase row creada con accessToken.
4. Stripe redirige al usuario a /biblioteca?session_id=…
5. /biblioteca muestra ebook + audiolibro (descargas via GitHub Release).
6. El usuario guarda /biblioteca?token=<accessToken> en favoritos para
   volver desde otro dispositivo.
```

### Acceso manual (sin Stripe)

Útil para QA, beta testers, regalos, o si Stripe se cae:

```bash
node scripts/create-test-purchase.mjs --email name@example.com --name "Lara" --lang es
```

Imprime una URL `/biblioteca?token=…` que el destinatario abre. Crea
fila `Purchase` con `status=paid` y un `stripeSessionId` falso
(`manual_<timestamp>`) que nunca colisiona con sessions reales de Stripe.

---

## Contactos · email marketing

Cada email capturado en `/registro` (workbook) y `/resena` (reseña + recompensa) se guarda automáticamente en la tabla unificada `Contact`. La tabla es idempotente por email: si la misma persona entra dos veces, no se duplica — solo se actualiza `lastSeenAt` y se añade el origen al set `sources` (`workbook,resena`).

### Acceder a la lista

Dashboard visual: **`/admin?token=$ADMIN_EXPORT_TOKEN`**

- Contadores por origen (workbook / reseña) e idioma (ES / EN).
- Filtros por origen, idioma y búsqueda por email/nombre.
- Tabla con email, nombre, orígenes, lang, fechas (limitada a 500 filas en el render — el CSV trae todos).
- Botón **Descargar CSV** que respeta los filtros activos.

Descarga directa por URL: **`/api/admin/contacts.csv?token=$ADMIN_EXPORT_TOKEN[&source=workbook|resena][&lang=es|en]`**

El CSV usa cabecera estándar y BOM UTF-8 → listo para subir a:
- **Resend** → Audiences → Import contacts (auto-detecta `email`).
- **Meta Ads** → Audiencias → Audiencia personalizada → Lista de clientes.

### Backfill (una sola vez tras el primer deploy)

```bash
node scripts/backfill-contacts.mjs
```

Lee `User` y `ReviewSubmission`, crea/actualiza filas en `Contact`. Idempotente — se puede correr varias veces sin riesgo.

### Rotación del token

El token vive en `ADMIN_EXPORT_TOKEN`. Si se filtra:

1. Generar uno nuevo: `node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"`
2. Actualizar Railway → Variables → `ADMIN_EXPORT_TOKEN`.
3. Actualizar el bookmark del navegador.

Cero downtime, sin migración.
