import { AnimatePresence, motion } from "framer-motion";
import { loveNote } from "../data/content";

export default function LoveNoteModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(42, 33, 29, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 28,
            zIndex: 50,
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="card"
            style={{ padding: "34px 26px", maxWidth: 340, textAlign: "center" }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 19,
                lineHeight: 1.55,
                color: "var(--ink)",
              }}
            >
              {loveNote.text}
            </p>
            <div className="heart-divider" style={{ margin: "20px 0 10px" }} />
            <p className="eyebrow" style={{ marginBottom: 2 }}>Con amor</p>
            <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18 }}>
              {loveNote.signature}
            </p>
            <button
              onClick={onClose}
              style={{
                marginTop: 22,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
                fontWeight: 600,
                padding: "8px 18px",
                border: "1px solid var(--card-line)",
                borderRadius: 20,
              }}
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
