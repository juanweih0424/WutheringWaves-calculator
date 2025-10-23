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
            <div key={name} className="rounded-xl border-1 border-gray-500/30 shadow-md p-4">
              <div className="flex flex-col gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium lg:text-lg text-[var(--color-highlight)]">{name}</div>
                  {data.desc && (
                    <p className="text-xs lg:text-base mt-1">
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
                </div>
                {/* enable toggle */}
                <label className="flex items-center gap-2 shrink-0">
                  <p className="text-xs lg:text-sm">Enable</p>
                  <input
                    type="checkbox"
                    className="h-3 w-3 lg:h-4 lg:w-4 accent-emerald-500"
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
                    className="w-12 h-6 text-sm lg:w-16 rounded-md border border-gray-500/50 bg-transparent px-2 py-1 text-center"
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
