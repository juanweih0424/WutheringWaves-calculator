import React, { useMemo } from "react";
import { useResonator } from "../context/ResonatorContext";
import { tokenizeDescription } from "../utils/formatDescription";

export default function ResonatorBuff() {
  const {
    current,
    enabledBuffs,
    toggleBuff,
    buffStacks,
    setBuffStack,
  } = useResonator();

  if (!current?.buff) {
    return null;
  }

  return (
      <div className="flex flex-col gap-6 mt-4 mx-4">
        {Object.entries(current.buff).map(([name, data]) => {
          const enabled = !!enabledBuffs[name];
          const effects = data.effects ?? [];
          const isStackable = effects.some((e) => e.stack);
          const maxStacks = Math.max(
            1,
            ...effects.filter((e) => e.stack).map((e) => e.maxStack ?? 1)
          );
          const stacks = buffStacks[name] ?? 0;

          return (
            <div key={name} className="rounded-xl border-0 shadow-md p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-lg text-[var(--color-highlight)]">{name}</div>
                  {data.desc && (
                    <p className="text-base mt-1">
                      {tokenizeDescription(data.desc).map((tok, i) => (
                        <span
                          key={i}
                          className={tok.highlight ? "text-[var(--color-highlight)] font-medium" : undefined}
                        >
                          {tok.text}
                        </span>
                      ))}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                  </div>
                </div>
                {/* enable toggle */}
                <label className="flex items-center gap-2 shrink-0">
                  <span className="text-sm">Enable</span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-500"
                    checked={enabled}
                    onChange={() => toggleBuff(name)}
                  />
                </label>
              </div>
              {isStackable && enabled && (
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={maxStacks}
                    value={stacks}
                    onChange={(e) => setBuffStack(name, Number(e.target.value))}
                    className="w-16 rounded-md border border-white/10 bg-transparent px-2 py-1 text-center"
                  />
                  <span className="text-xs opacity-70">/ {maxStacks}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
  );
}
