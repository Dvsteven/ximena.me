// Función serverless que guarda y lee las notas del "muro de mensajes".
// Usa Netlify Blobs (almacenamiento clave-valor incluido en Netlify, sin
// necesidad de crear cuenta en otro servicio ni configurar nada extra).
//
// GET  /.netlify/functions/notes  -> devuelve la lista de notas guardadas
// POST /.netlify/functions/notes  -> agrega una nota nueva { nombre, mensaje }

import { getStore } from "@netlify/blobs";

const STORE_NAME = "notas-ximena";
const KEY = "todas";
const MAX_NOTES = 200;
const MAX_LENGTH = 500;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Sin caché: si no, el navegador puede mostrar la lista vieja.
      "cache-control": "no-store",
    },
  });
}

export default async (req) => {
  // consistency: "strong" hace que justo después de guardar una nota, el
  // GET inmediato ya la devuelva. Sin esto la nota podía tardar unos
  // segundos en aparecer y parecía que no se había guardado.
  let store;
  try {
    store = getStore({ name: STORE_NAME, consistency: "strong" });
  } catch (err) {
    return json(
      { error: "Netlify Blobs no está disponible", detalle: String(err?.message || err) },
      500,
    );
  }

  try {
    if (req.method === "GET") {
      const notes = (await store.get(KEY, { type: "json" })) || [];
      return json(Array.isArray(notes) ? notes : []);
    }

    if (req.method === "POST") {
      let body;
      try {
        body = await req.json();
      } catch {
        return json({ error: "JSON inválido" }, 400);
      }

      const nombre = String(body.nombre || "Ximena").slice(0, 60);
      const mensaje = String(body.mensaje || "").trim().slice(0, MAX_LENGTH);

      if (!mensaje) {
        return json({ error: "El mensaje está vacío" }, 400);
      }

      const previas = (await store.get(KEY, { type: "json" })) || [];
      const notes = Array.isArray(previas) ? previas : [];

      const nota = { nombre, mensaje, fecha: new Date().toISOString() };
      notes.unshift(nota);

      await store.setJSON(KEY, notes.slice(0, MAX_NOTES));

      return json({ ok: true, nota });
    }

    return json({ error: "Método no permitido" }, 405);
  } catch (err) {
    return json({ error: "Error guardando la nota", detalle: String(err?.message || err) }, 500);
  }
};
