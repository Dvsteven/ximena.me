import { motion } from "framer-motion";
import { timeline } from "../data/content";

function Polaroid({ item, index }) {
  const rotate = index % 2 === 0 ? -3 : 3;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        background: "var(--card)",
        padding: 10,
        paddingBottom: 26,
        borderRadius: 4,
        boxShadow: "var(--shadow-card)",
        width: 210,
        margin: "0 auto 34px",
      }}
    >
      {item.type === "video" ? (
        <video
          src={item.src}
          controls
          playsInline
          preload="metadata"
          style={{ width: "100%", height: 230, objectFit: "cover", borderRadius: 2, background: "#000" }}
        />
      ) : (
        <img
          src={item.src}
          alt=""
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          style={{ width: "100%", height: 230, objectFit: "cover", borderRadius: 2 }}
        />
      )}
      {item.caption && (
        <p
          style={{
            marginTop: 10,
            textAlign: "center",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 14,
            color: "var(--ink-soft)",
          }}
        >
          {item.caption}
        </p>
      )}
    </motion.div>
  );
}

export default function Timeline() {
  return (
    <section className="section" style={{ paddingTop: 10, paddingBottom: 10 }}>
      {timeline.map((item, i) => (
        <Polaroid key={i} item={item} index={i} />
      ))}
    </section>
  );
}
