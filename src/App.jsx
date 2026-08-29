import { useState } from "react";
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
      <MusicPlayer />
    </>
  );
}
