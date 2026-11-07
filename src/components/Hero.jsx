import { motion } from "framer-motion";
import { couple } from "../data/content";
import { settings } from "../data/settings";
import { useElapsedTime } from "../hooks/useElapsedTime";

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function Hero({ onPhotoTap }) {
  const stopped = Boolean(settings.counterEndDate);
  const t = useElapsedTime(couple.startDate, settings.counterEndDate);

  return (
    <section className="section" style={{ paddingTop: 64, textAlign: "center" }}>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ fontSize: 34, fontStyle: "italic" }}
      >
        {couple.nameA} <span style={{ color: "var(--accent)" }}>&</span> {couple.nameB}
      </motion.h1>

      <motion.button
        onClick={onPhotoTap}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Ver nuestra carta"
        style={{
          margin: "28px auto 0",
          padding: 10,
          background: "var(--card)",
          border: "1px solid var(--card-line)",
          borderRadius: 14,
          boxShadow: "var(--shadow-card)",
          display: "block",
          cursor: "pointer",
        }}
      >
        <img
          src={couple.heroPhoto}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{ width: 220, height: 260, objectFit: "cover", borderRadius: 8 }}
        />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="card"
        style={{ margin: "28px auto 0", padding: "18px 22px", display: "inline-block" }}
      >
        <p className="eyebrow" style={{ marginBottom: 4 }}>
          {stopped ? settings.counterLabelStopped : settings.counterLabelRunning}
        </p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 21, fontStyle: "italic" }}>
          {t.years} años, {t.months} meses y {t.days} días
        </p>
        {!stopped ? (
          <p style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "var(--ink-faint)", letterSpacing: "0.05em", marginTop: 4 }}>
            {pad(t.hours)}h {pad(t.minutes)}m {pad(t.seconds)}s
          </p>
        ) : (
          settings.counterStoppedNote && (
            <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontStyle: "italic", color: "var(--ink-faint)", marginTop: 8 }}>
              {settings.counterStoppedNote}
            </p>
          )
        )}
      </motion.div>

      <p style={{ marginTop: 14, fontSize: 12, color: "var(--ink-faint)", fontFamily: "var(--font-label)" }}>
        Toca la foto para leer algo
      </p>
    </section>
  );
}
