// Puente entre la página y las funciones serverless de Netlify.
//
// Detalle importante: con `npm run dev` (Vite solo) las funciones NO existen,
// así que cualquier llamada devuelve el index.html y falla. Para que el sitio
// se pueda probar igual en local, cada llamada tiene un respaldo en
// localStorage. En el sitio publicado en Netlify siempre gana el servidor.

const BASE = "/.netlify/functions";

// Guarda si ya sabemos que el servidor no responde, para no reintentar
// en cada interacción durante la misma sesión.
let servidorCaido = false;

async function pedir(ruta, opciones = {}) {
  const res = await fetch(`${BASE}/${ruta}`, opciones);

  // Si el redirect SPA se comió la llamada, llega HTML en vez de JSON.
  const tipo = res.headers.get("content-type") || "";
  if (!tipo.includes("application/json")) {
    throw new Error("La función no está disponible");
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || `Error ${res.status}`);
  }
  return data;
}

// --- Respaldo local -------------------------------------------------------

function leerLocal(clave) {
  try {
    const raw = window.localStorage.getItem(clave);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function guardarLocal(clave, items) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(items));
  } catch {
    // localStorage bloqueado (modo privado) — no rompemos nada.
  }
}

function idLocal() {
  return "local-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Ejecuta contra el servidor; si no está disponible, usa el respaldo local.
// Devuelve { data, local } para que la UI pueda avisar cuándo está offline.
async function conRespaldo(accionServidor, accionLocal) {
  if (servidorCaido) {
    return { data: accionLocal(), local: true };
  }
  try {
    return { data: await accionServidor(), local: false };
  } catch {
    servidorCaido = true;
    return { data: accionLocal(), local: true };
  }
}

// --- Notas ----------------------------------------------------------------

const CLAVE_NOTAS = "notas-respaldo";

export function listarNotas() {
  return conRespaldo(
    () => pedir("notes"),
    () => leerLocal(CLAVE_NOTAS),
  );
}

export function crearNota({ nombre = "Ximena", mensaje }) {
  return conRespaldo(
    async () => (await pedir("notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, mensaje }),
    })).nota,
    () => {
      const nota = { nombre, mensaje, fecha: new Date().toISOString() };
      guardarLocal(CLAVE_NOTAS, [nota, ...leerLocal(CLAVE_NOTAS)]);
      return nota;
    },
  );
}

// --- Vales ----------------------------------------------------------------

const CLAVE_VALES = "vales-respaldo";

export function listarVales() {
  return conRespaldo(
    () => pedir("vouchers"),
    () => leerLocal(CLAVE_VALES),
  );
}

export function crearVale({ text, autor = "Ximena" }) {
  return conRespaldo(
    async () => (await pedir("vouchers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, autor }),
    })).vale,
    () => {
      const vale = { id: idLocal(), text, autor, fecha: new Date().toISOString() };
      guardarLocal(CLAVE_VALES, [vale, ...leerLocal(CLAVE_VALES)]);
      return vale;
    },
  );
}

export function borrarVale(id) {
  return conRespaldo(
    () => pedir(`vouchers?id=${encodeURIComponent(id)}`, { method: "DELETE" }),
    () => {
      guardarLocal(CLAVE_VALES, leerLocal(CLAVE_VALES).filter((v) => v.id !== id));
      return { ok: true };
    },
  );
}

// Aviso por correo vía Netlify Forms. Es "extra": si falla, no debe impedir
// que la nota se guarde en el muro, por eso nunca lanza error.
export function avisarPorCorreo({ nombre, mensaje }) {
  const body = new URLSearchParams({ "form-name": "notas", nombre, mensaje }).toString();
  return fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  }).catch(() => {});
}
