import React, { useMemo } from "react";
import { useResonator } from "../context/ResonatorContext";
import { useEffectiveStats } from "../hooks/useEffectiveStats";
import { talentMv, finalHit } from "../utils/dmg"; 
import {useEnemy} from "../context/EnemyContext"

export default function Outro() {
  const totals = useEffectiveStats();              
  const { current } = useResonator();       
  const {enemylvl, enemyres} = useEnemy();
  const applies = (scope, rowType) =>
  scope && (scope === "all" || scope === rowType);
  const elementKey = (current?.element ?? "").toLowerCase();

  const rows = useMemo(() => {
    if (!current || !totals) return [];    
    const detail = current?.outro?.detail || {};
    return Object.entries(detail).map(([label, row]) => {
      const mv = talentMv(1, 1, row.base, row.max, 1); 
      const defIgnore = applies(totals.defIgnoreScope, row.type)
      ? (totals.defIgnore ?? 0)
      : 0;
      const allAmp = totals.allAmp;
      const elementBonus = (totals[elementKey] ?? 0) / 100;
      const skillBonus = (totals[row.type] ?? 0) / 100;        
      const critRate = (totals.cr ?? 0) / 100;                
      const critDmgMult = (totals.cd ?? 0) / 100;
      const enemyLevel = enemylvl;
      const resistance = enemyres / 100;           
      const { nonCrit, avg, crit } = finalHit({
        atk: totals.atk,            
        mv,
        scalingBonus: 0,            
        elementBonus,
        skillBonus,
        allAmp,
        attackerLevel: totals.lvl,
        enemyLevel,
        defIgnore,
        defReduction: 0,
        resistance,          
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
  }, [current?.id, current?.outro?.detail, totals,  elementKey,enemylvl,enemyres]);
    return current ? (
    <div className="p-4 grid gap-2 border-0 shadow-xl">
      <h2 className="text-lg font-bold">{current.outro?.name ?? "Outro Skill"}</h2>
      {(rows ?? []).map((r) => (
        <div
          key={r.key}
          className="flex items-center justify-between  px-3 py-2 odd:bg-[var(--color-hover)]/50"
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
  ) : null;


}