import { lazy, Suspense, useEffect, useState } from "react";
import EnvelopeIntro from "./components/EnvelopeIntro";
import Hero from "./components/Hero";
import LoveNoteModal from "./components/LoveNoteModal";
import Timeline from "./components/Timeline";
import Qualities from "./components/Qualities";
import BucketList from "./components/BucketList";
import Vouchers from "./components/Vouchers";
import Wheel from "./components/Wheel";
import NotesWall from "./components/NotesWall";
import MusicPlayer from "./components/MusicPlayer";
import Closing from "./components/Closing";

// Leaflet (el mapa) pesa bastante y no hace falta para el primer pantallazo:
// se carga aparte, solo cuando el navegador llega a esta sección.
const PlacesMap = lazy(() => import("./components/PlacesMap"));

export default function App() {
  const [noteOpen, setNoteOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(true);

  // Mientras el sobre de la intro está en pantalla, bloqueamos el scroll
  // para que no se alcance a ver el contenido de fondo.
  useEffect(() => {
    document.body.style.overflow = introOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introOpen]);

  return (
    <>
      <Hero onPhotoTap={() => setNoteOpen(true)} />
      <Timeline />
      <Qualities />
      <Suspense fallback={<div style={{ height: 340 }} />}>
        <PlacesMap />
      </Suspense>
      <BucketList />
      <Vouchers />
      <Wheel />
      <NotesWall />
      <Closing />

      <LoveNoteModal open={noteOpen} onClose={() => setNoteOpen(false)} />
      <MusicPlayer />

      {/* El toque para abrir el sobre cuenta como la interacción que los
          navegadores exigen antes de reproducir audio automático, así que
          la música arranca sola justo al abrirlo (ver MusicPlayer.jsx). */}
      {introOpen && <EnvelopeIntro onOpen={() => setIntroOpen(false)} />}
    </>
  );
}
