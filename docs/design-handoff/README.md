# Handoff: The Arkwright Method — Landing Page

## Overview
Landing page de alta conversión para el lanzamiento del libro **"The Arkwright Method"** de Lara Lawn (primavera 2026). Objetivo principal: convertir visitantes en pre-reservas del libro, con un aura editorial de autoridad (revista de diseño / clásico de tapa dura) en lugar de una página de producto estándar.

Audiencia: mujeres profesionales / creativas hispano/anglohablantes interesadas en identidad, psicología del dinero y auto-desarrollo. Tono: sobrio, literario, afirmativo.

---

## About the Design Files
Los archivos incluidos (`The Arkwright Method.html`) son **referencias de diseño en HTML** — un prototipo de alta fidelidad que muestra el look, las interacciones y la jerarquía pretendida. **NO son código de producción que deba copiarse tal cual.**

El trabajo del desarrollador es **recrear este diseño en el entorno destino** (React/Next.js, Astro, Remix, etc.) siguiendo los patrones y la librería de componentes que ya exista en el codebase. Si el proyecto arranca desde cero, recomiendo **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion** para mantener las animaciones y el SEO.

---

## Fidelity
**Alta fidelidad (hifi).** Colores finales, tipografía final, espaciado final, interacciones definidas. El desarrollador debe reproducir la UI **pixel-perfect**, usando los valores exactos de este documento y del HTML de referencia.

---

## Design Tokens

### Colores
```css
--ink:         #0E0B0B;   /* texto principal, fondos oscuros */
--ink-soft:    #1a1515;   /* texto secundario */
--paper:       #F6F1EA;   /* fondo principal (papel cálido) */
--paper-warm:  #EFE7DB;   /* fondo alterno */
--bone:        #E8DFD1;   /* fondo más frío */
--rule:        #2a2222;   /* líneas oscuras */
--rule-soft:   #d9cfbf;   /* líneas claras */
--accent:      #B4123F;   /* magenta editorial — CTAs, itálicas destacadas, subrayados */
--accent-soft: #F3D7DE;   /* wash de acento */
--muted:       #6b6360;   /* texto muted, monos */
```

### Tipografía
- **Serif (display + lede):** `Cormorant Garamond` — pesos 300, 400, 500, 600 + itálicas
- **Sans (UI + párrafos):** `Inter` — pesos 300, 400, 500, 600
- **Mono (eyebrows, meta):** `JetBrains Mono` — pesos 400, 500

Google Fonts URL:
```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap
```

#### Escala tipográfica
| Uso | Font | Weight | Size | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| H1 hero | Cormorant | 300 | `clamp(56px, 7.6vw, 120px)` | 1.0 | -0.012em |
| H2 section | Cormorant | 300 | `clamp(40px, 5vw, 72px)` | 1.05 | -0.01em |
| H3 | Cormorant | 400 | 32px | 1.2 | -0.005em |
| Lede | Cormorant | 300 | `clamp(19px, 1.4vw, 22px)` | 1.5 | 0 |
| Body | Inter | 400 | 16px | 1.55 | 0 |
| Small / eyebrow | JetBrains Mono | 400 | 10-11px | 1.4 | 0.22-0.28em UPPERCASE |
| Button | Inter | 500 | 12px | 1 | 0.22em UPPERCASE |

### Espaciado
Escala sugerida en `rem` (1rem = 16px):
`4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 100, 130px`
Padding de sección vertical: **100-130px** desktop / 60-80px mobile.
Max-width del layout: `--max: 1320px` — padding horizontal **32px** (desktop) / **20px** (mobile).

### Border radius
**0px** en todo (estética editorial). Únicas excepciones: el dot del eyebrow (50%), avatars si los hubiera.

### Sombras / Profundidad
La página casi no usa sombras. Depth se logra con:
- Overlays de gradientes radiales muy sutiles en backgrounds
- Líneas 1px `rgba(14,11,11,.12)`
- Opacidades bajas en marcas de agua (0.04)

### Easing
`cubic-bezier(.2,.7,.2,1)` para todas las animaciones.

---

## Screens / Views

Esta es una **landing page de una sola página** (long-scroll) con las siguientes secciones, en orden:

### 1. Nav bar (sticky)
- Fijada al top. Fondo `--paper` con borde inferior 1px `rgba(14,11,11,.08)`.
- Izquierda: logo "Lara Lawn" en serif + eyebrow "Arquitecta de identidades".
- Centro: links — El Libro · El Método · Sobre Lara · Extractos · FAQ.
- Derecha: toggle ES/EN + botón CTA "Comprar" (fondo `--ink`, texto `--paper`, padding 10px 20px, uppercase 11px letter-spacing 0.22em).

### 2. Hero — minimal, high-conversion
**Layout:** Grid 2 columnas (1fr · 0.8fr), gap 80px, align-items center, padding 130px 0 80px, altura mínima 100vh.

**Marca de agua:** Texto "Lara Lawn" en Cormorant italic 300, tamaño `clamp(120px, 14vw, 220px)`, color `--ink` opacidad 0.04, posición absoluta rotada -90° sobre el borde izquierdo. Sin interacción, solo sello editorial.

**Columna izquierda (contenido):**
1. **Eyebrow** (mono) con dot magenta 6px + "Un nuevo libro · Primavera 2026". Margin-bottom 48px. Fade-up 0.1s.
2. **H1** a 3 líneas independientes con animación de reveal por línea (máscara `overflow:hidden` + `translateY(110%) → 0`, delays 0.2s / 0.38s / 0.56s):
   - Línea 1: "La mayor"
   - Línea 2: "oportunidad" (itálica, color `--accent`)
   - Línea 3: "desde **1760.**" — "1760." va con subrayado animado (height 3px, `--accent`, scaleX 0→1 con delay 1.8s)
3. **Lede** (serif 300, 19-22px, line-height 1.5, color `--ink-soft`, max-width 520px): "Tu identidad y tu entorno ya decidieron cuánto vas a ganar el resto de tu vida. *Este libro explica cómo cambiarlo.*" Margin-bottom 52px. Fade-up 1s.
4. **Fila de CTAs:**
   - Primario: "Reservar el libro" — bg `--ink`, text `--paper`, padding 22px 40px, 12px uppercase 0.22em. Icono flecha animada que se alarga al hover. Hover: bg `--accent`, translateY(-1px).
   - Secundario (ghost): "Leer un extracto" — mismo tipo sin fondo, border-bottom 1px, hover color `--accent`.
5. **Trust line** (margin-top 36px): mono uppercase "10 años de investigación · 10.000 mujeres · Lara Lawn" con separadores de 1px.

**Columna derecha:** Libro 3D interactivo — 6 caras CSS, rotable por drag (mouse + touch) o por botones prev/next debajo. Estado idle con oscilación suave infinita. Portada: fondo `--ink`, título "The Arkwright *Method*" en Cormorant 300/400, "N°01" arriba, subtítulo "How identity decides income" abajo.

### 3-N. Secciones adicionales
(Consultar el HTML de referencia para el detalle completo de las secciones restantes: hook, el libro, el problema, el insight, la transformación, autoridad de la autora, diferenciación, extractos, validación, profundidad del método, FAQ, CTA final con sticky mobile.)

---

## Interactions & Behavior

### Animaciones globales
- **Fade-up inicial** al cargar el hero: `translateY(20px) + opacity 0` → `0 + 1`, duración 0.9s, easing `--ease`, delays escalonados 0.1 → 1.4s.
- **Headline reveal:** cada línea del H1 enmascarada con `overflow:hidden` y `translateY(110% → 0)`, 1.1s, delays 0.2/0.38/0.56s.
- **Subrayado del 1760:** `scaleX(0 → 1)` desde la izquierda, 1.2s, delay 1.8s.
- **Dot del eyebrow:** pulse infinito 2.4s (opacidad 1 ↔ 0.35).

### Libro 3D
- **Drag libre:** mousedown/touchstart → capturar dx/dy → actualizar `--ry` (horizontal) y `--rx` (vertical clamped a ±25°).
- **Idle:** si no hay drag en 4s, reanudar oscilación suave.
- **Botones prev/next:** girar ±90° en Y con transición de 0.8s.
- **Cursor:** `grab` → `grabbing` mientras se arrastra.

### Toggle ES/EN
Implementado con atributos `[data-es]` / `[data-en]` en cada nodo localizable. Estado inicial: ES visible, EN oculto. Al togglear, añadir/quitar clase `lang-en` en `<html>` que invierte las reglas CSS:
```css
[data-en]{display:none !important}
[data-es]{display:revert}
.lang-en [data-en]{display:revert !important}
.lang-en [data-es]{display:none !important}
```

### Sticky CTA móvil
En mobile (<768px), barra fija en bottom con el CTA "Reservar el libro" a ancho completo. Aparece tras scrollear pasado el hero. Fondo `--ink`, altura ~64px, safe-area-inset-bottom.

### Hover states
- Botón primario: `background: --accent` + `translateY(-1px)`, flecha alarga 18px → 26px.
- Botón ghost: color + border se vuelven `--accent`.
- Links de nav: color se tiñe de `--accent` con transition 0.2s.

---

## State Management

Estado mínimo del cliente:
- `lang: 'es' | 'en'` — persistir en localStorage (`lara.lang`). Toggle en nav.
- `bookRotation: { rx: number, ry: number }` — rotación actual del libro 3D, local al componente.
- `isDragging: boolean` — para cambiar cursor y pausar idle animation.
- `hasScrolledPastHero: boolean` — para mostrar/ocultar el sticky CTA móvil (IntersectionObserver sobre el hero).

No hay data fetching. La pre-reserva envía a un endpoint externo (Shopify / ConvertKit / custom) que el desarrollador ha de configurar — placeholder actual: `#buy`.

---

## Assets
- **Fuentes:** Google Fonts (Cormorant Garamond, Inter, JetBrains Mono) — cargadas vía `<link>`.
- **Imágenes:** NINGUNA en el prototipo actual. El libro 3D está construido 100% con CSS + texto. En producción, el desarrollador debería **sustituir las 6 caras CSS por una imagen/render real** de la portada del libro (cuando esté disponible) para máxima fidelidad editorial.
- **Iconos:** Inline SVG (flechas de los botones, chevrons del libro). Sin librería de iconos.

---

## Files
- `The Arkwright Method.html` — el prototipo completo, todo inline (HTML + CSS + JS vanilla). El desarrollador debe **extraer** los estilos a CSS modules / Tailwind config y reescribir los bloques en componentes de su framework:
  - `<Nav>`, `<Hero>`, `<Book3D>`, `<Section>`, `<CTABlock>`, `<FAQ>`, `<StickyMobileCTA>`, `<LangToggle>`.

---

## Recomendaciones de implementación

1. **Framework:** Next.js 14 App Router + TypeScript.
2. **Estilos:** Tailwind CSS con el tema extendido para mapear los design tokens (`colors.ink`, `colors.paper`, `colors.accent`, `fontFamily.serif`, etc.).
3. **Animaciones:** Framer Motion para los fade-ups y reveals (en lugar de keyframes CSS) — más controlable y testeable.
4. **i18n:** `next-intl` o `next-i18next` en vez de toggle manual con atributos data-*.
5. **3D del libro:** mantener CSS 3D transforms para la v1; considerar Three.js / React Three Fiber si quieren fidelidad fotográfica.
6. **SEO:** metadatos Open Graph, Twitter Card, structured data de `Book`.
7. **Analítica:** GA4 + evento `click_preorder` en el CTA primario.
8. **Forms:** servicio de email (ConvertKit, Beehiiv, Mailchimp) con double opt-in para la lista de espera.
