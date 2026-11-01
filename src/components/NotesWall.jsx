import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { notesWall } from "../data/content";
import { settings } from "../data/settings";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { avisarPorCorreo, crearNota, listarNotas } from "../lib/api";

const POLL_MS = 20000;

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("es", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

// Cada dispositivo guarda quién es. Así el mensaje sale firmado por quien
// realmente lo escribió, y el aviso por correo va hacia la otra persona.
function IdentityPicker({ onPick }) {
  return (
    <div className="card" style={{ padding: 20, textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 19 }}>
        {settings.identityPrompt}
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
        {Object.entries(settings.people).map(([key, name]) => (
          <motion.button
            key={key}
            whileTap={{ scale: 0.96 }}
            onClick={() => onPick(key)}
            style={{
              background: "var(--accent)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "11px 22px",
              borderRadius: 22,
            }}
          >
            Soy {name}
          </motion.button>
        ))}
      </div>
      <p style={{ marginTop: 12, fontSize: 12, color: "var(--ink-faint)" }}>{settings.identityHint}</p>
    </div>
  );
}

export default function NotesWall() {
  const [identity, setIdentity] = useLocalStorage("notes-identity", null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);

  const cargar = useCallback(async () => {
    try {
      const { data } = await listarNotas();
      setNotes(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    // Refresca solo para que lo que escribe la otra persona aparezca sin recargar.
    const id = setInterval(() => {
      if (document.visibilityState === "visible") cargar();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [cargar]);

  // El servidor devuelve lo más nuevo primero; el chat se lee de arriba a abajo.
  const ordered = [...notes].reverse();

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [notes.length, identity]);

  const submit = async (e) => {
    e.preventDefault();
    const mensaje = message.trim();
    if (!mensaje || sending || !identity) return;

    setSending(true);
    setError("");

    try {
      // El aviso por correo va aparte y no bloquea: si Netlify Forms no
      // está activo, el mensaje igual se guarda.
      avisarPorCorreo({ autor: identity, mensaje });

      const { data: nota } = await crearNota({ autor: identity, mensaje });

      setNotes((prev) => [nota, ...prev]);
      setMessage("");
      setSent(true);
      window.setTimeout(() => setSent(false), 2500);
    } catch (err) {
      setError(err?.message || "No se pudo guardar el mensaje. Intenta de nuevo.");
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

      {!identity ? (
        <IdentityPicker onPick={setIdentity} />
      ) : (
        <>
          <div
            ref={listRef}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              maxHeight: 360,
              overflowY: "auto",
              padding: "4px 2px 8px",
            }}
          >
            {!loading && ordered.length === 0 && (
              <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink-faint)" }}>
                {notesWall.emptyState}
              </p>
            )}
            {ordered.map((n, i) => {
              const mine = Boolean(n.autor) && n.autor === identity;
              const name = (n.autor && settings.people[n.autor]) || n.nombre || "";
              return (
                <motion.div
                  key={`${n.fecha}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    alignSelf: mine ? "flex-end" : "flex-start",
                    maxWidth: "82%",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      background: mine ? "var(--accent)" : "var(--card)",
                      color: mine ? "#fff" : "var(--ink)",
                      border: mine ? "none" : "1px solid var(--card-line)",
                      borderRadius: 16,
                      borderBottomRightRadius: mine ? 4 : 16,
                      borderBottomLeftRadius: mine ? 16 : 4,
                      padding: "10px 14px",
                      fontSize: 14,
                      lineHeight: 1.45,
                      boxShadow: "var(--shadow-soft)",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {n.mensaje}
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--ink-faint)",
                      marginTop: 4,
                      fontFamily: "var(--font-label)",
                      textAlign: mine ? "right" : "left",
                    }}
                  >
                    {mine ? "Tú" : name} · {formatDate(n.fecha)}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <form onSubmit={submit} className="card" style={{ padding: 14, marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={notesWall.placeholder}
              rows={2}
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

            {error && <p style={{ fontSize: 12, color: "var(--accent)", margin: 0 }}>{error}</p>}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={() => setIdentity(null)}
                style={{ fontSize: 11, color: "var(--ink-faint)", textDecoration: "underline" }}
              >
                Escribiendo como {settings.people[identity]} · cambiar
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={sending || !message.trim()}
                style={{
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
            </div>
          </form>
        </>
      )}
    </section>
  );
}
