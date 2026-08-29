import { motion } from "framer-motion";
import { qualities } from "../data/content";

export default function Qualities() {
  return (
    <section className="section" style={{ paddingTop: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="card"
        style={{ padding: "26px 24px" }}
      >
        <h2 style={{ fontSize: 20, fontStyle: "italic", marginBottom: 16 }}>
          {qualities.title}
        </h2>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {qualities.items.map((q, i) => (
            <li
              key={i}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "var(--ink)",
                display: "flex",
                gap: 10,
              }}
            >
              <span style={{ color: "var(--accent-soft)" }}>✦</span>
              {q}
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
