/**
 * Mapeo de prefijos de capítulo → nombre de archivo MP3 en el release de
 * GitHub `products-arkwright-audio-es-v1`. El reproductor web pide
 * `/api/biblioteca/stream/{prefix}` y este módulo le dice qué archivo servir.
 *
 * Cambiar este mapeo o las URLs cuando el audiolibro se rehace o muta a R2.
 */

const RELEASE_BASE_URL =
  "https://github.com/thisisbeckinreallife-cloud/Libro-nuevo-/releases/download/products-arkwright-audio-es-v1";

const CHAPTER_FILENAMES: Record<string, string> = {
  "00": "00_Titulo_y_dedicatoria.mp3",
  "01": "01_Prologo_Dejame_adivinar.mp3",
  "02": "02_Mientras_dormias.mp3",
  "03": "03_El_diseno.mp3",
  "04": "04_No_te_vas_a_morir_tan_pronto.mp3",
  "05": "05_El_piloto_automatico.mp3",
  "06": "06_La_conversacion.mp3",
  "07": "07_El_funeral.mp3",
  "08": "08_Tu_cuerpo_sabe_que_estas_mintiendo.mp3",
  "09": "09_La_bifurcacion.mp3",
  "10": "10_La_tribu.mp3",
  "11": "11_El_mundo_no_es_una_linea.mp3",
  "12": "12_Aprende_a_pescar.mp3",
  "13": "13_Tu_proxima_vida.mp3",
  "14": "14_El_lunes_por_la_manana.mp3",
  "15": "15_Epilogo_La_hormiga.mp3",
  "16": "16_Una_ultima_cosa.mp3",
};

export const CHAPTER_PREFIXES = Object.keys(CHAPTER_FILENAMES);

export function isValidChapterPrefix(prefix: string): boolean {
  return Object.prototype.hasOwnProperty.call(CHAPTER_FILENAMES, prefix);
}

export function getChapterUrl(prefix: string): string | null {
  const filename = CHAPTER_FILENAMES[prefix];
  if (!filename) return null;
  // Env var permite override en caso de migrar a otro hosting (R2, S3) sin
  // tocar este archivo. Si no está, se usa el RELEASE_BASE_URL hardcodeado.
  const baseUrl =
    (process.env.PRODUCT_AUDIO_CHAPTERS_BASE_URL ?? "").trim() ||
    RELEASE_BASE_URL;
  return `${baseUrl.replace(/\/$/, "")}/${filename}`;
}
