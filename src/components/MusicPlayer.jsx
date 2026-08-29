import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { playlist } from "../data/content";

const HINT_KEY = "music-hint-visto";
const LONG_PRESS_MS = 450;

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [burbuja, setBurbuja] = useState(null);

  const songs = playlist.songs || [];
  const hayCanciones = songs.length > 0;

  // Timers de la burbuja y del "mantener presionado".
  const burbujaTimer = useRef(null);
  const pressTimer = useRef(null);
  const fueLargo = useRef(false);
  // Evita que la burbuja del título salga en la primera carga.
  const primeraCarga = useRef(true);

  const mostrar = useCallback((texto, ms = 2600) => {
    window.clearTimeout(burbujaTimer.current);
    setBurbuja(texto);
    burbujaTimer.current = window.setTimeout(() => setBurbuja(null), ms);
  }, []);

  // Play/pause real del <audio> según el estado.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, [playing, trackIndex]);

  // Autoplay. Los navegadores bloquean el audio automático hasta que la
  // persona interactúe con la página, así que: lo intentamos de una vez y,
  // si lo bloquean, arrancamos con el primer toque/scroll que haga.
  useEffect(() => {
    if (!hayCanciones || !playlist.autoplay) return;

    const eventos = ["pointerdown", "touchstart", "keydown", "scroll"];
    let listo = false;

    const limpiar = () => {
      eventos.forEach((ev) => window.removeEventListener(ev, intentar));
    };

    async function intentar() {
      if (listo) return;
      const el = audioRef.current;
      if (!el) return;
      try {
        await el.play();
        listo = true;
        setPlaying(true);
        limpiar();
      } catch {
        // Bloqueado todavía: seguimos esperando una interacción.
      }
    }

    eventos.forEach((ev) => window.addEventListener(ev, intentar, { passive: true }));
    intentar();

    return limpiar;
  }, [hayCanciones]);

  // Tip la primera vez, para que se sepa que el botón cambia de canción.
  useEffect(() => {
    if (!hayCanciones) return;
    let visto = false;
    try {
      visto = window.localStorage.getItem(HINT_KEY) === "1";
    } catch {
      visto = false;
    }
    if (visto) return;

    const t = window.setTimeout(() => {
      mostrar("Toca para cambiar de canción · Mantén presionado para pausar", 7000);
      try {
        window.localStorage.setItem(HINT_KEY, "1");
      } catch {
        // localStorage bloqueado — el tip saldrá de nuevo la próxima vez.
      }
    }, 1200);

    return () => window.clearTimeout(t);
  }, [hayCanciones, mostrar]);

  // Anuncia la canción cada vez que cambia.
  useEffect(() => {
    if (!hayCanciones) return;
    if (primeraCarga.current) {
      primeraCarga.current = false;
      return;
    }
    mostrar(`♫ ${songs[trackIndex]?.title || "Siguiente canción"}`);
  }, [trackIndex, hayCanciones, songs, mostrar]);

  useEffect(() => () => {
    window.clearTimeout(burbujaTimer.current);
    window.clearTimeout(pressTimer.current);
  }, []);

  if (!hayCanciones) return null;

  const siguiente = () => {
    setTrackIndex((i) => (i + 1) % songs.length);
    setPlaying(true);
  };

  // Toque corto = siguiente canción. Toque largo = pausar / reanudar.
  const alPresionar = () => {
    fueLargo.current = false;
    window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => {
      fueLargo.current = true;
      setPlaying((p) => {
        mostrar(p ? "Música en pausa" : "Reanudando ♥", 1800);
        return !p;
      });
      if (navigator.vibrate) navigator.vibrate(18);
    }, LONG_PRESS_MS);
  };

  const alSoltar = () => {
    window.clearTimeout(pressTimer.current);
    if (!fueLargo.current) siguiente();
  };

  const alCancelar = () => {
    window.clearTimeout(pressTimer.current);
    fueLargo.current = true; // el dedo salió del botón: no cuenta como toque
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 18,
        right: 18,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <audio
        ref={audioRef}
        src={songs[trackIndex].src}
        onEnded={siguiente}
        loop={songs.length === 1}
        preload="auto"
      />

      <AnimatePresence>
        {burbuja && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.25 }}
            style={{
              maxWidth: "min(62vw, 260px)",
              background: "var(--card)",
              border: "1px solid var(--card-line)",
              boxShadow: "var(--shadow-card)",
              borderRadius: 18,
              padding: "8px 14px",
              fontSize: 11.5,
              lineHeight: 1.35,
              fontFamily: "var(--font-label)",
              color: "var(--ink-soft)",
              textAlign: "right",
            }}
          >
            {burbuja}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onPointerDown={alPresionar}
        onPointerUp={alSoltar}
        onPointerLeave={alCancelar}
        onPointerCancel={alCancelar}
        onContextMenu={(e) => e.preventDefault()}
        aria-label="Toca para cambiar de canción, mantén presionado para pausar"
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "var(--card)",
          border: "1px solid var(--card-line)",
          boxShadow: "var(--shadow-card)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          color: "var(--accent)",
          flexShrink: 0,
          touchAction: "manipulation",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        {playing ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          >
            ♫
          </motion.span>
        ) : (
          "♫"
        )}
      </motion.button>
    </div>
  );
}
