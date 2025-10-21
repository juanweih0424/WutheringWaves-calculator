import { useMemo } from "react";
import { useResonator } from "../context/ResonatorContext";
import { useStats } from "../hooks/useStats";
import { talentMv, finalHit } from "../utils/dmg";

export default function Ult() {
  const stats = useStats();
  const { current, ult } = useResonator();

  const scopedChain = stats?.scopedChain ?? [];
  const scopedInherent = stats?.scopedInherent ?? [];
  const title = current?.ult?.name ?? "Forte Circuit";
  const ability = current?.ult?.detail ?? null;

  const defIgnoreScope = stats?.defIgnoreScope ?? null; // "all" | "baDmg" | "skill" | "ult"
  const defIgnoreGlobal = Number(stats?.defIgnore ?? 0);

  const baseAtk = stats?.baseAtk;
  const baseHp = stats?.baseHp;
  const baseDef = stats?.baseDef;
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
      let scalingBounsInc = 0; // Increase, and not by 
      let rowDefIgnore = 0;   // extra defIgnore from scoped effects
      let addAllAmp = 0;      // extra amplification
      let addTypeBonus = 0;   // extra type DMG bonus (only if matches row.type)
      let addElemBonus = 0;   // extra element DMG bonus (only if matches element)
      let atkPct = stats?.atkPct;
      let hpPct = stats?.hpPct;
      let defPct = stats?.defPct;
      for (const eff of pool) {
        if (!matches(eff.appliesTo, row)) continue;
        const amt = Number(eff.amount ?? eff.value ?? 0);

        switch (eff.stat) {
          // MV scaling
          case "skillBouns":
            scalingBonus += amt;
            break;
          case "skillBounsAdd":
            scalingBounsInc += amt;
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
            atkPct += amt;
            break;
          case "hpPct":
            hpPct += amt;
            break;
          case "defPct":
            defPct += amt;
            break;  
          default:
            break;
        }
      }

      const baseMv = row.mv;
      const mv = baseMv* (1 + scalingBonus) + scalingBounsInc;
      const atk = baseAtk * (1+atkPct) +stats.flatAtk
      const hp = baseHp * (1+hpPct) + stats.flatHp;
      const def = baseDef * (1+defPct) + stats.flatDef;

      // add global defIgnore if scope matches
      if (defIgnoreScope === "all" || defIgnoreScope === row.type) {
        rowDefIgnore += defIgnoreGlobal;
      }
      return {
        ...row,
        baseMv,
        atk,
        hp,
        def,
        mv,
        scalingBonus,
        defIgnore: rowDefIgnore,
        addAllAmp,
        addTypeBonus,
        addElemBonus,
      };
    });
  }, [rows, stats, scopedInherent, scopedChain, defIgnoreGlobal, defIgnoreScope, current?.element, ]);

  const typeBonusKey = (t) =>
    t === "baDmg" ? "baDmg" :
    t === "haDmg" ? "haDmg" :
    t === "skill" ? "skill" :
    t === "ult"   ? "ult"   : 
    t === "echoDmg" ? "echoDmg" : null;

  // ---------- Final damage per row ----------
  const computedRows = useMemo(() => {
    if (!rowsWithMods.length || !stats || !current) return [];

    const elementKey = (current.element ?? "").toLowerCase();
    const baseElemBonus = Number(stats?.[elementKey] ?? 0);
  
    const elementAmp =
      current.element === "Aero"    ? Number(stats.aeroAmp ?? 0) :
      current.element === "Fusion"  ? Number(stats.fusionAmp ?? 0) :
      current.element === "Glacio"  ? Number(stats.glacioAmp ?? 0) :
      current.element === "Spectro" ? Number(stats.spectroAmp ?? 0) :
      current.element === "Electro" ? Number(stats.electroAmp ?? 0) :
      current.element === "Havoc"   ? Number(stats.havocAmp ?? 0) :
      
      0;
    
    return rowsWithMods.map((row) => {
      const tbKey = typeBonusKey(row.type);
      const baseTypeBonus = Number(tbKey ? stats?.[tbKey] ?? 0 : 0);


      const skillTypeAmp =
        row.type === "baDmg" ? Number(stats.baAmp ?? 0) :
        row.type === "haDmg" ? Number(stats.haAmp ?? 0) :
        row.type === "skill" ? Number(stats.skillAmp ?? 0) :
        row.type === "ult"   ? Number(stats.ultAmp ?? 0) :
        row.type === "echoDmg" ? Number(stats.echoDmgAmp ?? 0):
        0;
      

      const { nonCrit, crit, avg } = finalHit({
        atk: row.atk,
        mv: Number(row.mv ?? 0),
        scalingBonus: 0, // already baked into mv
        elementBonus: baseElemBonus + (row.addElemBonus ?? 0),
        skillBonus: baseTypeBonus + (row.addTypeBonus ?? 0),
        allAmp: Number(stats.allAmp ?? 0) + (row.addAllAmp ?? 0),
        elementAmp: elementAmp,
        skillTypeAmp: skillTypeAmp,
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
        <div key={r.label} className="flex items-center justify-between px-3 py-2 odd:bg-gray-500/10">
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
