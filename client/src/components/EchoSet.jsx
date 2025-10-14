import React from "react";
import { useEchoSet } from "../context/EchoSetContext";
import { labelFromStatKey } from "../context/EchoContext";
import {buffMeta, getIconForStat} from "../utils/statsMeta";
import { tokenizeDescription } from "../utils/formatDescription";

/** Percent-style stats (for value formatting) */
const PCT_STATS = new Set([
  // core %
  "aero","glacio","fusion","electro","havoc","spectro",
  "hpPct","atkPct","defPct","cr","cd","er","heal","skill","ult","haDmg","baDmg", 
  // set-only %
  "outro","echoDmg","echoDmgAll","atkPctAll","atkPctTm",
  "fusionAll","aeroTm","havocTm","allAtr",
]);

/** Show 2-Set / 3-Set / 5-Set headers */
const PIECE_TITLE = { "2pc": "2-Set", "3pc": "3-Set", "5pc": "5-Set" };

/** Pretty labels for every effects[].stat we’ve seen */
const STAT_OVERRIDES = {
  // base stats / rates
  hpPct: "HP %",
  atkPct: "ATK %",
  defPct: "DEF %",
  cr: "Crit Rate",
  cd: "Crit DMG",
  er: "Energy Regen",
  heal: "Healing Bonus",

  // elemental dmg
  aero: "Aero DMG Bouns",
  glacio: "Glacio DMG Bouns",
  fusion: "Fusion DMG Bouns",
  electro: "Electro DMG Bouns",
  spectro: "Spectro DMG Bouns",
  havoc: "Havoc DMG Bouns",

  // skill-type dmg
  skill: "Resonance Skill DMG Bouns",
  ult: "Resonance Liberation DMG Bouns",
  haDmg: "Heavy Attack DMG Bouns",
  baDmg: "Basic Attack DMG Bouns",
  outro: "Outro Skill DMG Bouns",
  echoDmg: "Echo Skill DMG Bouns",

  // team / target modifiers
  atkPctAll: "Increase All members ATK %",
  echoDmgAll: "Increase All members Echo Skill DMG Bouns",
  fusionAll: "Increasae All members Fusion DMG Bouns",

  // “incoming/next resonator” style
  atkPctTm: "Increase next Resonator ATK %",
  aeroTm: "Increase All members Aero DMG Bouns",
  havocTm: "Increase next Resonator Havoc DMG Bouns",

  // global attribute bonus
  allAtr: "All Attribute DMG Bouns",
};

function prettyStatLabel(stat) {
  if (STAT_OVERRIDES[stat]) return STAT_OVERRIDES[stat];
  const fromCtx = typeof labelFromStatKey === "function" ? labelFromStatKey(stat) : null;
  if (fromCtx) return fromCtx.replace("%", " %");
  return stat.toUpperCase();
}

function fmtVal(stat, value) {
  if (value == null) return "";
  if (PCT_STATS.has(stat)) {
    const n = value * 100;
    const r = Math.round(n * 10) / 10;
    const isInt = Math.abs(r - Math.round(r)) < 0.05;
    return `${isInt ? Math.round(r) : r}%`;
  }
  return String(value);
}

function EffectsList({ which, selSet, pieces }) {
  const { stacks, setEffectStack } = useEchoSet();
  if (!selSet?.set) return null;

  return (
    <div className="space-y-3">
      {pieces.map((piece) => {
        const data = selSet.set[piece];
        if (!data) return null;
        const effects = data.effects || [];
        return (
          <div key={piece} className="space-y-1">
            <div className="text-base font-semibold">
              {PIECE_TITLE[piece] ?? piece.toUpperCase()}
            </div>
            {data.desc && <p className="tracking-tight">{data.desc}</p>}

            <div className="space-y-1">
              {effects.map((ef, idx) => {
                const key = `${piece}-${idx}`;
                const curStacks = stacks?.[which]?.[key] ?? 0;
                const max = ef.maxStack;
                const totalVal = (ef?.stack ? (ef.value * curStacks) : ef.value) || 0;
                const icon = getIconForStat(ef.stat);
                const isElement = buffMeta.some(m => m.key === ef.stat && m.isElement);
                const tint = isElement ? "" : "brightness-[var(--color-img)]";
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 rounded-md bg-gray-500/10 px-2 py-1"
                  >
                    <div className="flex gap-2">
                    <img src={icon} className={`w-6 h-6 ${tint}`}/>
                    <p className="font-medium">{prettyStatLabel(ef.stat)}</p>{" "}
                    </div>
                    <div className="flex items-center gap-2">
                      {ef.stack && (
                        <>
                          <p className="">Stack: </p> 
                          <input
                            type="number"
                            min={0}
                            max={max}
                            value={curStacks}
                            onChange={(e) =>
                              setEffectStack(
                                which,
                                key,
                                Math.max(0, Math.min(max, Number(e.target.value) || 0))
                              )
                            }
                            className="w-14 h-6 text-center border rounded text-sm bg-[var(--color-bg)]"
                          />
                        </>
                      )}
                      <span className="font-semibold">{fmtVal(ef.stat, totalVal)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Section({ title, which, pieces }) {
  const { setsCatalog, set1Id, set2Id, setSelectedSet, getSetById } = useEchoSet();
  const selectedId = which === "first" ? set1Id : set2Id;
  const selected = getSetById(selectedId);

  // Only sets that have at least one of the requested pieces.
  const available = (setsCatalog || []).filter(
    (s) => s?.set && pieces.some((p) => Object.prototype.hasOwnProperty.call(s.set, p))
  );

  return (
    <div className="rounded-xl border shadow-md border-gray-600/40 p-3 space-y-2">
      <div className="font-medium">{title}</div>
      <select
        className="w-full border rounded px-2 py-1 text-sm bg-[var(--color-bg)] text-[var(--color-text)]"
        value={selectedId ?? ""}
        onChange={(e) => setSelectedSet(which, e.target.value || null)}
      >
        <option value="">
          {which === "first" ? "Choose a 2-Set" : "Choose a 5-Set / 3-Set"}
        </option>
        {available.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {!selected ? (
        <div className="opacity-70">
          {which === "first"
            ? "No first echo set bonus is configured."
            : "No second echo set bonus is configured."}
        </div>
      ) : (
        <EffectsList which={which} selSet={selected} pieces={pieces} />
      )}
    </div>
  );
}

export default function EchoSet() {

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold mt-2">Set Bonuses</p>
      <Section title="Choose 2-Pc Set Effect" which="first" pieces={["2pc"]} />
      <Section title="Choose 3-PC/5-Pc Set Effect" which="second" pieces={["5pc", "3pc"]} />
    </div>
  );
}
