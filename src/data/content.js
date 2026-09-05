// ============================================================================
// CONTENIDO DEL SITIO — este es el ÚNICO archivo que necesitas tocar.
// Cambia textos, fechas, fotos, rutas, etc. aquí. El resto del código lee
// todo desde este archivo, así que no hace falta tocar los componentes.
//
// Las fotos van en /public/photos/  → referencia como "/photos/nombre.jpg"
// Las canciones van en /public/audio/ → referencia como "/audio/nombre.mp3"
// ============================================================================

export const couple = {
  nameA: "Steven",
  nameB: "Ximena",
  // Fecha y hora en que empezó la relación (se usa para el contador en vivo).
  // Formato: "AAAA-MM-DDTHH:mm:ss"
  startDate: "2026-04-18T18:00:00",
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
  { type: "photo", src: "/photos/momento-2.jpg", caption: "" },
  { type: "photo", src: "/photos/momento-3.jpg", caption: "" },
  { type: "photo", src: "/photos/momento-4.jpg", caption: "" },
  { type: "photo", src: "/photos/momento-5.jpg", caption: "" },
];

export const qualities = {
  title: `Lo que más amo de ${couple.nameB}`,
  items: [
    "Tu sonrisa sincera por la mañana",
    "Tu valentía para luchar por tus metas",
    "Tu forma de cuidar a los que amas",
    "Tu paciencia infinita conmigo",
    "Tu mirada cuando te concentras",
    "Tu abrazo fuerte",
    "Tu risa contagiosa",
    "Tu forma de ser optimista",
    "Tu forma de hacerme sentir especial",
  ],
};

// Lugares importantes. lat/lng en formato decimal (los sacas de Google Maps:
// clic derecho sobre el punto → aparecen las coordenadas para copiar).
// El mapa se acomoda solo para que se vean todos los pines — no hace falta
// ajustar centerLat/centerLng/zoom a mano; son solo el respaldo si algún
// día borras todos los pines.
export const places = {
  eyebrow: "Dónde empezó todo",
  title: "Nuestros lugares",
  centerLat: 4.820264762447345,
  centerLng: -75.70469435370386,
  zoom: 12,
  pins: [
    { name: "Dónde empezó todo", lat: 4.820264762447345, lng: -75.70469435370386 },
    { name: "Nuestra primera cita", lat: 4.8067692836455596, lng: -75.68355279976217 },
  ],
};

export const bucketList = {
  eyebrow: "Cosas que quiero hacer contigo",
  title: "Nuestra lista",
  items: [
    "Viajar juntos",
    "Ver el amanecer",
    "Un picnic",
    "Un concierto",
    "Cocinar juntos",
    "Clases de baile juntos",
    "Hacer un álbum de fotos",
    "Noche de moteliada"
  ],
};

// Vales de amor. Cada uno se puede canjear UNA sola vez (queda guardado
// en el navegador de quien lo canjea).
export const vouchers = {
  title: "Nuestros vales de amor",
  subtitle: "Canjéalo cuando quieras. Pero solo se puede usar una vez.",
  // Textos del botón/formulario para agregar vales nuevos desde la página.
  // Los vales que se agregan ahí se guardan compartidos (los ven los dos).
  addLabel: "Agregar un vale",
  addPlaceholder: "Vale por...",
  items: [
    { id: "beso", text: "Vale por un beso" },
    { id: "masajes", text: "Vale por un masaje relajante" },
    { id: "pelicula", text: "Vale por la película que elijas" },
    { id: "desayuno", text: "Vale por desayuno en la cama" },
    { id: "sin-telefono", text: "Vale por una noche sin teléfono" },
    { id: "viaje-sorpresa", text: "Vale por un viaje sorpresa" },
    { id: "maraton", text: "Vale por un maratón de series" },
    { id: "abrazados", text: "Vale por dormir abrazados" },
    { id: "cocina", text: "Vale por una cena romántica en casa" },
    { id: "cita-sorpresa", text: "Vale por una cita sorpresa" },
    { id: "carta", text: "Vale por una carta de amor" },
    { id: "baile", text: "Vale por una noche de baile" },
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
    { title: "Curita al alma", src: "/audio/cancion-1.mp3" },
    { title: "Ese 'baile' lento", src: "/audio/cancion-2.mp3" },
    { title: "Nuestro recuerdo", src: "/audio/cancion-3.mp3" },
    { title: "Un nuevo comienzo", src: "/audio/cancion-4.mp3" },
    { title: "Siempre tú y yo", src: "/audio/cancion-5.mp3" },
    { title: "Hechos el uno para el otro", src: "/audio/cancion-6.mp3" },
    { title: "Me haces bien", src: "/audio/cancion-7.mp3" },
    { title: "Tu favorita", src: "/audio/cancion-8.mp3" },
  ],
  // En estado true para que suene automaticamente al abrir la página. 
  // En false para que el usuario tenga que darle play.
  autoplay: true,
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
