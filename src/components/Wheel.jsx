import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { wheel } from "../data/content";

const SEGMENT_COLORS = ["#A2314A", "#F3D9DC", "#D98A93", "#F7E9E2"];

function pickWeightedIndex(options) {
  const weights = options.map((o) => o.weight ?? 1);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return options.length - 1;
}

export default function Wheel() {
  const n = wheel.options.length;
  const segAngle = 360 / n;

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [resultIndex, setResultIndex] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const noArea = useRef(null);

  const gradient = useMemo(() => {
    const stops = [];
    for (let i = 0; i < n; i++) {
      const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
      stops.push(`${color} ${i * segAngle}deg ${(i + 1) * segAngle}deg`);
    }
    return `conic-gradient(${stops.join(", ")})`;
  }, [n, segAngle]);

  const spin = () => {
    if (spinning) return;
    setConfirmed(false);
    setResultIndex(null);
    setSpinning(true);

    const idx = pickWeightedIndex(wheel.options);
    const centerAngle = idx * segAngle + segAngle / 2;
    const targetMod = (360 - centerAngle + 360) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const deltaToAdd = (targetMod - currentMod + 360) % 360;
    const fullSpins = 5 * 360;
    const next = rotation + fullSpins + deltaToAdd;

    setRotation(next);
    window.setTimeout(() => {
      setSpinning(false);
      setResultIndex(idx);
    }, 3200);
  };

  const dodgeNo = () => {
    const range = noArea.current;
    const maxX = range ? range.offsetWidth * 0.28 : 55;
    const maxY = 18;
    const x = (Math.random() * 2 - 1) * maxX;
    const y = (Math.random() * 2 - 1) * maxY;
    setNoOffset({ x, y });
  };

  const resultLabel = resultIndex !== null ? wheel.options[resultIndex].label : "";
  const question = wheel.questionTemplate.replace("{opcion}", resultLabel);
  const confirmedSubtitle = wheel.confirmedSubtitle.replace("{opcion}", resultLabel);

  return (
    <section className="section" style={{ paddingTop: 10, textAlign: "center" }}>
      <p className="eyebrow">{wheel.eyebrow}</p>
      <h2 className="section-title" style={{ fontSize: 22 }}>{wheel.title}</h2>
      <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 24 }}>{wheel.subtitle}</p>

      <div style={{ position: "relative", width: 240, height: 240, margin: "0 auto" }}>
        {/* Puntero */}
        <div
          style={{
            position: "absolute",
            top: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderTop: "16px solid var(--accent)",
            zIndex: 2,
          }}
        />
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3.2, ease: [0.15, 0.7, 0.2, 1] }}
          style={{
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: gradient,
            border: "6px solid var(--card)",
            boxShadow: "var(--shadow-card)",
            position: "relative",
          }}
        >
          {wheel.options.map((o, i) => {
            const mid = i * segAngle + segAngle / 2;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 0,
                  height: 0,
                  transform: `rotate(${mid}deg)`,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: -92,
                    transform: "translateX(-50%)",
                    fontFamily: "var(--font-label)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: i % SEGMENT_COLORS.length === 1 || i % SEGMENT_COLORS.length === 3 ? "var(--ink)" : "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {o.label}
                </span>
              </div>
            );
          })}
        </motion.div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent)",
              fontSize: 16,
              boxShadow: "var(--shadow-soft)",
            }}
          >
            ♥
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={spin}
        disabled={spinning}
        style={{
          marginTop: 24,
          background: "var(--accent)",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "12px 32px",
          borderRadius: 30,
          opacity: spinning ? 0.6 : 1,
        }}
      >
        Girar
      </motion.button>
      <p style={{ marginTop: 8, fontSize: 12, color: "var(--ink-faint)" }}>
        Puedes girar las veces que quieras 💫
      </p>

      {resultIndex !== null && !spinning && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: 26 }}
        >
          {!confirmed ? (
            <>
              <p className="eyebrow">La ruleta decidió</p>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, marginBottom: 18 }}>
                {question}
              </p>
              <div
                ref={noArea}
                style={{
                  position: "relative",
                  display: "flex",
                  gap: 14,
                  justifyContent: "center",
                  height: 60,
                  alignItems: "center",
                }}
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConfirmed(true)}
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 13,
                    padding: "10px 26px",
                    borderRadius: 24,
                  }}
                >
                  Sí
                </motion.button>
                <motion.button
                  onMouseEnter={dodgeNo}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    dodgeNo();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    dodgeNo();
                  }}
                  onClick={dodgeNo}
                  animate={{ x: noOffset.x, y: noOffset.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                  style={{
                    background: "transparent",
                    color: "var(--ink-soft)",
                    fontSize: 13,
                    padding: "10px 22px",
                    borderRadius: 24,
                    border: "1px solid var(--card-line)",
                  }}
                >
                  No
                </motion.button>
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <p style={{ fontSize: 22, color: "var(--accent)" }}>♥</p>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 24, marginTop: 6 }}>
                {wheel.confirmedTitle}
              </p>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 4 }}>{confirmedSubtitle}</p>
            </motion.div>
          )}
          <button
            onClick={() => {
              setResultIndex(null);
              setConfirmed(false);
            }}
            style={{
              marginTop: 18,
              fontSize: 12,
              color: "var(--ink-faint)",
              textDecoration: "underline",
            }}
          >
            ○ girar de nuevo
          </button>
        </motion.div>
      )}
    </section>
  );
}
