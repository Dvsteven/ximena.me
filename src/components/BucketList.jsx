import { motion } from "framer-motion";
import { bucketList } from "../data/content";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function BucketList() {
  const [checked, setChecked] = useLocalStorage("bucket-checked", {});

  const toggle = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <section className="section" style={{ paddingTop: 10 }}>
      <p className="eyebrow" style={{ textAlign: "center" }}>{bucketList.eyebrow}</p>
      <h2 className="section-title" style={{ textAlign: "center" }}>{bucketList.title}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
        {bucketList.items.map((item, i) => {
          const done = !!checked[i];
          return (
            <motion.button
              key={i}
              onClick={() => toggle(i)}
              whileTap={{ scale: 0.98 }}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: `1.5px solid ${done ? "var(--accent)" : "var(--card-line)"}`,
                  background: done ? "var(--accent)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "#fff",
                  fontSize: 12,
                }}
              >
                {done ? "✓" : ""}
              </span>
              <span
                style={{
                  fontSize: 15,
                  color: done ? "var(--ink-faint)" : "var(--ink)",
                  textDecoration: done ? "line-through" : "none",
                }}
              >
                {item}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
