import { useMemo } from "react";
import { useResonator } from "../context/ResonatorContext";
import { useWeapon } from "../context/WeaponContext";

export function useEffectiveStats() {
  const { currentStats, level, basic,skill } = useResonator();
  const { weaponStats } = useWeapon();

  return useMemo(() => {
    if (!currentStats) return null;
    const base = currentStats;
    const w = weaponStats;

    const pctAdd = (k) => base[k] + (w && w.subKey === k ? w.subValue * 100 : 0);

    return {
        lvl:level,
        basic:basic,
        rskill:skill,
        atk: base.atk + (w?.atk ?? 0),
        hp: base.hp,
        def: base.def,

        cr: pctAdd("cr"),
        cd: pctAdd("cd"),
        er: pctAdd("er"),

        baDmg: base.baDmg,
        haDmg: base.haDmg,
        skill: base.skill,
        ult: base.ult,

        glacio: base.glacio,
        fusion: base.fusion,
        electro: base.electro,
        aero: base.aero,
        spectro: base.spectro,
        havoc: base.havoc,
        heal: base.heal,
    };
  }, [currentStats, weaponStats]);
}
