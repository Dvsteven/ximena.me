// Comprime las fotos y canciones en public/ para que el sitio cargue rápido.
//
// Uso: npm run optimize
//
// Corre esto cada vez que reemplaces una foto o canción por un archivo
// "crudo" (foto directo del celular, canción descargada sin comprimir).
// No hace falta correrlo si no cambiaste ningún archivo multimedia.
//
// Ojo: es destructivo — sobrescribe los archivos en public/photos y
// public/audio en el mismo lugar. Si quieres conservar los originales sin
// comprimir, guarda una copia aparte antes de correrlo.

import { readdir, stat, readFile, writeFile, rm, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath);

const root = path.dirname(fileURLToPath(import.meta.url));
const photosDir = path.join(root, "..", "public", "photos");
const audioDir = path.join(root, "..", "public", "audio");

// Las fotos se muestran como mucho a ~260px CSS; 1200px cubre pantallas de
// alta densidad (retina ~3x) con margen de sobra.
const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 78;
const PNG_QUALITY = 78;

// 128kbps es de sobra para música de fondo y pesa bastante menos que los
// ~192-320kbps típicos de una descarga sin comprimir.
const AUDIO_BITRATE = "128k";

function humanSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// En Windows (sobre todo con carpetas sincronizadas por OneDrive) escribir
// justo después de leer un archivo a veces falla con EPERM/UNKNOWN porque
// el archivo queda bloqueado un instante por el antivirus o el propio
// OneDrive. Es transitorio, así que reintentamos con espera creciente.
async function conReintentos(fn, intentos = 6) {
  for (let i = 1; i <= intentos; i++) {
    try {
      return await fn();
    } catch (err) {
      const bloqueado = ["EPERM", "EBUSY", "UNKNOWN"].includes(err.code);
      if (!bloqueado || i === intentos) throw err;
      await sleep(400 * i);
    }
  }
}

// Sobrescribe `destino` con `data`. Primero intenta abrir el archivo
// directamente; si el bloqueo persiste (típico de carpetas sincronizadas
// por OneDrive), escribe a un archivo temporal nuevo y lo renombra encima
// — renombrar no necesita abrir el destino para escritura.
async function sobrescribir(destino, data) {
  try {
    await conReintentos(() => writeFile(destino, data), 10);
  } catch {
    const tmp = `${destino}.nuevo${path.extname(destino)}`;
    await writeFile(tmp, data);
    await conReintentos(() => rename(tmp, destino), 10);
  }
}

async function listFiles(dir, exts) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    return [];
  }
  return entries.filter((f) => exts.includes(path.extname(f).toLowerCase()));
}

async function optimizeImage(file) {
  const fullPath = path.join(photosDir, file);
  const before = (await stat(fullPath)).size;
  const ext = path.extname(file).toLowerCase();

  const pipeline = sharp(fullPath).resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: "inside",
    withoutEnlargement: true,
  });

  const buffer = await (ext === ".png"
    ? pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 })
    : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
  ).toBuffer();

  // Si por alguna razón salió más pesado (foto ya chica/comprimida), no tocamos el original.
  if (buffer.length >= before) {
    console.log(`  = ${file} ya está optimizada (${humanSize(before)})`);
    return;
  }

  await sobrescribir(fullPath, buffer);

  console.log(`  ✓ ${file}: ${humanSize(before)} → ${humanSize(buffer.length)}`);
}

function optimizeAudio(file) {
  const fullPath = path.join(audioDir, file);
  const tmpPath = fullPath + ".tmp.mp3";

  return new Promise(async (resolve, reject) => {
    const before = (await stat(fullPath)).size;

    ffmpeg(fullPath)
      .audioCodec("libmp3lame")
      .audioBitrate(AUDIO_BITRATE)
      .format("mp3")
      .on("error", reject)
      .on("end", async () => {
        try {
          const after = (await stat(tmpPath)).size;
          if (after >= before) {
            await rm(tmpPath);
            console.log(`  = ${file} ya está optimizada (${humanSize(before)})`);
          } else {
            const data = await readFile(tmpPath);
            await sobrescribir(fullPath, data);
            await conReintentos(() => rm(tmpPath));
            console.log(`  ✓ ${file}: ${humanSize(before)} → ${humanSize(after)}`);
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .save(tmpPath);
  });
}

async function main() {
  console.log("Optimizando fotos...");
  const images = await listFiles(photosDir, [".jpg", ".jpeg", ".png"]);
  for (const file of images) {
    try {
      await optimizeImage(file);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  console.log("\nOptimizando canciones...");
  const songs = await listFiles(audioDir, [".mp3"]);
  for (const file of songs) {
    try {
      await optimizeAudio(file);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  console.log("\nListo.");
}

main().catch((err) => {
  console.error("Error optimizando archivos:", err);
  process.exit(1);
});
