// client/src/components/WeaponBuffCard.jsx
import React, { useMemo } from "react";
import { useWeaponBuff } from "../context/WeaponBuffContext";
import { tokenizeDescription } from "../utils/formatDescription";

export default function WeaponBuffCard({ buffId }) {
  const { buffList, enabled, refineById, toggle, setRefine } = useWeaponBuff();
  const b = useMemo(() => buffList.find((x) => x.id === buffId), [buffList, buffId]);
  if (!b) return null;

  const refine = Math.min(b.maxRefine, Math.max(1, refineById[b.id] ?? 1));
  const value = b.values[refine - 1] ?? 0;

const descNodes = useMemo(() => {
  const parts = tokenizeDescription(b.description); 
  const nodes = [];

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];

    if (p.highlight) {
      const key = p.text; 
      const shown =
        key === b.statKey
          ? (value * 100).toFixed(((value * 100) % 1 === 0 ? 0 : 1))
          : key;

      nodes.push(
        <span key={`h-${i}`} className="text-[var(--color-highlight)]">
          {shown}
        </span>
      );

      const next = parts[i + 1];
      if (next && !next.highlight && typeof next.text === "string" && next.text.startsWith("%")) {
        nodes.push(
          <span key={`pct-${i}`} className="text-[var(--color-highlight)]">%</span>
        );
      }
      continue;
    }

    let text = p.text;
    if (i > 0 && parts[i - 1].highlight && text.startsWith("%")) {
      text = text.slice(1);
    }
    if (text) {
      nodes.push(<span key={`t-${i}`}>{text}</span>);
    }
  }

  return nodes;
}, [b.description, b.statKey, value]);

  return (
    <div className="p-2 flex flex-col justify-center gap-2">
      <div className="min-w-0">
        <p className="font-semibold text-sm lg:text-base">
          {b.weaponName}
        </p>
        <div className="text-xs lg:text-base opacity-80">{descNodes}</div>
      </div>

      <div className="flex items-center gap-3">
        {/* refinement select */}
        <div className="flex items-center gap-2">
          <p className="text-xs lg:text-sm opacity-80">Refinement Level</p>
          <select
            className="border rounded-md bg-[var(--color-bg)] text-[var(--color-text)] text-sm px-2 py-1"
            value={refine}
            onChange={(e) => setRefine(b.id, e.target.value)}
          >
            {Array.from({ length: b.maxRefine }, (_, i) => i + 1).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>


        {/* enable toggle */}
        <button
          onClick={() => toggle(b.id)}
          className={`px-3 py-1 rounded-md text-xs lg:text-sm border transition ${
            enabled[b.id]
              ? "border-green-600 bg-emerald-400/10 cursor-pointer"
              : "border-[var(--color-text)] opacity-80 hover:opacity-100 cursor-pointer"
          }`}
        >
          {enabled[b.id] ? "Enabled" : "Enable"}
        </button>
      </div>
    </div>
  );
}
