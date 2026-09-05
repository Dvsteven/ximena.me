import { useEffect, useState } from "react";
import EnvelopeIntro from "./components/EnvelopeIntro";
import Hero from "./components/Hero";
import LoveNoteModal from "./components/LoveNoteModal";
import Timeline from "./components/Timeline";
import Qualities from "./components/Qualities";
import PlacesMap from "./components/PlacesMap";
import BucketList from "./components/BucketList";
import Vouchers from "./components/Vouchers";
import Wheel from "./components/Wheel";
import NotesWall from "./components/NotesWall";
import MusicPlayer from "./components/MusicPlayer";
import Closing from "./components/Closing";

export default function App() {
  const [noteOpen, setNoteOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(true);
  const [musicSignal, setMusicSignal] = useState(false);

  // Mientras el sobre de la intro está en pantalla, bloqueamos el scroll
  // para que no se alcance a ver el contenido de fondo.
  useEffect(() => {
    document.body.style.overflow = introOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introOpen]);

  const handleEnvelopeOpen = () => {
    setIntroOpen(false);
    setMusicSignal(true);
  };

  return (
    <>
      <Hero onPhotoTap={() => setNoteOpen(true)} />
      <Timeline />
      <Qualities />
      <PlacesMap />
      <BucketList />
      <Vouchers />
      <Wheel />
      <NotesWall />
      <Closing />

      <LoveNoteModal open={noteOpen} onClose={() => setNoteOpen(false)} />
      <MusicPlayer autoStart={musicSignal} />

      {introOpen && <EnvelopeIntro onOpen={handleEnvelopeOpen} />}
    </>
  );
}
