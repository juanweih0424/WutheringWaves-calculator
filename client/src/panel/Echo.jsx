import React, { useMemo, useState } from "react";
import {
  useEcho,
  MAIN_OPTIONS,
  statKeyFromLabel,
  ELEMENT_KEYS,
  SUBSTAT_RANGES, // tiers
  labelFromStatKey
} from "../context/EchoContext";
import EchoModal from "../modals/EchoModal";
import { getEchoImageUrl } from "../utils/echo";
import { getIconForStat } from "../utils/statsMeta";
import { tokenizeDescription } from "../utils/formatDescription";
import EchoSet from "../components/EchoSet";
import EchoSetBuff from "./EchoSetBuff";

/* ---------- Pretty formatter ---------- */
const PERCENT_LABELS = new Set([
  "Crit Rate",
  "Crit DMG",
  "Energy Regen",
  "HP%",
  "ATK%",
  "DEF%",
  "Aero Bouns DMG",
  "Glacio Bouns DMG",
  "Fusion Bouns DMG",
  "Electro Bouns DMG",
  "Havoc Bouns DMG",
  "Spectro Bouns DMG",
  "Healing Bouns",
  "Basic Bouns DMG",
  "Heavy Bouns DMG",
  "Resonance Skill Bouns DMG",
  "Resonance Liberation Bouns DMG",
]);

function fmt(label, value) {
  if (value == null) return "";
  if (PERCENT_LABELS.has(label)) {
    const n = value * 100;
    const r = Math.round(n * 10) / 10;
    const isInt = Math.abs(r - Math.round(r)) < 0.05;
    return `${isInt ? Math.round(r) : r}%`;
  }
  return String(value);
}

// dropdown options for user minis (must match LABEL_TO_KEY)
const USER_SUBSTAT_LABELS = [
  "Crit Rate",
  "Crit DMG",
  "HP",
  "DEF",
  "ATK",
  "DEF%",
  "ATK%",
  "HP%",
  "Energy Regen",
  "Basic Bouns DMG",
  "Heavy Bouns DMG",
  "Resonance Skill Bouns DMG",
  "Resonance Liberation Bouns DMG",
];

// find nearest tier index for a given value
function nearestTierIndex(arr, val) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  if (val == null) return 0;
  let best = 0;
  let bestDiff = Math.abs(arr[0] - val);
  for (let i = 1; i < arr.length; i++) {
    const d = Math.abs(arr[i] - val);
    if (d < bestDiff) {
      best = i;
      bestDiff = d;
    }
  }
  return best;
}

export default function Echo() {
  const {
    equipped,
    equipEcho,
    unequipEcho,
    clearEquipped,
    MAX_SLOTS,
    setMainStat,
    setSkillEnabled,
    addSubStat,
    removeSubStat,
    setSubStatLabel,
    setSubStatValue,
  } = useEcho();

  const [open, setOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(0);

  const slots = useMemo(() => {
    const out = (equipped || []).slice(0, MAX_SLOTS);
    while (out.length < MAX_SLOTS) out.push(null);
    return out;
  }, [equipped, MAX_SLOTS]);

  const openPicker = (i) => {
    setActiveSlot(i);
    setOpen(true);
  };
  const onSelect = (echo) => {
    equipEcho(activeSlot, echo);
    setOpen(false);
  };

  return (
    <div className="grid gap-4 lg:p-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-base lg:text-lg tracking-tight">Echoes</p>
        <button
          className="text-xs lg:text-sm bg-red-500/75 p-2 border-0 rounded-2xl cursor-pointer hover:bg-red-500/60"
          onClick={clearEquipped}
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {slots.map((slot, i) => {
          const img = slot?.echo ? getEchoImageUrl(slot.echo.id) : null;
          const cost = slot?.cost ?? null;

          return (
            <div key={i} className="rounded-2xl shadow-md p-3 mt-2 border-gray-500/30 border-1">
              <div className="flex flex-col lg:flex-row items-start gap-4">
                {/* Left: avatar + Remove */}
                <div className="flex flex-col place-self-center lg:items-center lg:place-self-start gap-2">
                  <button
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border border-amber-400 overflow-hidden hover:scale-110 transition cursor-pointer"
                    onClick={() => openPicker(i)}
                    title={slot?.echo?.name || `Select Echo ${i + 1}`}
                    type="button"
                  >
                    {img ? (
                      <img src={img} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm ">
                        Echo {i + 1}
                      </div>
                    )}
                  </button>

                  {slot?.echo && (
                    <button
                      className="text-xs bg-red-500/75 py-2 lg:p-2 rounded-xl mt-1 cursor-pointer hover:bg-red-500/60"
                      onClick={() => unequipEcho(i)}
                      type="button"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Right column */}
                {slot?.echo && (
                  <div className="flex-1 min-w-0">
                    {/* Header row with Name + Main Stat next to it + Cost badge at far right */}
      
                    <div className="flex flex-col md:flex-row items-center md:justify-between gap-3">
                      <div className="flex gap-4 items-center">
                      <p className="text-sm lg:text-base font-medium truncate text-[var(--color-highlight)] max-w-[22ch]">
                        {slot.echo.name}
                      </p>
                      {cost != null && (
                      <p className="shrink-0 rounded-full px-2 py-1 text-xs lg:text-sm font-medium bg-indigo-600/90">
                        Cost {cost}
                      </p>
                    )}
                      </div>
                      {/* Main stat picker moved up here */}
                      <div className="flex items-center gap-2 shrink-0">
                        <label className="text-sm lg:text-base opacity-80">
                          Main Stats
                        </label>
                        <select
                          className="border rounded bg-[var(--color-bg)] text-[var(--color-text)] text-xs lg:text-sm px-2 py-1"
                          value={slot.main?.statLabel ?? ""}
                          onChange={(e) => setMainStat(i, e.target.value)}
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          {(MAIN_OPTIONS[cost] ?? []).map((label) => (
                            <option key={label} value={label}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Main + fixed sub recap */}
                    <div className="space-y-1 mt-2 mb-3">
                      {slot.main && (
                        <div className="tracking-tight flex items-center gap-2">
                          {(() => {
                            const key = statKeyFromLabel(slot.main.statLabel);
                            const icon = key && getIconForStat(key);
                            const tint =
                              key && !ELEMENT_KEYS.has(key)
                                ? "brightness-[var(--color-img)]"
                                : "";
                            return icon ? (
                              <img
                                src={icon}
                                alt=""
                                className={`w-4 h-4 lg:h-6 lg:w-6 shrink-0 ${tint}`}
                              />
                            ) : null;
                          })()}
                          <span className="text-sm lg:text-base">
                            {slot.main.statLabel}:{" "}
                            {fmt(slot.main.statLabel, slot.main.value)}
                          </span>
                        </div>
                      )}

                      {slot.sub && (
                        <div className="tracking-tight flex items-center gap-2 bg-gray-500/20">
                          {(() => {
                            const key = statKeyFromLabel(slot.sub.statLabel);
                            const icon = key && getIconForStat(key);
                            const tint =
                              key && !ELEMENT_KEYS.has(key)
                                ? "brightness-[var(--color-img)]"
                                : "";
                            return icon ? (
                              <img
                                src={icon}
                                alt=""
                                className={`w-4 h-4 lg:h-6 lg:w-6 shrink-0 ${tint}`}
                              />
                            ) : null;
                          })()}
                          <span className="text-sm lg:text-base">
                            {slot.sub.statLabel}:{" "}
                            {fmt(slot.sub.statLabel, slot.sub.value)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Echo Skill (slot 1 only) */}
                    {i === 0 && slot?.echo?.skill && (
                      <div className="mb-3 rounded-lg border border-gray-500/50 p-3">
                        <div className="flex flex-col  items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm lg:text-base font-semibold">
                              Echo Skill
                            </p>
                            <p className="text-xs lg:text-sm opacity-90 break-words leading-snug">
                              {tokenizeDescription(
                                slot.echo.skill.description
                              ).map((part, idx) =>
                                part.highlight ? (
                                  <span
                                    key={idx}
                                    className="text-[var(--color-highlight)] font-medium"
                                  >
                                    {part.text}
                                  </span>
                                ) : (
                                  <span key={idx}>{part.text}</span>
                                )
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            aria-pressed={!!slot.skillEnabled}
                            onClick={() =>
                              setSkillEnabled(i, !slot.skillEnabled)
                            }
                            className="inline-flex items-center gap-2 text-xs lg:text-sm font-medium select-none hover:opacity-90 "
                          >
                            <span>Enable</span>
                            <span
                              className={`inline-flex items-center justify-center w-5 h-5 lg:w-7 lg:h-7 rounded-md border  
                              ${
                                slot.skillEnabled
                                  ? "bg-emerald-600 border-emerald-600"
                                  : "bg-gray-400/25 border-gray-500/20"
                              }`}
                            >
                              {slot.skillEnabled ? (
                                <svg
                                  viewBox="0 0 24 24"
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              ) : null}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ===== User sub-stats (up to 5) ===== */}
                    <div className="mt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs lg:text-sm font-semibold">
                          Sub-Stats
                        </label>
                        {(slot?.subStats?.length ?? 0) < 5 && (
                          <button
                            type="button"
                            onClick={() => addSubStat(i)}
                            className="text-xs lg:text-sm px-2 py-1 rounded bg-amber-500/80 hover:bg-amber-500 cursor-pointer"
                          >
                            + Add
                          </button>
                        )}
                      </div>

                      <div className="mt-2 space-y-3">
                        {(slot?.subStats ?? []).map((row, j) => {
                          const labelValue = row?.statLabel ?? "";
                          const key = row?.stat ?? null;

          
                          const used = new Set(
                            (slot?.subStats ?? [])
                              .map((r, k) => (k === j ? null : r?.stat))
                              .filter(Boolean)
                          );

                          // tiers for current key (if chosen)
                          const tiers = key ? SUBSTAT_RANGES[key] : null;
                          const idx =
                            key && tiers
                              ? nearestTierIndex(tiers, row?.value)
                              : 0;

                          return (
                            <div key={j} className="space-y-2">
                              {/* label picker with options disabled if already used */}
                              <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                                <select
                                  className="border rounded bg-[var(--color-bg)] text-[var(--color-text)] text-xs lg:text-sm px-2 py-1"
                                  value={labelValue}
                                  onChange={(e) =>
                                    setSubStatLabel(i, j, e.target.value)
                                  }
                                >
                                  <option value="" disabled>
                                    Select Sub-Stats
                                  </option>
                                  {USER_SUBSTAT_LABELS.map((lbl) => {
                                    const k = statKeyFromLabel(lbl);
                                    const disabled = used.has(k);
                                    return (
                                      <option
                                        key={lbl}
                                        value={lbl}
                                        disabled={disabled}
                                      >
                                        {lbl}
                                        {disabled ? "" : ""}
                                      </option>
                                    );
                                  })}
                                </select>

                                <button
                                  type="button"
                                  onClick={() => removeSubStat(i, j)}
                                  className="text-xs px-2 py-1 rounded bg-gray-500/30 hover:bg-gray-500/50"
                                >
                                  Remove
                                </button>
                              </div>

                              {/* discrete tier slider */}
                              {key && Array.isArray(tiers) && tiers.length > 0 && (
                                <div className="grid gap-1">
                                  <input
                                    type="range"
                                    min={0}
                                    max={tiers.length - 1}
                                    step={1}
                                    value={idx}
                                    onChange={(e) => {
                                      const newIdx = Number(e.target.value);
                                      const val = tiers[newIdx];
                                      setSubStatValue(i, j, val);
                                    }}
                                  />
                                  <div className="flex gap-2">
                                  <img src={getIconForStat(key)} className="brightness-[var(--color-img)] w-5 h-5 lg:w-6 lg:h-6"/>
                                  <p className="text-sm lg:text-base">
                                    {labelFromStatKey(key)}:{fmt(labelValue, tiers[idx])}{" "}
                                  </p>
                                    </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
        <EchoSet/>
        <EchoSetBuff/>
      <EchoModal open={open} onClose={() => setOpen(false)} onSelect={onSelect} />
    </div>
  );
}
