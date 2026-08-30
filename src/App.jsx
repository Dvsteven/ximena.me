import { lazy, Suspense, useState } from "react";
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
    </>
  );
}
