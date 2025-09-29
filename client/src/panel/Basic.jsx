import React, { useMemo } from "react";
import { useResonator } from "../context/ResonatorContext";
import { useEffectiveStats } from "../hooks/useEffectiveStats";
import { talentMv, finalHit } from "../utils/dmg"; 

export default function Basic() {
  const totals = useEffectiveStats();              
  const { current, basic } = useResonator();       

  if (!current || !totals) return null;

  const elementKey = (current.element || "").toLowerCase();

  const rows = useMemo(() => {
    const detail = current?.basic?.detail || {};
    return Object.entries(detail).map(([label, row]) => {
      const mv = talentMv(1, 10, row.base, row.max, basic); 

      const elementBonus = (totals[elementKey] ?? 0) / 100;
      const skillBonus = (totals[row.type] ?? 0) / 100;        
      const critRate = (totals.cr ?? 0) / 100;                
      const critDmgMult = (totals.cd ?? 0) / 100;          
      const { nonCrit, avg, crit } = finalHit({
        atk: totals.atk,            
        mv,
        scalingBonus: 0,            
        elementBonus,
        skillBonus,
        attackerLevel: totals.lvl,
        enemyLevel: 100,
        defIgnore: 0,
        defReduction: 0,
        resistance: 0.20,          
        resShred: 0,
        critRate,
        critDmgMult,
      });

      return {
        key: label,
        label,
        mv,
        nonCrit,
        avg,
        crit,
      };
    });
  }, [current?.id, current?.basic?.detail, totals, basic, elementKey]);

  return (
    <div className="p-4 grid gap-2">
      <h2 className="text-lg font-bold">{current.basic?.name ?? "Basic Attack"}</h2>
      {rows.map((r) => (
        <div
          key={r.key}
          className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2"
        >
          <div className="min-w-0">
            <p className="font-medium">{r.label}</p>
            <p className="text-xs opacity-70">MV: {(r.mv * 100).toFixed(2)}%</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-right">
            <div>
              <div className="text-xs opacity-70">Non-Crit</div>
              <div className="font-semibold">{Math.round(r.nonCrit).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Avg</div>
              <div className="font-semibold">{Math.round(r.avg).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Crit</div>
              <div className="font-semibold">{Math.round(r.crit).toLocaleString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
