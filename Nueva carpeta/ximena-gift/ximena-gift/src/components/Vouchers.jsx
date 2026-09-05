import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { vouchers } from "../data/content";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Vouchers() {
  const [redeemed, setRedeemed] = useLocalStorage("vouchers-redeemed", {});

  const redeem = (id, e) => {
    if (redeemed[id]) return;
    setRedeemed((prev) => ({ ...prev, [id]: true }));

    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 60,
      spread: 55,
      startVelocity: 28,
      colors: ["#A2314A", "#D98A93", "#C9A15A"],
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
    });
  };

  return (
    <section className="section" style={{ paddingTop: 10 }}>
      <h2 className="section-title" style={{ textAlign: "center" }}>{vouchers.title}</h2>
      <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink-soft)", marginTop: -10, marginBottom: 20 }}>
        {vouchers.subtitle}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {vouchers.items.map((v) => {
          const done = !!redeemed[v.id];
          return (
            <div
              key={v.id}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                opacity: done ? 0.55 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "var(--accent)", fontSize: 16 }}>♥</span>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 2, fontSize: 9 }}>Vale</p>
                  <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16 }}>
                    {v.text}
                  </p>
                </div>
              </div>

              {done ? (
                <span style={{ fontSize: 11, color: "var(--ink-faint)", fontFamily: "var(--font-label)" }}>
                  Usado
                </span>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={(e) => redeem(v.id, e)}
                  style={{
                    background: "var(--accent-soft)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "8px 14px",
                    borderRadius: 20,
                    flexShrink: 0,
                  }}
                >
                  Canjear
                </motion.button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
