# Steven y Ximena — regalo digital

Sitio hecho a mano para regalar. React + Vite, pensado para verse en el
celular. Todo lo editable vive en **un solo archivo**: `src/data/content.js`.

## 1. Instalar y correr en local

```bash
npm install
npm run dev
```

Abre la URL que te muestra la terminal (normalmente `http://localhost:5173`).
Cada vez que guardes un cambio, la página se actualiza sola.

> **Ojo con `npm run dev`**: las funciones serverless (notas y vales
> compartidos) **no corren** con Vite solo. En ese modo la página usa un
> respaldo en `localStorage` para que igual puedas probar todo, pero eso no
> se comparte entre dispositivos. Para probarlas de verdad en local:
>
> ```bash
> npm install -g netlify-cli
> netlify dev
> ```

## 2. Poner tu contenido real

Todo el texto, fechas, fotos y opciones están en **`src/data/content.js`**,
con comentarios explicando cada campo. No necesitas tocar ningún otro
archivo para personalizar el contenido.

- **Fotos**: reemplaza los archivos en `public/photos/` (mantén los mismos
  nombres, o cámbialos y actualiza las rutas en `content.js`). Formatos
  `.jpg`/`.png`. Para el video de la línea de tiempo, usa `.mp4`.
- **Antes de publicar, corre `npm run optimize`**: comprime automáticamente
  todas las fotos y canciones en `public/` (reduce el peso sin que se note
  la diferencia a simple vista). Es destructivo — sobrescribe los archivos
  en el mismo lugar — así que solo hace falta correrlo una vez después de
  poner tus fotos/canciones reales, no en cada `npm run dev`.
- **Música**: reemplaza los archivos en `public/audio/` (`.mp3`). Puedes
  agregar más de dos canciones — solo agrégalas a la lista `playlist.songs`
  en `content.js`. Con `playlist.autoplay: true` la música arranca sola al
  abrir la página (y si el navegador lo bloquea, arranca con el primer
  toque o scroll). En el botón flotante: **un toque = siguiente canción**,
  **mantener presionado = pausar/reanudar**. La primera vez sale un tip
  explicándolo.
- **Fecha de la relación**: campo `couple.startDate`, formato
  `"AAAA-MM-DDTHH:mm:ss"`. De ahí sale el contador en vivo de la portada.
- **Lugares del mapa**: cada pin necesita `lat`/`lng`. La forma más fácil de
  conseguirlos: abre Google Maps, clic derecho sobre el punto exacto, y las
  coordenadas quedan copiadas al portapapeles.
- **Vales, ruleta, lista de cosas por hacer, cualidades**: son arreglos
  simples — agrega, quita o reordena lo que quieras. Los vales de
  `content.js` son los "de fábrica"; además, Ximena puede agregar los suyos
  desde la propia página con el botón **"+ Agregar un vale"**, y esos se
  guardan compartidos (los ven los dos).

No hace falta tocar ningún componente dentro de `src/components/` a menos
que quieras cambiar el diseño en sí.

## 3. Publicarlo en Netlify

1. Crea un repositorio en GitHub con este proyecto (o arrastra la carpeta
   directamente a app.netlify.com/drop para una prueba rápida sin git).
2. En Netlify: **Add new site → Import an existing project**, conecta el
   repo. Netlify detecta solo la configuración (`netlify.toml`): build
   command `npm run build`, carpeta `dist`, funciones en
   `netlify/functions`.
3. **Netlify Blobs** (para el muro de notas y los vales que agrega Ximena)
   se activa automáticamente por sitio la primera vez que una función lo
   usa — no requiere configuración ni cuenta en otro servicio.
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

- **Qué se guarda dónde**:
  - *Local a cada navegador* (`localStorage`): qué vales están canjeados y
    el checklist. Si ella canjea un vale desde su celular, queda marcado
    solo ahí.
  - *Compartido entre dispositivos* (funciones serverless + Netlify Blobs):
    el muro de notas (`netlify/functions/notes.js`) y los vales que Ximena
    agrega desde la página (`netlify/functions/vouchers.js`).
- Si una función no responde (por ejemplo corriendo con `npm run dev`), la
  página no se rompe: cae al respaldo en `localStorage` y sigue funcionando,
  solo que sin sincronizar. Los errores reales de guardado sí se muestran
  debajo del formulario.
- Las fotos/audio de ejemplo que vienen ahora son marcadores de posición —
  reemplázalos antes de mandárselo a Ximena.
- Si no quieres que el link sea de verdad público, lo más simple es
  protegerlo con contraseña desde Netlify: Site settings → Visitor access
  → Password protection (disponible en el plan gratuito).
