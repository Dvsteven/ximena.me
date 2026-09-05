import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { playlist } from "../data/content";

export default function MusicPlayer({ autoStart }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const songs = playlist.songs;

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [playing, trackIndex]);

  // Se activa una sola vez cuando el sobre de la intro se abre — ese toque
  // cuenta como gesto del usuario, así que el navegador permite el autoplay.
  useEffect(() => {
    if (autoStart) setPlaying(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  if (!songs || songs.length === 0) return null;

  const toggle = () => setPlaying((p) => !p);

  const nextTrack = () => {
    setTrackIndex((i) => (i + 1) % songs.length);
    setPlaying(true);
  };

  return (
    <div style={{ position: "fixed", bottom: 18, right: 18, zIndex: 40 }}>
      <audio
        ref={audioRef}
        src={songs[trackIndex].src}
        onEnded={nextTrack}
        loop={songs.length === 1}
      />
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
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
