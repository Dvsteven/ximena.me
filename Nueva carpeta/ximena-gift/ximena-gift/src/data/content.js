// ============================================================================
// CONTENIDO DEL SITIO — este es el ÚNICO archivo que necesitas tocar.
// Cambia textos, fechas, fotos, rutas, etc. aquí. El resto del código lee
// todo desde este archivo, así que no hace falta tocar los componentes.
//
// Las fotos van en /public/photos/  → referencia como "/photos/nombre.jpg"
// Las canciones van en /public/audio/ → referencia como "/audio/nombre.mp3"
// ============================================================================

export const couple = {
  nameA: "Valentina",
  nameB: "Mateo",
  // Fecha y hora en que empezó la relación (se usa para el contador en vivo).
  // Formato: "AAAA-MM-DDTHH:mm:ss"
  startDate: "2023-06-04T18:00:00",
  heroPhoto: "/photos/hero.jpg",
};

// Pantalla de apertura (sobre) que se ve ANTES de entrar al sitio.
// El nombre que aparece es couple.nameB (la persona que recibe el regalo).
export const intro = {
  eyebrow: "Un regalo para ti",
  buttonLabel: "Toca para abrir",
};

export const loveNote = {
  text: "Te amo de una forma que no cabe en palabras. Eres mi hogar, mi sonrisa, mi persona favorita en el mundo entero.",
  signature: couple.nameA,
};

// Línea de tiempo: mezcla fotos y videos en el orden que quieras.
// type: "photo" | "video"
export const timeline = [
  { type: "photo", src: "/photos/momento-1.jpg", caption: "" },
  { type: "video", src: "/photos/momento-2.mp4", caption: "" },
  { type: "photo", src: "/photos/momento-3.jpg", caption: "" },
  { type: "photo", src: "/photos/momento-4.jpg", caption: "" },
];

export const qualities = {
  title: `Lo que más amo de ${couple.nameB}`,
  items: [
    "Tu sonrisa boba por la mañana",
    "Tu valentía para seguir tus sueños",
    "Tu forma de cuidar a los demás",
    "Tu paciencia infinita conmigo",
    "Tu mirada cuando te concentras",
    "Tu abrazo fuerte",
  ],
};

// Lugares importantes. lat/lng en formato decimal (los sacas de Google Maps:
// clic derecho sobre el punto → aparecen las coordenadas para copiar).
export const places = {
  eyebrow: "Dónde empezó todo",
  title: "Nuestros lugares",
  centerLat: 13.6929,
  centerLng: -89.2182,
  zoom: 12,
  pins: [
    { name: "Donde nos conocimos", lat: 13.6929, lng: -89.2182 },
    { name: "Nuestra primera cita", lat: 13.7000, lng: -89.2100 },
    { name: "La propuesta", lat: 13.6850, lng: -89.2250 },
  ],
};

export const bucketList = {
  eyebrow: "Cosas que quiero hacer contigo",
  title: "Nuestra lista",
  items: [
    "Viajar juntos",
    "Ver el amanecer",
    "Una escapada de fin de semana",
    "Un concierto",
    "Cocinar juntos",
  ],
};

// Vales de amor. Cada uno se puede canjear UNA sola vez (queda guardado
// en el navegador de quien lo canjea).
export const vouchers = {
  title: "Nuestros vales de amor",
  subtitle: "Canjéalo cuando quieras. Pero solo se puede usar una vez.",
  items: [
    { id: "beso", text: "Vale por un beso" },
    { id: "masaje", text: "Vale por un masaje" },
    { id: "pelicula", text: "Vale por la película que elijas" },
    { id: "desayuno", text: "Vale por desayuno en la cama" },
    { id: "sin-telefono", text: "Vale por una noche sin teléfono" },
    { id: "viaje-sorpresa", text: "Vale por un viaje sorpresa" },
    { id: "maraton", text: "Vale por un maratón de series" },
    { id: "abrazados", text: "Vale por dormir abrazados" },
  ],
};

// Ruleta de la próxima cita. "weight" es opcional (por defecto todas
// tienen la misma probabilidad); súbelo para que una opción caiga más.
export const wheel = {
  eyebrow: "Para ti",
  title: "La ruleta tiene una pregunta",
  subtitle: "Gira... y responde con el corazón",
  options: [
    { label: "Sorpresa", weight: 1 },
    { label: "Cena", weight: 1 },
    { label: "Baile", weight: 1 },
    { label: "Cine", weight: 1 },
    { label: "Aventura", weight: 1 },
    { label: "Foto", weight: 1 },
  ],
  // Plantilla de la pregunta final. {opcion} se reemplaza por el resultado.
  questionTemplate: "¿{opcion} juntos?",
  confirmedTitle: "¡Es una cita!",
  confirmedSubtitle: "Un plan: {opcion}",
};

// Canciones que suenan en bucle (playlist, en el orden que quieras).
export const playlist = {
  songs: [
    { title: "Nuestra canción", src: "/audio/cancion-1.mp3" },
    { title: "Ese verano", src: "/audio/cancion-2.mp3" },
  ],
};

export const notesWall = {
  eyebrow: "Para ti",
  title: "Déjame una nota",
  subtitle: "Escribe lo que quieras, aparecerá aquí abajo y también me llegará directo.",
  placeholder: "Escribe aquí...",
  buttonLabel: "Enviar",
  emptyState: "Aún no hay notas. ¡Sé la primera!",
};

export const closing = {
  photo: "/photos/cierre.jpg",
  message: `${couple.nameB},\npor todo lo que somos.\nTe amo.`,
  signature: couple.nameA,
  footer: "Para siempre",
};

export const site = {
  title: `${couple.nameA} & ${couple.nameB}`,
  themeColor: "#B23A48",
};
