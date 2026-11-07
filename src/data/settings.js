// ============================================================================
// AJUSTES DEL SITIO (separados de content.js para no pisar tu contenido).
// ============================================================================

export const settings = {
  // --- Contador de portada -------------------------------------------------
  // Fecha en que el contador se detiene. Ponla en formato
  // "AAAA-MM-DDTHH:mm:ss-05:00" (el -05:00 es la hora de Colombia).
  // Para que vuelva a correr en vivo, déjala en null.
  counterEndDate: "2026-11-02T20:00:00-05:00",
  counterLabelRunning: "Juntos desde hace",
  counterLabelStopped: "Estuvimos juntos",
  // Frase bajo el contador cuando está detenido (null para quitarla).
  counterStoppedNote: "Se acabó.",

  // --- Filtro de color para todo el sitio ----------------------------------
  // "sepia" | "grayscale" (blanco y negro) | "none" (sin filtro)
  siteFilter: "grayscale",

  // --- Mensajes de lado a lado ---------------------------------------------
  // Pon false para ocultar toda la sección de mensajes.
  showNotes: false,
  // Secciones interactivas que ya no tienen sentido (true para mostrarlas).
  showVouchers: false,
  showWheel: false,
  people: {
    ximena: "Ximena",
    steven: "Steven",
  },
  identityPrompt: "¿Desde qué dispositivo estás escribiendo?",
  identityHint: "Se pregunta una sola vez en cada dispositivo.",
};
