import Resonator from "../panel/Resonator.jsx";
import Weapon from "../panel/Weapon.jsx";
import Chain from "../panel/Chain.jsx"
import Enemy from "../panel/Enemy.jsx"

export default function LeftPanel({ activePanel }) {
  return (
    <aside className="lg:sticky h-fit max-h-[calc(100vh-var(--nav-h,3.5rem))] overflow-y-auto pl-4">
      {activePanel === "resonator" && <Resonator />}
      {activePanel === "weapon" && <Weapon />}
      {activePanel === "chain" && <Chain />}
      {activePanel === "enemy" && <Enemy />}
    </aside>
  );
}
