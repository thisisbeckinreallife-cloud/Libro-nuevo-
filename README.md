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
