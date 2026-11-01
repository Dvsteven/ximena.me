// ============================================================================
// AJUSTES DEL SITIO (separados de content.js para no pisar tu contenido).
// ============================================================================

export const settings = {
  // --- Contador de portada -------------------------------------------------
  // Fecha en que el contador se detiene. Ponla en formato
  // "AAAA-MM-DDTHH:mm:ss-05:00" (el -05:00 es la hora de Colombia).
  // Para que vuelva a correr en vivo, déjala en null.
  counterEndDate: "2026-11-01T09:30:00-05:00",
  counterLabelRunning: "Juntos desde hace",
  counterLabelStopped: "Estuvimos juntos",

  // --- Filtro de color para todo el sitio ----------------------------------
  // "sepia" | "grayscale" (blanco y negro) | "none" (sin filtro)
  siteFilter: "sepia",

  // --- Mensajes de lado a lado ---------------------------------------------
  // Pon false para ocultar toda la sección de mensajes.
  showNotes: true,
  people: {
    ximena: "Ximena",
    steven: "Steven",
  },
  identityPrompt: "¿Desde qué dispositivo estás escribiendo?",
  identityHint: "Se pregunta una sola vez en cada dispositivo.",
};
