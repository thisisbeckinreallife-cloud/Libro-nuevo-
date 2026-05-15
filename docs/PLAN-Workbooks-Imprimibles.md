# Plan · Dos workbooks imprimibles, uno por libro

## Contexto

Lara Lawn tiene dos libros con tesis encadenadas:

- **Libro 01 · "No eres tú, es tu subconsciente"** — el libro fundacional.
  Abre la pregunta: por qué tu subconsciente lleva años decidiendo por ti.
  Es el libro de *toma de conciencia*. 38.000 copias.
- **Libro 02 · "El método Arkwright"** — el manual técnico. 13 capítulos +
  prólogo + epílogo. Reescribe la identidad subconsciente. Es el libro de
  *aplicación*. Ya tiene 4 dinámicas online (diagnóstico, funeral, próxima
  vida, 7 lunes).

El usuario quiere **2 workbooks imprimibles en PDF, uno por libro**, con
valor real, bien estructurados, cada uno con el branding de su libro.

## Diferenciación de los dos cuadernos

| | Workbook 01 · Subconsciente | Workbook 02 · Arkwright |
|---|---|---|
| Rol | Tomar conciencia | Aplicar y reescribir |
| Eje | *Ver* el termostato | *Reprogramar* el termostato |
| Tono | Introspectivo, íntimo | Operativo, sin anestesia |
| Estructura | 8 módulos de excavación | Arco de 13 capítulos |

## Branding por libro

**Workbook 01 — paleta editorial cálida (laralawn íntimo)**
- Fondo crema `#FAF9F7`, tinta `#1E1515`, acento magenta `#E91E63`,
  rosa suave `#FCE4EC`, granate `#722F37`.
- Portada: crema + serif Playfair + acento magenta. Sensación: diario
  personal, cuaderno de terapia de élite.

**Workbook 02 — paleta estructural (portada Arkwright)**
- Fondo navy `#0A1230`, cobre `#E05808`, magenta `#E91E63` de sistema,
  crema para el cuerpo imprimible.
- Portada: navy + título cobre (como la portada real del libro).
  Sensación: manual de ingeniería de identidad.

Ambos: Playfair Display (display), Montserrat (cuerpo), JetBrains Mono
(labels). A4, márgenes 16-18mm, espacios de escritura reales (líneas,
cajas, tablas, líneas de firma), numeración de página, pie con libro +
autora. CSS de impresión (`@page`, `print-color-adjust: exact`).

## Workbook 01 · "No eres tú, es tu subconsciente" — Cuaderno de toma de conciencia

~16-18 páginas A4.

1. **Portada** branded + subtítulo + línea de propiedad ("Este cuaderno
   pertenece a ___").
2. **Cómo usar este cuaderno** — reglas: a mano, sin editar, una sesión
   por módulo, honestidad brutal.
3. **Módulo 1 · El termostato** — detecta tu setpoint. Tabla "Cada vez
   que llego a ___, vuelvo a ___" (dinero, visibilidad, cuerpo,
   relación). 4 filas + análisis.
4. **Módulo 2 · Las escenas fundadoras (5-11 años)** — excavación guiada
   de 3 escenas: qué pasó, quién lo dijo, la frase, la ley que tu cerebro
   codificó. Bloques con líneas.
5. **Módulo 3 · El inventario de sabotajes** — 5 patrones recurrentes;
   por cada uno: disparador / qué haces / qué protege.
6. **Módulo 4 · Las identidades prestadas** — quién instaló "quién crees
   que eres": mapa de etiquetas heredadas aún activas + de quién.
7. **Módulo 5 · El cuerpo no miente** — chequeo somático. Mapa corporal
   (silueta) para marcar dónde vive la contracción + preguntas.
8. **Módulo 6 · El diálogo interno** — transcribe 3 frases de la voz que
   corrige antes de hablar; reescribe cada una.
9. **Módulo 7 · Síntesis: tu termostato hoy** — retrato de una página.
   "Mi imagen subconsciente hoy se llama: ___".
10. **Cierre + puente** — al método Arkwright (el siguiente paso técnico).
    Línea de firma + fecha.

## Workbook 02 · "El método Arkwright" — Manual de aplicación

~20-22 páginas A4. Sigue el arco de los 13 capítulos.

1. **Portada** navy/cobre + "No se lee. Se aplica."
2. **Cómo usar este manual** — el principio operativo del libro.
3. **Cap 1-2 · El diseño** — diagnóstico del termostato. Auto-retrato de
   6 ejes con escalas 0-10 impresas (rellenas a mano) → "¿Qué hormiga
   eres hoy?".
4. **Cap 3 · No te vas a morir tan pronto** — libro mayor del tiempo:
   horas vendidas por euro, meses de colchón, cuentas reales.
5. **Cap 4 · El piloto automático** — mapa de una semana de decisiones
   automáticas (rejilla 7 días).
6. **Cap 5 · La conversación** — el guion que corres con el dinero y lo
   que vales. Transcripción + reescritura.
7. **Cap 6 · El funeral** — acta de defunción formal: lo que entierras
   hoy (identidades, creencias, acuerdos). Línea de firma y fecha.
8. **Cap 7 · Tu cuerpo sabe que estás mintiendo** — protocolo somático
   de 4 pasos.
9. **Cap 8 · La bifurcación** — matriz de decisión de los dos caminos.
10. **Cap 9 · La tribu** — auditoría: rejilla de quién te empuja
    arriba/abajo + los 3 nombres de tu tribu futura.
11. **Cap 10-11 · El mundo no es una línea / Aprende a pescar** — de
    lineal a sistema: identifica 1 activo vs hora-por-hora.
12. **Cap 12 · Tu próxima vida** — línea de tiempo de 12 meses con
    rejilla de hitos imprimible.
13. **Cap 13 · Los 7 lunes** — tracker de 7 acciones concretas con
    casillas hecho/fecha/qué pasó.
14. **Epílogo · La hormiga** — Cephalotes atratus: tu salto y volver a
    casa. Página de compromiso con firma.

## Ejecución técnica

1. `docs/workbooks/Workbook-01-Subconsciente.html` — print CSS cálido.
2. `docs/workbooks/Workbook-02-Arkwright.html` — print CSS navy/cobre.
3. Render a PDF con Chrome headless `--print-to-pdf` (mismo método que el
   manual de hardening, ya validado).
4. Salida:
   - `docs/workbooks/Workbook-01-No-eres-tu-es-tu-subconsciente.pdf`
   - `docs/workbooks/Workbook-02-El-metodo-Arkwright.pdf`
5. Verificar páginas con la tool de lectura de PDF.
6. Commit + push. Entregar ambos PDF al usuario aquí.

## Verificación

- Cada workbook abre con su portada branded correcta.
- Espacios de escritura reales (líneas, cajas) — imprimible y rellenable.
- Sin desbordes; saltos de página limpios (`page-break-inside: avoid`).
- Coherencia de marca: 01 cálido, 02 navy/cobre, ambos con magenta y
  tipografía de la casa.
- Contenido fiel a la tesis real de cada libro (termostato, escenas
  fundadoras, la tribu, los 7 lunes, la hormiga) — nada inventado fuera
  del marco de los libros.
