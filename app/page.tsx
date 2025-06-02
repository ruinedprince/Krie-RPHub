import AboutSection from "./components/AboutSection";
import InitialScreen from "./components/InitialSection";
import OverlayMenu from "./components/OverlayMenu";
import ActivitySection from "./components/ActivitySection";

export default function Home() {
  return (
    <div className="grid min-h-screen place-content-center">
      <InitialScreen />
      <AboutSection />
      <ActivitySection />
    </div>
  );
}
