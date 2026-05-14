/**
 * Guía estática multi-dispositivo. Server-rendered (sin estado),
 * accesible desde el email post-compra y desde el footer de /biblioteca.
 *
 * Estructura: 6 secciones (iPhone, Android, Mac, Windows, Coche,
 * TV/Sonos) con pasos numerados y la recomendación de app. Las anclas
 * permiten linkear directamente al dispositivo del usuario desde el
 * email: /como-escuchar#android etc.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo escuchar el audiolibro · Arkwright",
  description:
    "Pasos paso a paso para escuchar el audiolibro en iPhone, Android, Mac, Windows, coche, TV y altavoces.",
};

const DEVICES = [
  {
    id: "iphone",
    title: "iPhone / iPad",
    badge: "iOS",
    intro:
      "Apple Books abre el .m4b nativamente con los 17 capítulos navegables y guarda el progreso entre dispositivos vía iCloud.",
    steps: [
      "Abre el email de confirmación en el iPhone y pulsa el enlace de descarga del audiolibro (.m4b).",
      "Cuando termine la descarga, pulsa el icono de Compartir y elige “Copiar en Libros”.",
      "Apple Books detectará los 17 capítulos automáticamente — los verás en la pestaña “Audiolibros”.",
      "Si tienes iCloud activado, el progreso se sincroniza con tu Mac y tu iPad sin tocar nada.",
    ],
    altText:
      "Si prefieres no descargar, abre /biblioteca desde Safari y usa el reproductor web (capítulos, velocidad y posición se guardan en el navegador).",
  },
  {
    id: "android",
    title: "Android",
    badge: "Smart AudioBook Player",
    intro:
      "El mejor reproductor gratuito para .m4b en Android: detecta capítulos, velocidad, sleep timer y guarda el progreso.",
    steps: [
      "Instala Smart AudioBook Player desde Google Play (gratis).",
      "Descarga el .m4b desde el email a la carpeta Descargas del teléfono.",
      "Abre Smart AudioBook Player → menú → Añadir libro → selecciona el .m4b.",
      "Verás los 17 capítulos listados. Puedes saltar de uno a otro, cambiar velocidad y activar el sleep timer.",
    ],
    altText:
      "Alternativa sin instalar nada: abre /biblioteca en Chrome y usa el reproductor web.",
  },
  {
    id: "mac",
    title: "Mac",
    badge: "Apple Books / VLC",
    intro:
      "El .m4b se importa con un doble click a Apple Books, o lo abres con VLC si prefieres un reproductor neutral.",
    steps: [
      "Descarga el .m4b en tu Mac desde el email.",
      "Haz doble click sobre el archivo — Apple Books lo importará a tu biblioteca con los 17 capítulos.",
      "Alternativa: abre el archivo con VLC (también muestra los capítulos en el menú Reproducción → Capítulo).",
      "También funciona directamente en el reproductor web de /biblioteca desde Safari o Chrome.",
    ],
    altText: null,
  },
  {
    id: "windows",
    title: "Windows",
    badge: "VLC / web player",
    intro:
      "Windows no tiene un reproductor de .m4b por defecto, pero VLC funciona perfecto — o usas el reproductor web sin instalar nada.",
    steps: [
      "Opción rápida sin instalar: abre /biblioteca en Edge/Chrome/Firefox y usa el reproductor web embebido.",
      "Opción con archivo local: instala VLC (gratis, videolan.org) y abre el .m4b con doble click.",
      "VLC muestra los capítulos en el menú Reproducción → Capítulo.",
      "Otra opción: descarga el zip con los 17 MP3 sueltos y reprodúcelos con cualquier reproductor (Windows Media Player, Groove Music, etc.).",
    ],
    altText: null,
  },
  {
    id: "coche",
    title: "En el coche",
    badge: "CarPlay / Android Auto / Bluetooth",
    intro:
      "El móvil hace el trabajo. CarPlay/Android Auto muestran los capítulos en la pantalla del coche.",
    steps: [
      "Empieza el audiolibro en el móvil (Apple Books en iPhone, Smart AudioBook Player en Android).",
      "Conecta el móvil al coche por CarPlay, Android Auto o Bluetooth.",
      "El coche reproduce el audio y muestra el título del capítulo actual en la pantalla.",
      "Los botones del volante (▶, ⏸, ⏭) funcionan con la app del móvil sin pasar a la siguiente canción.",
    ],
    altText: null,
  },
  {
    id: "tv-sonos",
    title: "TV / Sonos / Altavoces",
    badge: "AirPlay / Bluetooth / Sonos",
    intro:
      "Si tienes Apple TV o Sonos en casa, puedes enviar el audio al sistema principal de la sala.",
    steps: [
      "AirPlay (iOS/Mac): desde Apple Books o Safari, pulsa el icono AirPlay y elige el altavoz/TV.",
      "Sonos: abre la app Sonos → Música y contenido → Tus archivos → importa el .m4b desde el almacenamiento del teléfono.",
      "Bluetooth: empareja un altavoz al móvil y reproduce desde la app habitual.",
      "También funciona desde el reproductor web /biblioteca en una pestaña del navegador del Mac/iPad conectado a la TV.",
    ],
    altText: null,
  },
] as const;

export default function ComoEscucharPage() {
  return (
    <main className="como-escuchar-shell">
      <header className="biblioteca-header biblioteca-header--compact">
        <p className="biblioteca-eyebrow">Guía multi-dispositivo</p>
        <h1 className="biblioteca-h1">
          Cómo escuchar el<em> audiolibro</em>
        </h1>
        <p className="biblioteca-intro">
          Pasos paso a paso para cualquier dispositivo. Si nada de esto funciona,
          tienes el reproductor web embebido en{" "}
          <a href="/biblioteca" className="accent-link">
            /biblioteca
          </a>{" "}
          que funciona en cualquier navegador sin instalar nada.
        </p>
      </header>

      <nav className="como-escuchar-nav" aria-label="Saltar a un dispositivo">
        {DEVICES.map((d) => (
          <a key={d.id} href={`#${d.id}`} className="como-escuchar-nav-pill">
            {d.title}
          </a>
        ))}
      </nav>

      {DEVICES.map((device, idx) => (
        <section
          key={device.id}
          id={device.id}
          className={`como-escuchar-device ${idx % 2 === 0 ? "is-even" : "is-odd"}`}
        >
          <header className="como-escuchar-device-head">
            <p className="como-escuchar-device-badge">{device.badge}</p>
            <h2 className="como-escuchar-device-title">{device.title}</h2>
            <p className="como-escuchar-device-intro">{device.intro}</p>
          </header>
          <ol className="como-escuchar-steps">
            {device.steps.map((step, i) => (
              <li key={i} className="como-escuchar-step">
                <span className="como-escuchar-step-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="como-escuchar-step-body">{step}</span>
              </li>
            ))}
          </ol>
          {device.altText ? (
            <p className="como-escuchar-alt">↳ {device.altText}</p>
          ) : null}
        </section>
      ))}

      <footer className="como-escuchar-foot">
        <p>
          ¿Sigues teniendo problemas? Responde a cualquier email de Lara y te
          ayudamos personalmente. La voz <strong>Despina</strong> en castellano
          de España es la misma en todas las opciones.
        </p>
      </footer>
    </main>
  );
}
