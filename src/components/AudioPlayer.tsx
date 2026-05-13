"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Chapter = {
  id: number;
  prefix: string;
  title: string;
  durationSeconds: number;
};

type Manifest = {
  title: string;
  voice: string;
  language: string;
  narrator: string;
  totalDurationSeconds: number;
  chapters: Chapter[];
};

const SPEEDS = [0.8, 1, 1.25, 1.5, 1.75, 2] as const;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type StoredProgress = {
  chapterId: number;
  currentTime: number;
  rate: number;
  updatedAt: number;
};

export function AudioPlayer({ accessToken }: { accessToken: string }) {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [chapterId, setChapterId] = useState<number>(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState<number>(1);
  const [chapterListOpen, setChapterListOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const storageKey = `arkwright-audio-progress-${accessToken}`;

  // Fire-and-forget tracking — los errores no rompen el reproductor.
  function trackEvent(type: string, extra?: Record<string, unknown>) {
    try {
      fetch("/api/biblioteca/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true, // permite enviar incluso al cerrar la pestaña
        body: JSON.stringify({
          token: accessToken,
          type,
          chapter: manifest?.chapters[chapterId]?.prefix,
          metadata: extra,
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }
  }

  // Carga el manifest público.
  useEffect(() => {
    let cancelled = false;
    fetch("/audio-chapters/arkwright.json", { cache: "force-cache" })
      .then((r) => {
        if (!r.ok) throw new Error(`manifest ${r.status}`);
        return r.json();
      })
      .then((data: Manifest) => {
        if (!cancelled) setManifest(data);
      })
      .catch((e) => {
        if (!cancelled) setError(`No se pudo cargar el listado de capítulos (${e.message}).`);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Restaura progreso de localStorage tras cargar el manifest.
  useEffect(() => {
    if (!manifest) return;
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredProgress;
      if (
        typeof parsed.chapterId === "number" &&
        parsed.chapterId >= 0 &&
        parsed.chapterId < manifest.chapters.length
      ) {
        setChapterId(parsed.chapterId);
      }
      if (typeof parsed.rate === "number" && SPEEDS.includes(parsed.rate as (typeof SPEEDS)[number])) {
        setRate(parsed.rate);
      }
      // El currentTime se restaura cuando el <audio> carga metadata.
    } catch {
      // ignore corrupted state
    }
  }, [manifest, storageKey]);

  const chapter = useMemo(() => {
    if (!manifest) return null;
    return manifest.chapters[chapterId] ?? null;
  }, [manifest, chapterId]);

  const chapterUrl = useMemo(() => {
    if (!chapter) return null;
    return `/api/biblioteca/stream/${chapter.prefix}?token=${encodeURIComponent(accessToken)}`;
  }, [chapter, accessToken]);

  // Cambio de src cuando cambia el capítulo.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !chapterUrl) return;
    audio.src = chapterUrl;
    audio.playbackRate = rate;
    // Recuperar currentTime si es el capítulo guardado.
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredProgress;
        if (parsed.chapterId === chapterId && typeof parsed.currentTime === "number") {
          const resume = () => {
            if (audio.duration && Number.isFinite(audio.duration)) {
              audio.currentTime = Math.min(parsed.currentTime, audio.duration - 1);
            }
          };
          audio.addEventListener("loadedmetadata", resume, { once: true });
        }
      }
    } catch {
      // ignore
    }
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterUrl]);

  // Guardar progreso periódicamente en localStorage.
  useEffect(() => {
    if (!chapter) return;
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (!audio) return;
      const data: StoredProgress = {
        chapterId,
        currentTime: audio.currentTime,
        rate: audio.playbackRate,
        updatedAt: Date.now(),
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch {
        // ignore quota errors
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [chapter, chapterId, storageKey]);

  // Auto-avance al siguiente capítulo cuando termina el actual.
  function handleEnded() {
    if (!manifest) return;
    trackEvent("chapter_completed");
    if (chapterId < manifest.chapters.length - 1) {
      setChapterId(chapterId + 1);
      setCurrentTime(0);
    } else {
      setPlaying(false);
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      trackEvent("play_paused");
    } else {
      audio
        .play()
        .then(() => {
          setPlaying(true);
          trackEvent("play_started");
        })
        .catch((e) => {
          setError(e.message);
          trackEvent("error", { message: e.message });
        });
    }
  }

  function skip(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(
      0,
      Math.min(audio.currentTime + seconds, audio.duration || Infinity),
    );
  }

  function seekTo(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  }

  function changeRate() {
    const idx = SPEEDS.indexOf(rate as (typeof SPEEDS)[number]);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }

  function selectChapter(id: number) {
    setChapterId(id);
    setCurrentTime(0);
    setChapterListOpen(false);
    setPlaying(true); // intentamos reproducir al elegir
    trackEvent("chapter_changed", { newChapterId: id });
  }

  if (error) {
    return (
      <div className="audio-player audio-player--error">
        <p>{error}</p>
      </div>
    );
  }

  if (!manifest || !chapter) {
    return (
      <div className="audio-player audio-player--loading" aria-live="polite">
        <p>Cargando reproductor…</p>
      </div>
    );
  }

  const hasPrev = chapterId > 0;
  const hasNext = chapterId < manifest.chapters.length - 1;

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleEnded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setError("No se pudo reproducir este capítulo. Inténtalo de nuevo en unos segundos.")}
      />

      <div className="audio-player__meta">
        <p className="audio-player__eyebrow">
          Capítulo {chapterId + 1} / {manifest.chapters.length} · {manifest.voice}
        </p>
        <h3 className="audio-player__chapter-title">{chapter.title}</h3>
      </div>

      <div className="audio-player__seek">
        <input
          type="range"
          min={0}
          max={duration || chapter.durationSeconds}
          step={1}
          value={currentTime}
          onChange={(e) => seekTo(Number(e.target.value))}
          className="audio-player__seek-input"
          aria-label="Posición de reproducción"
        />
        <div className="audio-player__seek-times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || chapter.durationSeconds)}</span>
        </div>
      </div>

      <div className="audio-player__controls">
        <button
          type="button"
          className="audio-player__btn audio-player__btn--secondary"
          onClick={() => hasPrev && selectChapter(chapterId - 1)}
          disabled={!hasPrev}
          aria-label="Capítulo anterior"
        >
          ‹‹
        </button>
        <button
          type="button"
          className="audio-player__btn audio-player__btn--secondary"
          onClick={() => skip(-15)}
          aria-label="Atrás 15 segundos"
        >
          −15s
        </button>
        <button
          type="button"
          className="audio-player__btn audio-player__btn--main"
          onClick={togglePlay}
          aria-label={playing ? "Pausar" : "Reproducir"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button
          type="button"
          className="audio-player__btn audio-player__btn--secondary"
          onClick={() => skip(15)}
          aria-label="Adelante 15 segundos"
        >
          +15s
        </button>
        <button
          type="button"
          className="audio-player__btn audio-player__btn--secondary"
          onClick={() => hasNext && selectChapter(chapterId + 1)}
          disabled={!hasNext}
          aria-label="Capítulo siguiente"
        >
          ››
        </button>
        <button
          type="button"
          className="audio-player__btn audio-player__btn--rate"
          onClick={changeRate}
          aria-label="Cambiar velocidad"
        >
          {rate}×
        </button>
      </div>

      <div className="audio-player__chapter-list-toggle">
        <button
          type="button"
          className="audio-player__chapters-btn"
          onClick={() => setChapterListOpen((v) => !v)}
          aria-expanded={chapterListOpen}
        >
          {chapterListOpen ? "Ocultar capítulos" : `Ver los ${manifest.chapters.length} capítulos`}
        </button>
      </div>

      {chapterListOpen && (
        <ol className="audio-player__chapter-list">
          {manifest.chapters.map((c) => (
            <li key={c.id} className="audio-player__chapter-list-item">
              <button
                type="button"
                onClick={() => selectChapter(c.id)}
                className={`audio-player__chapter-row ${c.id === chapterId ? "is-current" : ""}`}
                aria-current={c.id === chapterId ? "true" : undefined}
              >
                <span className="audio-player__chapter-num">{String(c.id).padStart(2, "0")}</span>
                <span className="audio-player__chapter-row-title">{c.title}</span>
                <span className="audio-player__chapter-dur">{formatTime(c.durationSeconds)}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
