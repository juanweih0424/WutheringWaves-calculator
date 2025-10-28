import { useMemo } from "react";
import { useResonator } from "../context/ResonatorContext";
import { useResonatorChain } from "../context/ResonatorChainContext";
import { useStats } from "../hooks/useStats";
import { talentMv, finalHit } from "../utils/dmg";
import {
  useDetailMap,
  collectExtensions,
  mergeAbilityWithExtensions,
  applyRatioScaling,
} from "../utils/extensions";

export default function Skill() {
  const stats = useStats();
  const { current, skill } = useResonator();
  const { activeChain } = useResonatorChain();

  const scopedChain = stats?.scopedChain ?? [];
  const scopedInherent = stats?.scopedInherent ?? [];
  const title = current?.skill?.name ?? "Resonance Skill";
  const baseDetail = current?.skill?.detail ?? null;

  const detailMap = useDetailMap(current);
  const skillExtensions = useMemo(
    () => collectExtensions(activeChain, detailMap, "skill"),
    [activeChain, detailMap]
  );
  const { ability, ratioMeta } = useMemo(
    () => mergeAbilityWithExtensions(baseDetail, skillExtensions, "skill"),
    [baseDetail, skillExtensions]
  );

  const defIgnoreScope = stats?.defIgnoreScope ?? null; // "all" | "baDmg" | "skill" | "ult"
  const defIgnoreGlobal = Number(stats?.defIgnore ?? 0);

  const baseAtk = Number(stats?.baseAtk ?? 0);
  const baseHp = Number(stats?.baseHp ?? 0);
  const baseDef = Number(stats?.baseDef ?? 0);
  const flatAtk = Number(stats?.flatAtk ?? 0);
  const flatHp = Number(stats?.flatHp ?? 0);
  const flatDef = Number(stats?.flatDef ?? 0);

  let shred = 0;
  if (current?.element === "Aero") {
    shred = Number(stats?.aeroShred ?? 0);
  } else if (current?.element === "Havoc") {
    shred = Number(stats?.havocShred ?? 0);
  } else if (current?.element === "Spectro") {
    shred = Number(stats?.spectroShred ?? 0);
  } else if (current?.element === "Fusion") {
    shred = Number(stats?.fusionShred ?? 0);
  }

  // ---------- Build base rows ----------
  const rows = useMemo(() => {
    if (!ability) return [];
    return Object.entries(ability).map(([label, row]) => ({
      label,
      type: row.type,
      frazzle: row.frazzle ?? null,
      erosion: row.erosion ?? null,
      mv: talentMv(1, 10, row.base, row.max, skill),
      tags: Array.isArray(row.tags) ? row.tags : row.tags ? [row.tags] : [],
    }));
  }, [ability, current?.id, skill]);

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
      let scalingBonus = 0; // MV scaling (skillBouns)
      let scalingBounsInc = 0; // Additive increase
      let rowDefIgnore = 0; // extra defIgnore from scoped effects
      let addAllAmp = 0; // extra amplification
      let addTypeBonus = 0; // extra type DMG bonus (only if matches row.type)
      let addElemBonus = 0; // extra element DMG bonus (only if matches element)
      let receivedAmp = 0;
      let atkPct = Number(stats?.atkPct ?? 0);
      let hpPct = Number(stats?.hpPct ?? 0);
      let defPct = Number(stats?.defPct ?? 0);
      let specificCd = 0;
      let fusionAmp = 0;
      let skillInc = 0;

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
          case "defIgnore":
            rowDefIgnore += amt;
            break;
          // Amplification
          case "allAmp":
            addAllAmp += amt;
            break;
          case "cd":
            specificCd += amt;
            break;
          case "receivedAmp":
            receivedAmp += amt;
            break;
          case "fusionAmp":
            fusionAmp += amt;
            break;
          case "skillInc":
            skillInc += amt;
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
      const mv = baseMv * (1 + scalingBonus) + scalingBounsInc;
      const atk = baseAtk * (1 + atkPct) + flatAtk;
      const hp = baseHp * (1 + hpPct) + flatHp;
      const def = baseDef * (1 + defPct) + flatDef;
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
        specificCd,
        fusionAmp,
        scalingBonus,
        defIgnore: rowDefIgnore,
        addAllAmp,
        addTypeBonus,
        addElemBonus,
        receivedAmp,
        skillInc,
      };
    });
  }, [rows, stats, scopedInherent, scopedChain, defIgnoreGlobal, defIgnoreScope, current?.element]);

  const rowsWithRatios = useMemo(
    () => applyRatioScaling(rowsWithMods, ratioMeta, "skill"),
    [rowsWithMods, ratioMeta]
  );

  const typeBonusKey = (t) =>
    t === "baDmg" ? "baDmg" :
    t === "haDmg" ? "haDmg" :
    t === "skill" ? "skill" :
    t === "ult" ? "ult" :
    t === "echoDmg" ? "echoDmg" : null;

  // ---------- Final damage per row ----------
  const computedRows = useMemo(() => {
    if (!rowsWithRatios.length || !stats || !current) return [];

    const elementKey = (current.element ?? "").toLowerCase();
    const baseElemBonus = Number(stats?.[elementKey] ?? 0);
    const baseReceivedAmp = Number(stats?.receivedAmp ?? 0);
    const dmgInc = Number(stats?.dmgInc ?? 0);

    const elementAmp =
      current.element === "Aero" ? Number(stats?.aeroAmp ?? 0) :
      current.element === "Fusion" ? Number(stats?.fusionAmp ?? 0) :
      current.element === "Glacio" ? Number(stats?.glacioAmp ?? 0) :
      current.element === "Spectro" ? Number(stats?.spectroAmp ?? 0) :
      current.element === "Electro" ? Number(stats?.electroAmp ?? 0) :
      current.element === "Havoc" ? Number(stats?.havocAmp ?? 0) :
      0;

    return rowsWithRatios.map((row) => {
      const tbKey = typeBonusKey(row.type);
      const baseTypeBonus = Number(tbKey ? stats?.[tbKey] ?? 0 : 0);

      let skillTypeAmp =
        row.type === "baDmg" ? Number(stats?.baAmp ?? 0) :
        row.type === "haDmg" ? Number(stats?.haAmp ?? 0) :
        row.type === "skill" ? Number(stats?.skillAmp ?? 0) :
        row.type === "ult" ? Number(stats?.ultAmp ?? 0) :
        row.type === "echoDmg" ? Number(stats?.echoDmgAmp ?? 0) :
        0;

      if (row.frazzle) {
        skillTypeAmp += Number(stats?.frazzleAmp ?? 0);
      }

      if (row.erosion) {
        skillTypeAmp += Number(stats?.erosionAmp ?? 0);
      }

      const finalStat = current?.hpDmgBase ? row.hp : row.atk;

      let specificAmp = 0;
      if (current.element === "Fusion") {
        specificAmp += Number(row.fusionAmp ?? 0);
      }

      const { nonCrit, crit, avg } = finalHit({
        atk: finalStat,
        mv: Number(row.mv ?? 0),
        scalingBonus: 0,
        elementBonus: baseElemBonus + (row.addElemBonus ?? 0) + dmgInc,
        skillBonus: baseTypeBonus + (row.addTypeBonus ?? 0) + (row.skillInc ?? 0),
        allAmp: Number(stats?.allAmp ?? 0) + (row.addAllAmp ?? 0) + specificAmp,
        elementAmp,
        skillTypeAmp,
        attackerLevel: Number(current.level ?? 90),
        enemyLevel: Number(stats?.enemylevel ?? 100),
        defIgnore: Number(row.defIgnore ?? 0),
        defReduction: 0,
        resistance: Number(stats?.enemyRes ?? 0) / 100, // 20 -> 0.20
        resShred: shred,
        critRate: Math.max(0, Math.min(1, (stats?.cr ?? 0) / 100)),
        critDmgMult: Number(stats?.cd ?? 0) / 100 + row.specificCd,
        receivedAmp: baseReceivedAmp + row.receivedAmp,
      });

      return { ...row, nonCrit, avg, crit };
    });
  }, [rowsWithRatios, stats, current]);

  if (!stats || !current || !ability) return null;

  return (
    <div className="p-4 lg:m-4 grid gap-2 border-1 border-gray-500/30 shadow-md rounded-2xl">
      <p className="text-base lg:text-lg font-bold tracking-tight text-center text-[var(--color-highlight)]">
        {title}
      </p>

      {computedRows.map((r) => (
        <div key={r.label} className="flex items-center justify-between px-3 py-2 odd:bg-gray-500/20">
          <div>
            <p className="text-xs lg:text-base font-medium">{r.label}</p>
            {/*<div className="text-xs opacity-70">MV {(r.mv * 100).toFixed(2)}%</div>*/}
          </div>

          <div className="grid grid-cols-3 gap-1 lg:gap-4 text-right">
            <div>
              <div className="text-xs opacity-70">Non-Crit</div>
              <div className="text-xs lg:text-base font-semibold">{Math.round(r.nonCrit).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Avg</div>
              <div className="text-xs lg:text-base font-semibold">{Math.round(r.avg).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs opacity-70">Crit</div>
              <div className="text-xs lg:text-base font-semibold">{Math.round(r.crit).toLocaleString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
