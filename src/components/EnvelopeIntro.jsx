import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { couple, intro } from "../data/content";

// Posiciones fijas de los corazones flotantes de fondo (precalculadas para
// que no cambien en cada render). left/top en %, tamaño en px, y un retraso
// distinto para que no floten todos sincronizados.
const HEARTS = [
  { left: "10%", top: "18%", size: 14, delay: 0 },
  { left: "82%", top: "12%", size: 10, delay: 0.6 },
  { left: "70%", top: "30%", size: 16, delay: 1.2 },
  { left: "18%", top: "62%", size: 12, delay: 0.3 },
  { left: "88%", top: "68%", size: 14, delay: 1.6 },
  { left: "8%", top: "82%", size: 10, delay: 0.9 },
  { left: "50%", top: "8%", size: 11, delay: 2.0 },
  { left: "40%", top: "88%", size: 13, delay: 0.4 },
  { left: "95%", top: "45%", size: 9, delay: 1.4 },
];

export default function EnvelopeIntro({ onOpen }) {
  const [phase, setPhase] = useState("closed"); // closed -> opening -> gone
  const name = couple.nameB;

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    window.setTimeout(() => {
      onOpen?.();
      setPhase("gone");
    }, 1050);
  };

  const envelopeVariants = useMemo(
    () => ({
      idle: { y: 0, scale: 1, opacity: 1 },
      opening: { y: -26, scale: 1.06, opacity: 0, transition: { duration: 0.55, ease: "easeIn", delay: 0.18 } },
    }),
    []
  );

  if (phase === "gone") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="envelope-intro"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, delay: phase === "opening" ? 0.55 : 0 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background:
            "radial-gradient(circle at 50% 30%, #2c2768 0%, #1c1a44 55%, #121030 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Corazones flotantes de fondo */}
        {HEARTS.map((h, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -14, 0], opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: h.delay, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: h.left,
              top: h.top,
              fontSize: h.size,
              color: "#E3B65C",
              pointerEvents: "none",
            }}
          >
            ♥
          </motion.span>
        ))}

        {/* Glow al abrir */}
        <AnimatePresence>
          {phase === "opening" && (
            <motion.div
              initial={{ opacity: 0.7, scale: 0.3 }}
              animate={{ opacity: 0, scale: 3.2 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(227,182,92,0.9) 0%, rgba(227,182,92,0) 70%)",
              }}
            />
          )}
        </AnimatePresence>

        <motion.p
          animate={{ opacity: phase === "opening" ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "var(--font-label)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#B9AEDD",
            marginBottom: 10,
          }}
        >
          {intro.eyebrow}
        </motion.p>

        <motion.h1
          animate={{ opacity: phase === "opening" ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 40,
            color: "#E3B65C",
            marginBottom: 34,
          }}
        >
          {name}
        </motion.h1>

        {/* Sobre */}
        <motion.button
          onClick={handleOpen}
          aria-label={intro.buttonLabel}
          variants={envelopeVariants}
          animate={phase === "opening" ? "opening" : "idle"}
          whileTap={phase === "closed" ? { scale: 0.97 } : {}}
          style={{
            position: "relative",
            width: 220,
            height: 148,
            borderRadius: 14,
            cursor: "pointer",
            boxShadow: "0 24px 50px -18px rgba(0,0,0,0.6)",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 14,
              overflow: "hidden",
              background:
                "conic-gradient(from -45deg at 50% 50%, #EDCB7C 0deg 90deg, #C9922E 90deg 180deg, #B87F26 180deg 270deg, #D9A441 270deg 360deg)",
            }}
          />
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 14,
              background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%)",
              pointerEvents: "none",
            }}
          />
          {/* Sello */}
          <motion.span
            animate={{
              scale: phase === "opening" ? 0.25 : 1,
              opacity: phase === "opening" ? 0 : 1,
            }}
            transition={{ duration: 0.28 }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #FFF8E8, #F0DDA6 70%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
            }}
          >
            {/* SVG en vez del carácter "♥": el glifo de texto nunca queda
                ópticamente centrado (la métrica de la fuente le deja aire
                de sobra abajo), un path a medida sí se centra de verdad. */}
            <svg width="18" height="16" viewBox="0 0 32 29" fill="#C9922E">
              <path d="M16,29 C16,29 4,20.5 4,12.5 C4,7.8 7.8,4 12.4,4 C14.5,4 16,5.6 16,5.6 C16,5.6 17.5,4 19.6,4 C24.2,4 28,7.8 28,12.5 C28,20.5 16,29 16,29 Z" />
            </svg>
          </motion.span>
        </motion.button>

        <motion.button
          onClick={handleOpen}
          animate={{ opacity: phase === "opening" ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            marginTop: 30,
            padding: "12px 26px",
            borderRadius: 24,
            background: "rgba(227,182,92,0.14)",
            border: "1px solid rgba(227,182,92,0.5)",
            color: "#E3B65C",
            fontFamily: "var(--font-label)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
          }}
        >
          {intro.buttonLabel}
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
