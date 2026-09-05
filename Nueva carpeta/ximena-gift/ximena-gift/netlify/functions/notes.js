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

export default async (req) => {
  const store = getStore(STORE_NAME);

  if (req.method === "GET") {
    const notes = (await store.get(KEY, { type: "json" })) || [];
    return Response.json(notes);
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response("JSON inválido", { status: 400 });
    }

    const nombre = String(body.nombre || "Ximena").slice(0, 60);
    const mensaje = String(body.mensaje || "").trim().slice(0, MAX_LENGTH);

    if (!mensaje) {
      return new Response("El mensaje está vacío", { status: 400 });
    }

    const notes = (await store.get(KEY, { type: "json" })) || [];
    notes.unshift({
      nombre,
      mensaje,
      fecha: new Date().toISOString(),
    });

    await store.setJSON(KEY, notes.slice(0, MAX_NOTES));

    return Response.json({ ok: true });
  }

  return new Response("Método no permitido", { status: 405 });
};
