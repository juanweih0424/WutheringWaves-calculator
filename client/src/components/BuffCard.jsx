import React, {useMemo }from "react";
import { useBuff } from "../context/TeamBuffContext";
import { tokenizeDescription } from "../utils/formatDescription";
import { labelFromStatKey } from "../context/EchoContext";
import { getIconForStat } from "../utils/statsMeta";
import { getEchoSetImageUrl } from "../utils/echo";
import { statsMeta } from "../utils/statsMeta"; //


const ELEMENT_COLORS = {
  aero:   "#22c55e", // Aero
  glacio: "#3b82f6", // Glacio
  fusion: "#ed744d", // Fusion
  electro:"#a855f7", // Electro
  spectro:"#facc15", // Spectro
  havoc:  "#94224a", // Havoc
};

function colorForToken(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const [key, color] of Object.entries(ELEMENT_COLORS)) {
    if (lower.includes(key)) return color; 
  }
  return null;
}

const PCT_KEYS = new Set([
  "hpPct","atkPct","defPct","cr","cd","er","heal",
  "aero","glacio","fusion","electro","spectro","havoc",
  "baDmg","haDmg","skill","ult","echoDmg","echoDmgAll","allAtr",
]);


const STAT_OVERRIDES = {

  echoDmg: "Echo DMG Bouns",
  allAtr: "All Attribute DMG Bouns",

};

const fmtVal = (stat, v) => {
  if (v == null) return "";
  if (PCT_KEYS.has(stat)) {
    const n = Math.round(v * 1000) / 10; 
    const isInt = Math.abs(n - Math.round(n)) < 0.05;
    return `${isInt ? Math.round(n) : n}%`;
  }
  return String(v);
};

const prettyLabel = (stat) => {
  const k = String(stat ?? "");
  return (
    STAT_OVERRIDES[k] ||
    STAT_OVERRIDES[k.toLowerCase()] ||   
    labelFromStatKey(k) ||              
    k.toUpperCase()
  );
};

export default function BuffCard({ setItem }) {
  const { enabled = {}, stacks = {}, setBuffEnabled, setBuffStack } = useBuff();

  const id = setItem?.id;
  const buff = setItem?.buff;
  if (!id || !buff) return null;

  const isOn = !!enabled[id];
  const setStacksFor = stacks[id] || {};

  const IS_ELEMENT = useMemo(
  () => new Set(statsMeta.filter(m => m.isElement).map(m => m.key)),
  []
);

  return (
    <div className="rounded-xl flex flex-col gap-1">
        <div className="flex items-center gap-2">
            <img
            src={getEchoSetImageUrl(Number(setItem.id))}
            className="w-6 h-6 lg:w-7 lg:h-7 rounded"
            />
            <p className="text-sm lg:text-base font-semibold">{setItem.name}</p>
        </div>

      {/* description with element-colored tokens */}
      <p className="text-sm lg:text-base opacity-90">
        {tokenizeDescription(buff.desc).map((part, i) => {
          if (!part.highlight) return <span key={i}>{part.text}</span>;
          const color = colorForToken(part.text);
          return (
            <span
              key={i}
              className={color ? "font-medium" : "text-[var(--color-highlight)] font-medium"}
              style={color ? { color } : undefined}
            >
              {part.text}
            </span>
          );
        })}
      </p>

      <div className="space-y-1">
        {(buff.effects || []).map((ef, idx) => {
          const key = String(idx);
          const cur = setStacksFor[key] ?? 0;
          const max =
            typeof ef.maxStack === "number"
              ? ef.maxStack
              : typeof ef.maxStacks === "number"
              ? ef.maxStacks
              : 10;
          const totalVal = ef.stack ? ef.value * cur : ef.value;

          const icon = getIconForStat(ef.stat);
          const isElement = IS_ELEMENT.has(ef.stat);
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-md bg-gray-500/10 px-2 py-1"
            >
              <div className="flex items-center gap-2">
                {icon && (
                    <img
                    src={icon}
                    alt=""
                    className={`w-5 h-5 lg:w-7 lg:h-7 ${isElement ? "" : "brightness-[var(--color-img)]"}`}
                    />
                )}
                <p className="text-sm lg:text-base font-medium">{prettyLabel(ef.stat)}</p>
              </div>

              <div className="flex items-center gap-2">
                {ef.stack && (
                  <>
                    <span className="text-xs lg:text-sm opacity-80">Stack:</span>
                    <input
                      type="number"
                      min={0}
                      max={max}
                      value={cur}
                      onChange={(e) =>
                        setBuffStack &&
                        setBuffStack(
                          id,
                          key,
                          Math.max(0, Math.min(max, Number(e.target.value) || 0))
                        )
                      }
                      className="w-10 lg:w-12 h-6 text-center border rounded bg-[var(--color-bg)]"
                      disabled={!isOn}
                    />
                  </>
                )}
                <p className="text-sm lg:text-base font-semibold">
                  {fmtVal(ef.stat, totalVal)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <label className="flex items-center gap-2 mt-1 cursor-pointer text-sm">
        <input
          type="checkbox"
          checked={isOn}
          onChange={(e) => setBuffEnabled && setBuffEnabled(id, e.target.checked)}
        />
        Enabled?
      </label>
    </div>
  );
}
