# Valentina & Mateo — regalo digital

Sitio hecho a mano para regalar. React + Vite, pensado para verse en el
celular. Todo lo editable vive en **un solo archivo**: `src/data/content.js`.

## 1. Instalar y correr en local

```bash
npm install
npm run dev
```

Abre la URL que te muestra la terminal (normalmente `http://localhost:5173`).
Cada vez que guardes un cambio, la página se actualiza sola.

## 2. Poner tu contenido real

Todo el texto, fechas, fotos y opciones están en **`src/data/content.js`**,
con comentarios explicando cada campo. No necesitas tocar ningún otro
archivo para personalizar el contenido.

- **Fotos**: reemplaza los archivos en `public/photos/` (mantén los mismos
  nombres, o cámbialos y actualiza las rutas en `content.js`). Formatos
  `.jpg`/`.png`. Para el video de la línea de tiempo, usa `.mp4`.
- **Música**: reemplaza los archivos en `public/audio/` (`.mp3`). Puedes
  agregar más de dos canciones — solo agrégalas a la lista `playlist.songs`
  en `content.js`.
- **Fecha de la relación**: campo `couple.startDate`, formato
  `"AAAA-MM-DDTHH:mm:ss"`. De ahí sale el contador en vivo de la portada.
- **Lugares del mapa**: cada pin necesita `lat`/`lng`. La forma más fácil de
  conseguirlos: abre Google Maps, clic derecho sobre el punto exacto, y las
  coordenadas quedan copiadas al portapapeles.
- **Vales, ruleta, lista de cosas por hacer, cualidades**: son arreglos
  simples — agrega, quita o reordena lo que quieras.

No hace falta tocar ningún componente dentro de `src/components/` a menos
que quieras cambiar el diseño en sí.

## 3. Publicarlo en Netlify

1. Crea un repositorio en GitHub con este proyecto (o arrastra la carpeta
   directamente a app.netlify.com/drop para una prueba rápida sin git).
2. En Netlify: **Add new site → Import an existing project**, conecta el
   repo. Netlify detecta solo la configuración (`netlify.toml`): build
   command `npm run build`, carpeta `dist`, funciones en
   `netlify/functions`.
3. **Netlify Blobs** (para el muro de notas) se activa automáticamente por
   sitio la primera vez que una función lo usa — no requiere configuración
   ni cuenta en otro servicio.
4. **Netlify Forms** (para que te lleguen las notas por correo): Site
   settings → Forms → confirma que esté activo (lo está por defecto en
   cuanto detecta el formulario oculto en `index.html`). Ahí mismo agregas
   tu correo en Forms → Form notifications → Email notification.
5. Cuando termine el deploy, tu sitio queda en una URL tipo
   `algo-al-azar.netlify.app`. En Site settings → Domain management puedes
   ponerle un nombre más lindo (gratis) o conectar un dominio propio.

## 4. Instalarlo como app en el celular de Ximena

El sitio ya es una PWA instalable. Ella solo tiene que:
- **iPhone (Safari)**: abrir el link → botón compartir → "Agregar a
  pantalla de inicio".
- **Android (Chrome)**: abrir el link → menú (⋮) → "Instalar app" o
  "Agregar a pantalla de inicio".

Así queda como un ícono más en su celular, sin barra de navegador.

## Notas técnicas

- Los vales y el checklist se guardan en el navegador de quien los usa
  (`localStorage`) — si ella los canjea desde su celular, quedan marcados
  ahí. No sincroniza entre dispositivos.
- El muro de notas sí es compartido: usa una función serverless de Netlify
  (`netlify/functions/notes.js`) + Netlify Blobs, así que cualquiera que
  entre al sitio ve las mismas notas, sin importar el dispositivo.
- Las fotos/audio de ejemplo que vienen ahora son marcadores de posición —
  reemplázalos antes de mandárselo a Ximena.
- Si no quieres que el link sea de verdad público, lo más simple es
  protegerlo con contraseña desde Netlify: Site settings → Visitor access
  → Password protection (disponible en el plan gratuito).
