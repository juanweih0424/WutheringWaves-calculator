import React from "react";
import { statsMeta, getIconForStat } from "../utils/statsMeta";
import { useEffectiveStats } from "../hooks/useEffectiveStats";
import { useWeapon } from "../context/WeaponContext";

export default function Stats() {
  const totals = useEffectiveStats();
  const { weaponStats } = useWeapon(); 

  if (!totals) return null;
  
  return (
    <div className="p-4 flex flex-col">
      {statsMeta.map(({ key, label, fmt, isElement }) => {
        if (!(key in totals)) return null;
        const total = totals[key];

        let bonusText = null;
        if (weaponStats) {
          if (key === "atk" && weaponStats.atk) {
            bonusText = `+${weaponStats.atk.toLocaleString()}`;
          } else if (["cr","cd","er"].includes(key) && weaponStats.subKey === key) {
            bonusText = `+${(weaponStats.subValue * 100).toFixed(1)}%`;
          }
        }
        return (
          <div key={key} className="flex justify-between items-center odd:bg-[var(--color-hover)]/50 px-3 py-2 rounded-md">
            <div className="flex gap-2 items-center">
              <img src={getIconForStat(key)} className={`size-7 ${isElement ? "" : "brightness-[var(--color-img)]"}`} alt={label}/>
              <p className="font-semibold text-lg">{label}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-lg">{(fmt ?? (v => v))(total)}</p>
              {bonusText && (
                <span className="text-base font-medium text-emerald-600 bg-emerald-600/10 px-2 py-0.5 rounded">
                  {bonusText}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
