import Resonator from "../panel/Resonator.jsx";
import Enemy from "../panel/Enemy.jsx"
import Weapon from "./Weapon.jsx";
import Chain from "./Chain.jsx";
import Echo from "./Echo.jsx";
import Team from "./Team.jsx"

export default function LeftPanel({ activePanel }) {
  return (
    <aside className="lg:sticky h-fit max-h-[calc(100vh-var(--nav-h,3.5rem))] overflow-y-auto pl-4">
      {activePanel === "resonator" && <Resonator />}
      {activePanel === "weapon" && <Weapon/>}
      {activePanel === "echo" && <Echo/>}
      {activePanel === "chain" && <Chain />}
      {activePanel === "enemy" && <Enemy />}
      {activePanel === "team" && <Team />}
    </aside>
  );
}
