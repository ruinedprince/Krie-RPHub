import InitialScreen from "./components/InitialSection";
import OverlayMenu from "./components/OverlayMenu";

export default function Home() {
  return (
    <div className="grid min-h-screen place-content-center">
      <OverlayMenu />
      <InitialScreen />
    </div>
  );
}
