import AboutSection from "./components/AboutSection";
import InitialScreen from "./components/InitialSection";
import MusicPlayer from "./components/MusicPlayer";
import OverlayMenu from "./components/OverlayMenu";

export default function Home() {
  return (
    <div className="grid min-h-screen place-content-center">
      <InitialScreen />
      <AboutSection />
      <MusicPlayer />
    </div>
  );
}
