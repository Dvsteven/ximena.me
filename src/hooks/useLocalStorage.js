import { useEffect, useState } from "react";

// Estado persistido en localStorage (sobrevive a recargas de página,
// pero es local a cada navegador/dispositivo).
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage no disponible (modo privado, etc.) — no pasa nada.
    }
  }, [key, value]);

  return [value, setValue];
}
