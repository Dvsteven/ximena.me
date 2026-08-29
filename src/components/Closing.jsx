import { motion } from "framer-motion";
import { closing } from "../data/content";

export default function Closing() {
  return (
    <section className="section" style={{ textAlign: "center", paddingBottom: 90 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
      >
        <div
          style={{
            display: "inline-block",
            background: "var(--card)",
            padding: 10,
            paddingBottom: 22,
            borderRadius: 4,
            boxShadow: "var(--shadow-card)",
          }}
        >
          <img
            src={closing.photo}
            alt=""
            style={{ width: 210, height: 240, objectFit: "cover", borderRadius: 2 }}
          />
        </div>

        <p
          style={{
            marginTop: 26,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 20,
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {closing.message}
        </p>

        <div className="heart-divider" style={{ margin: "20px 0 10px" }} />
        <p className="eyebrow">Con cariño</p>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18 }}>
          {closing.signature}
        </p>

        <p style={{ marginTop: 22, fontSize: 12, color: "var(--ink-faint)", letterSpacing: "0.05em" }}>
          ♥ {closing.footer} ♥
        </p>
      </motion.div>
    </section>
  );
}
