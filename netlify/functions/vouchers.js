// Función serverless para los vales que Ximena agrega desde la página.
// Los vales "de fábrica" siguen viviendo en src/data/content.js; estos son
// los que ella crea, y se guardan compartidos (los ves tú también).
//
// GET    /.netlify/functions/vouchers          -> lista de vales agregados
// POST   /.netlify/functions/vouchers          -> agrega uno { text, autor }
// DELETE /.netlify/functions/vouchers?id=xxx   -> borra uno

import { getStore } from "@netlify/blobs";

const STORE_NAME = "vales-ximena";
const KEY = "personalizados";
const MAX_ITEMS = 100;
const MAX_LENGTH = 120;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function nuevoId() {
  return "vale-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export default async (req) => {
  // "strong": lo que se acaba de guardar se lee de inmediato.
  let store;
  try {
    store = getStore({ name: STORE_NAME, consistency: "strong" });
  } catch (err) {
    return json(
      { error: "Netlify Blobs no está disponible", detalle: String(err?.message || err) },
      500,
    );
  }

  const leer = async () => {
    const data = (await store.get(KEY, { type: "json" })) || [];
    return Array.isArray(data) ? data : [];
  };

  try {
    if (req.method === "GET") {
      return json(await leer());
    }

    if (req.method === "POST") {
      let body;
      try {
        body = await req.json();
      } catch {
        return json({ error: "JSON inválido" }, 400);
      }

      const text = String(body.text || "").trim().slice(0, MAX_LENGTH);
      const autor = String(body.autor || "Ximena").slice(0, 60);

      if (!text) {
        return json({ error: "El vale está vacío" }, 400);
      }

      const items = await leer();
      const vale = { id: nuevoId(), text, autor, fecha: new Date().toISOString() };
      items.unshift(vale);

      await store.setJSON(KEY, items.slice(0, MAX_ITEMS));

      return json({ ok: true, vale });
    }

    if (req.method === "DELETE") {
      const id = new URL(req.url).searchParams.get("id");
      if (!id) return json({ error: "Falta el id" }, 400);

      const items = await leer();
      await store.setJSON(KEY, items.filter((v) => v.id !== id));

      return json({ ok: true });
    }

    return json({ error: "Método no permitido" }, 405);
  } catch (err) {
    return json({ error: "Error en el servidor", detalle: String(err?.message || err) }, 500);
  }
};
