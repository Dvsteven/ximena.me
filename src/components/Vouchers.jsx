import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { vouchers } from "../data/content";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { borrarVale, crearVale, listarVales } from "../lib/api";

export default function Vouchers() {
  // Cuáles ya se canjearon: sigue siendo local a cada navegador.
  const [redeemed, setRedeemed] = useLocalStorage("vouchers-redeemed", {});
  // Vales que agrega Ximena desde la página: compartidos (Netlify Blobs).
  const [custom, setCustom] = useState([]);
  const [adding, setAdding] = useState(false);
  const [nuevo, setNuevo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let vivo = true;
    listarVales().then(({ data }) => {
      if (vivo) setCustom(data);
    });
    return () => {
      vivo = false;
    };
  }, []);

  const lanzarConfetti = (el) => {
    const rect = el.getBoundingClientRect();
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

  const redeem = (id, e) => {
    if (redeemed[id]) return;
    setRedeemed((prev) => ({ ...prev, [id]: true }));
    lanzarConfetti(e.currentTarget);
  };

  const agregar = async (e) => {
    e.preventDefault();
    const text = nuevo.trim();
    if (!text || guardando) return;

    setGuardando(true);
    setError("");
    try {
      const { data: vale } = await crearVale({ text });
      setCustom((prev) => [vale, ...prev]);
      setNuevo("");
      setAdding(false);
    } catch (err) {
      setError(err?.message || "No se pudo guardar el vale.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id) => {
    // Optimista: desaparece de una vez y se sincroniza en segundo plano.
    const previos = custom;
    setCustom((prev) => prev.filter((v) => v.id !== id));
    try {
      await borrarVale(id);
    } catch {
      setCustom(previos);
    }
  };

  // Los agregados van primero para que se vean apenas se crean.
  const items = [
    ...custom.map((v) => ({ ...v, esPersonalizado: true })),
    ...vouchers.items.map((v) => ({ ...v, esPersonalizado: false })),
  ];

  return (
    <section className="section" style={{ paddingTop: 10 }}>
      <h2 className="section-title" style={{ textAlign: "center" }}>{vouchers.title}</h2>
      <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink-soft)", marginTop: -10, marginBottom: 20 }}>
        {vouchers.subtitle}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <AnimatePresence initial={false}>
          {items.map((v) => {
            const done = !!redeemed[v.id];
            return (
              <motion.div
                key={v.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: done ? 0.55 : 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: -10 }}
                transition={{ duration: 0.25 }}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <span style={{ color: "var(--accent)", fontSize: 16 }}>♥</span>
                  <div style={{ minWidth: 0 }}>
                    <p className="eyebrow" style={{ marginBottom: 2, fontSize: 9 }}>
                      {v.esPersonalizado ? "Vale nuevo" : "Vale"}
                    </p>
                    <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16 }}>
                      {v.text}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
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
                      }}
                    >
                      Canjear
                    </motion.button>
                  )}

                  {v.esPersonalizado && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => eliminar(v.id)}
                      aria-label="Borrar este vale"
                      style={{
                        background: "transparent",
                        color: "var(--ink-faint)",
                        fontSize: 16,
                        lineHeight: 1,
                        padding: "6px 4px",
                      }}
                    >
                      ×
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Agregar un vale nuevo */}
      <div style={{ marginTop: 14 }}>
        <AnimatePresence mode="wait" initial={false}>
          {adding ? (
            <motion.form
              key="form"
              onSubmit={agregar}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card"
              style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}
            >
              <input
                autoFocus
                value={nuevo}
                onChange={(e) => setNuevo(e.target.value)}
                placeholder={vouchers.addPlaceholder}
                maxLength={120}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid var(--card-line)",
                  background: "#fff",
                  width: "100%",
                }}
              />

              {error && <p style={{ fontSize: 12, color: "var(--accent)", margin: 0 }}>{error}</p>}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    setNuevo("");
                    setError("");
                  }}
                  style={{
                    background: "transparent",
                    color: "var(--ink-soft)",
                    fontSize: 12,
                    fontFamily: "var(--font-label)",
                    padding: "10px 14px",
                  }}
                >
                  Cancelar
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={guardando || !nuevo.trim()}
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "10px 22px",
                    borderRadius: 22,
                    opacity: guardando || !nuevo.trim() ? 0.55 : 1,
                  }}
                >
                  {guardando ? "Guardando..." : "Agregar"}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              key="boton"
              whileTap={{ scale: 0.98 }}
              onClick={() => setAdding(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                width: "100%",
                background: "transparent",
                border: "1px dashed var(--card-line)",
                borderRadius: 14,
                padding: "14px 16px",
                color: "var(--accent)",
                fontFamily: "var(--font-label)",
                fontSize: 12,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              + {vouchers.addLabel}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
