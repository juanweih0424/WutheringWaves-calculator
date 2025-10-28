import React, { useMemo } from "react";
import { tokenizeDescription } from "../utils/formatDescription";
import { useResonatorBuffs } from "../context/ResonatorBuffContext";

export default function ResonatorBuffCard({ id }) {
  const { buffList, enabled, stacksById, toggle, setStacks } = useResonatorBuffs();
  const b = useMemo(() => buffList.find((x) => x.id === id), [buffList, id]);
  if (!b) return null;

  // Compute effective value per effect key (handles stacking)
  const effectiveByStat = useMemo(() => {
    const m = {};
    for (const eff of b.effects) {
      const s = eff.stack ? Math.min(eff.maxStack || 0, stacksById[id]?.[eff.statKey] ?? 0) : 1;
      m[eff.statKey] = eff.value * (eff.stack ? s : 1);
    }
    return m;
  }, [b.effects, stacksById, id]);

  // Render description: if a token matches a statKey, print its numeric value; also highlight trailing %
  const descNodes = useMemo(() => {
    const parts = tokenizeDescription(b.desc);
    const nodes = [];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (p.highlight) {
        const key = p.text;
        const effVal = effectiveByStat[key];
        const shown =
          effVal != null ? (effVal * 100).toFixed(((effVal * 100) % 1 === 0 ? 0 : 1)) : key;

        nodes.push(
          <span key={`h-${i}`} className="text-[var(--color-highlight)]">
            {shown}
          </span>
        );

        const next = parts[i + 1];
        if (next && !next.highlight && typeof next.text === "string" && next.text.startsWith("%")) {
          nodes.push(
            <span key={`pct-${i}`} className="text-[var(--color-highlight)]">
              %
            </span>
          );
        }
        continue;
      }
      let text = p.text;
      if (i > 0 && parts[i - 1].highlight && text.startsWith("%")) text = text.slice(1);
      if (text) nodes.push(<span key={`t-${i}`}>{text}</span>);
    }
    return nodes;
  }, [b.desc, effectiveByStat]);

  const hasAnyStacks = b.effects.some((e) => e.stack);

  return (
    <div className="p-3 flex flex-col items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm lg:text-base font-semibold">{b.name}</div>
        <div className="text-xs lg:text-sm opacity-80">{descNodes}</div>

        {hasAnyStacks && (
          <div className="mt-2 grid gap-2">
            {b.effects.map((e) =>
              e.stack ? (
                <div key={e.statKey} className="flex items-center gap-2">
                  <span className="text-xs opacity-70">Stacks</span>
                  <input
                    type="number"
                    min={0}
                    max={e.maxStack || 0}
                    value={stacksById[id]?.[e.statKey] ?? 0}
                    onChange={(evt) => setStacks(id, e.statKey, evt.target.value)}
                    className="w-16 rounded-md border border-gray-500/30 bg-transparent px-2 py-1 text-sm"
                  />
                  {e.maxStack ? (
                    <span className="text-xs opacity-60">(Max {e.maxStack})</span>
                  ) : null}
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <button
          onClick={() => toggle(b.id)}
          className={`px-3 py-1 rounded-md text-xs lg:text-sm border transition ${
            enabled[b.id]
              ? "border-emerald-400 bg-emerald-400/10 cursor-pointer"
              : "border-gray-500 opacity-80 hover:opacity-100 cursor-pointer"
          }`}
        >
          {enabled[b.id] ? "Enabled" : "Enable"}
        </button>
      </div>
    </div>
  );
}
