import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { notesWall } from "../data/content";
import { avisarPorCorreo, crearNota, listarNotas } from "../lib/api";

export default function NotesWall() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let vivo = true;
    listarNotas()
      .then(({ data }) => {
        if (vivo) setNotes(data);
      })
      .finally(() => {
        if (vivo) setLoading(false);
      });
    return () => {
      vivo = false;
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const mensaje = message.trim();
    if (!mensaje || sending) return;

    setSending(true);
    setError("");

    try {
      // El aviso por correo va aparte y no bloquea: si Netlify Forms no
      // está activo, la nota igual se guarda en el muro.
      avisarPorCorreo({ nombre: "Ximena", mensaje });

      const { data: nota } = await crearNota({ nombre: "Ximena", mensaje });

      // La agregamos de una vez a la lista en pantalla, sin esperar a
      // recargar todo desde el servidor.
      setNotes((prev) => [nota, ...prev]);
      setMessage("");
      setSent(true);
      window.setTimeout(() => setSent(false), 2500);
    } catch (err) {
      setError(err?.message || "No se pudo guardar la nota. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section" style={{ paddingTop: 10 }}>
      <p className="eyebrow" style={{ textAlign: "center" }}>{notesWall.eyebrow}</p>
      <h2 className="section-title" style={{ textAlign: "center" }}>{notesWall.title}</h2>
      <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink-soft)", marginBottom: 20 }}>
        {notesWall.subtitle}
      </p>

      <form onSubmit={submit} className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={notesWall.placeholder}
          rows={3}
          maxLength={500}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            padding: 12,
            borderRadius: 10,
            border: "1px solid var(--card-line)",
            resize: "none",
            background: "#fff",
          }}
        />

        {error && (
          <p style={{ fontSize: 12, color: "var(--accent)", margin: 0 }}>{error}</p>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={sending || !message.trim()}
          style={{
            alignSelf: "flex-end",
            background: "var(--accent)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "10px 22px",
            borderRadius: 22,
            opacity: sending || !message.trim() ? 0.55 : 1,
          }}
        >
          {sending ? "Enviando..." : sent ? "Enviado ♥" : notesWall.buttonLabel}
        </motion.button>
      </form>

      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        {!loading && notes.length === 0 && (
          <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink-faint)" }}>
            {notesWall.emptyState}
          </p>
        )}
        {notes.map((n, i) => (
          <motion.div
            key={`${n.fecha}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
            className="card"
            style={{ padding: "12px 16px" }}
          >
            <p style={{ fontSize: 14, color: "var(--ink)" }}>{n.mensaje}</p>
            <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 6, fontFamily: "var(--font-label)" }}>
              {n.nombre} · {new Date(n.fecha).toLocaleDateString("es", { day: "numeric", month: "short" })}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
