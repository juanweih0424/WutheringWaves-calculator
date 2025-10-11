import { useMemo } from "react";
import { useResonator } from "../context/ResonatorContext";
import { useStats } from "../hooks/useStats";
import { talentMv, finalHit } from "../utils/dmg";

export default function Ult() {
  const stats = useStats();
  const { current, ult } = useResonator();

  const scopedChain = stats?.scopedChain ?? [];
  const scopedInherent = stats?.scopedInherent ?? [];
  const title = current?.ult?.name ?? "Resonance Liberation";
  const ability = current?.ult?.detail ?? null;

  const defIgnoreScope = stats?.defIgnoreScope ?? null; // "all" | "baDmg" | "skill" | "ult"
  const defIgnoreGlobal = Number(stats?.defIgnore ?? 0);


  let atk = stats?.atk;
  let shred = 0;
  if (current?.element === "Aero"){
    shred = stats.aeroShred;
  } else if (current?.element === "Havoc"){
    shred = stats.havocShred;
  }

  // ---------- Build base rows ----------
  const rows = useMemo(() => {
    if (!ability) return [];
    return Object.entries(ability).map(([label, row]) => ({
      label,
      type: row.type,
      mv: talentMv(1, 10, row.base, row.max, ult),
      tags: row.tags ?? [],
    }));
  }, [ability, current?.id, ult]);

  // ---------- Apply scoped effects (inherent + chain) ----------
  const rowsWithMods = useMemo(() => {
    if (!rows.length || !stats) return [];

    const pool = [...scopedInherent, ...scopedChain];
    const elementKey = (current?.element ?? "").toLowerCase(); // "fusion"|"aero"|...

    const matches = (appliesTo, row) => {
      const arr = Array.isArray(appliesTo) ? appliesTo : [appliesTo];
      return arr.some((p) => {
        if (!p) return false;
        if (p === "all") return true;
        if (typeof p === "string") {
          return row.tags?.includes(p) || p === row.type || row.label.includes(p);
        }
        if (typeof p === "object") {
          if (p.type === "tag") return row.tags?.includes(p.match);
          if (p.type === "row.type") return p.match === row.type;
          if (p.type === "row.label") return row.label.includes(p.match);
        }
        return false;
      });
    };

    return rows.map((row) => {
      let scalingBonus = 0;   // MV scaling (skillBouns)
      let rowDefIgnore = 0;   // extra defIgnore from scoped effects
      let addAllAmp = 0;      // extra amplification
      let addTypeBonus = 0;   // extra type DMG bonus (only if matches row.type)
      let addElemBonus = 0;   // extra element DMG bonus (only if matches element)

      for (const eff of pool) {
        if (!matches(eff.appliesTo, row)) continue;
        const amt = Number(eff.amount ?? eff.value ?? 0);

        switch (eff.stat) {
          // MV scaling
          case "skillBouns":
            scalingBonus += amt;
            break;
          case "defIgnore": rowDefIgnore += amt; break;
          // Amplification
          case "allAmp":
            addAllAmp += amt;
            break;

          // Type DMG bonus (apply only if matches row.type)
          case "baDmg":
          case "haDmg":
          case "skill":
          case "ult":
            if (eff.stat === row.type) addTypeBonus += amt;
            break;

          // Element DMG bonus (apply only if matches current element)
          case "fusion":
          case "aero":
          case "spectro":
          case "electro":
          case "glacio":
          case "havoc":
            if (eff.stat === elementKey) addElemBonus += amt;
            break;

          case "atkPct":
            atk = stats.baseAtk * (1+stats.atkPct+amt);

          default:
            break;
        }
      }

      const baseMv = row.mv;
      const mv = baseMv * (1 + scalingBonus);

      // add global defIgnore if scope matches
      if (defIgnoreScope === "all" || defIgnoreScope === row.type) {
        rowDefIgnore += defIgnoreGlobal;
      }

      return {
        ...row,
        baseMv,
        mv,
        scalingBonus,
        defIgnore: rowDefIgnore,
        addAllAmp,
        addTypeBonus,
        addElemBonus,
      };
    });
  }, [rows, stats, scopedInherent, scopedChain, defIgnoreGlobal, defIgnoreScope, current?.element]);

  const typeBonusKey = (t) =>
    t === "baDmg" ? "baDmg" :
    t === "haDmg" ? "haDmg" :
    t === "skill" ? "skill" :
    t === "ult"   ? "ult"   : null;

  // ---------- Final damage per row ----------
  const computedRows = useMemo(() => {
    if (!rowsWithMods.length || !stats || !current) return [];

    const elementKey = (current.element ?? "").toLowerCase();
    const baseElemBonus = Number(stats?.[elementKey] ?? 0);

    return rowsWithMods.map((row) => {
      const tbKey = typeBonusKey(row.type);
      const baseTypeBonus = Number(tbKey ? stats?.[tbKey] ?? 0 : 0);
      
      const { nonCrit, crit, avg } = finalHit({
        atk: atk,
        mv: Number(row.mv ?? 0),
        scalingBonus: 0, // already baked into mv
        elementBonus: baseElemBonus + (row.addElemBonus ?? 0),
        skillBonus: baseTypeBonus + (row.addTypeBonus ?? 0),
        allAmp: Number(stats.allAmp ?? 0) + (row.addAllAmp ?? 0),
        elementAmp: 0,
        skillTypeAmp: 0,
        attackerLevel: Number(current.level ?? 90),
        enemyLevel: Number(stats.enemylevel ?? 100),
        defIgnore: Number(row.defIgnore ?? 0),
        defReduction: 0,
        resistance: Number(stats.enemyRes ?? 0) / 100, // 20 -> 0.20
        resShred: shred,
        critRate: Math.max(0, Math.min(1, (stats.cr ?? 0) / 100)),    
        critDmgMult:  Number(stats.cd ?? 0) / 100,                 
      });

      return { ...row, nonCrit, avg, crit };
    });
  }, [rowsWithMods, stats, current]);

  if (!stats || !current || !ability) return null;

  
  return (
    <div className="m-4 p-4 grid gap-2 border-0 shadow-2xl rounded-2xl">
      <p className="text-xl font-bold tracking-tight text-center text-[var(--color-highlight)]">
        {title}
      </p>

      {computedRows.map((r) => (
        <div key={r.label} className="flex items-center justify-between px-3 py-2">
          <div>
            <p className="font-medium">{r.label}</p>
            <div className="text-xs opacity-70">MV {(r.mv * 100).toFixed(2)}%</div>
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
