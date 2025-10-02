import { useMemo } from "react";
import { useResonator } from "../context/ResonatorContext";
import { useWeapon } from "../context/WeaponContext";

export function useEffectiveStats() {
  const { currentStats, level, minor1, minor2, charPassive } = useResonator();
  const { weaponStats, refine, currentWeapon, weaponPassive, stacks } = useWeapon();
  

  return useMemo(() => {
    if (!currentStats) return null;

    const base = currentStats;
    const w = weaponStats;
    const passive = weaponPassive ?? null;
    const pctAdd = (k, extraPts = 0) =>
      (base[k] ?? 0) +
      (w?.subKey === k ? (w.subValue ?? 0) * 100 : 0) +
      (extraPts ?? 0);

    const sub = (k) => (w?.subKey === k ? (w?.subValue ?? 0) : 0); 

    const readMinor = (m) => (m ? Object.entries(m)[0] : null);
    const m1 = readMinor(minor1);
    const m2 = readMinor(minor2);
    const minorBonus = { atk: 0, hp: 0, def: 0, cr: 0, cd: 0, er: 0 };
    if (m1) minorBonus[m1[0]] = (minorBonus[m1[0]] ?? 0) + (m1[1] ?? 0);
    if (m2) minorBonus[m2[0]] = (minorBonus[m2[0]] ?? 0) + (m2[1] ?? 0);

    // base totals
    const totals = {
      lvl: level,
      atk: (base.atk + (w?.atk ?? 0)) * (1 + (passive?.atkPct ?? 0) + (sub("atk")) + (minorBonus.atk ?? 0)),
      hp:  base.hp * (1 + (minorBonus.hp ?? 0) + (sub("hp"))),
      def: base.def  * (1 + (minorBonus.hp ?? 0) + (sub("def"))),

      // % numbers for UI
      cr: pctAdd("cr") + ((minorBonus.cr ?? 0) * 100) + (passive?.cr ?? 0) * 100,
      cd: pctAdd("cd") + ((minorBonus.cd ?? 0) * 100) + (passive?.cd ?? 0) * 100,
      er: pctAdd("er") + ((minorBonus.er ?? 0) * 100) + (passive?.er ?? 0) * 100,

      baDmg: (passive?.baDmg ?? 0) * 100,
      haDmg: (passive?.haDmg ?? 0) * 100,
      skill: (passive?.skill ?? 0) * 100,
      ult:   (passive?.ult ?? 0) * 100,

      // element bonuses as % numbers
      glacio: (passive?.allAtr ?? 0) * 100,
      fusion: (passive?.allAtr ?? 0) * 100,
      electro: (passive?.allAtr ?? 0) * 100,
      aero: (passive?.allAtr ?? 0) * 100,
      spectro: (passive?.allAtr ?? 0) * 100,
      havoc: (passive?.allAtr ?? 0) * 100,
      heal: 0,

      frazzle:0,
  
      defIgnore: passive?.defIgnore ?? 0,             
      defIgnoreScope: passive?.defIgnoreScope ?? null, 
      allAmp: 0,                                       
    };

    // ---- Apply character self-buff dynamically by type
    // charPassive.value is already the effective fraction (stacks handled in provider)
    const applyCharBuff = (buff) => {
      if (!buff) return;
      const t = buff.buffType;      
      const v = buff.value ?? 0;    

      if (t === "allAmp") {
        totals.allAmp = (totals.allAmp ?? 0) + v;              
        return;
      }

      const elementKeys = new Set(["glacio", "fusion", "electro", "aero", "spectro", "havoc", "heal"]);
      if (elementKeys.has(t)) {
        totals[t] = (totals[t] ?? 0) + v * 100;                 
        return;
      }

      const typeKeys = new Set(["baDmg", "haDmg", "skill", "ult"]);
      if (typeKeys.has(t)) {
        totals[t] = (totals[t] ?? 0) + v * 100;                 
        return;
      }

    };

    applyCharBuff(charPassive);

    return totals;
  }, [
    currentStats, weaponStats, currentWeapon, refine, level, stacks,
    weaponPassive, minor1, minor2, charPassive
  ]);
}
