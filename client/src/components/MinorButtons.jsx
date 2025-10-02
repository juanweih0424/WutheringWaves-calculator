// components/MinorButtons.jsx
import { useResonator } from "../context/ResonatorContext";

const fmt = (obj) => {
  if (!obj) return "";
  const [k, v] = Object.entries(obj)[0];
  // show as "+12% ATK", "+8% CR", etc.
  const labelMap = { atk: "ATK%", cr: "Crit. Rate", 
    hp: "HP%", def: "DEF%", er: "Energy Regen",
    cd:"Crit. Damage" };
  return `+${(v * 100).toFixed(0)}% ${labelMap[k] ?? k}`;
};

export default function MinorButtons() {
  const { current, minor1, setMinor1, minor2, setMinor2 } = useResonator();
  const minors = current?.minor ?? []; // e.g. [ { atk:0.12 }, { cr:0.08 } ]

  // toggle helpers: click again to deselect
  const onToggle1 = () => setMinor1(minor1 ? null : minors[0] ?? null);
  const onToggle2 = () => setMinor2(minor2 ? null : minors[1] ?? null);
  if (minors.length === 0) return null;
    
  return (
    <div className="flex flex-col gap-2 p-4 border-0 shadow-xl rounded-2xl mx-4 mb-4">
      <p className="text-lg text-[var(--color-highlight)]">Minor Fortes (Click to enable stats)</p>
      
      {minors[0] && (
        <button
          type="button"
          onClick={onToggle1}
          className={`px-3 py-1 rounded-md border transition cursor-pointer ${
            minor1 ? "bg-blue-500":"bg-blue-400 border-white/30" 
          }`}
          title={fmt(minors[0])}
        >
          {fmt(minors[0]) || "Minor 1"}
        </button>
      )}

      {minors[1] && (
        <button
          type="button"
          onClick={onToggle2}
          className={`px-3 py-1 rounded-md border transition cursor-pointer ${
            minor2 ?  "bg-blue-500":"bg-blue-400 border-white/30" 
          }`}
          title={fmt(minors[1])}
        >
          {fmt(minors[1]) || "Minor 2"}
        </button>
      )}
    </div>
  );
}
