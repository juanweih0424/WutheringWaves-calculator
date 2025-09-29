import Resonator from "../panel/Resonator.jsx";
import Weapon from "../panel/Weapon.jsx";


export default function LeftPanel({ activePanel }) {
  return (
    <aside className="lg:sticky h-fit max-h-[calc(100vh-var(--nav-h,3.5rem))] overflow-y-auto pl-4">
      {activePanel === "resonator" && <Resonator />}
      {activePanel === "weapon" && <Weapon />}

    </aside>
  );
}
