import { useMemo } from "react";
import { useResonator } from "../context/ResonatorContext";
import { useStats } from "../hooks/useStats";
import { talentMv, finalHit } from "../utils/dmg";

export default function Outro() {
  const stats = useStats();
  const { current } = useResonator();

  const scopedChain = stats?.scopedChain ?? [];
  const scopedInherent = stats?.scopedInherent ?? [];
  const title = current?.outro?.name ?? "Outro Skill";
  const ability = current?.outro?.detail ?? null;

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
  }

  // ---------- Build base rows ----------
  const rows = useMemo(() => {
    if (!ability) return [];
    return Object.entries(ability).map(([label, row]) => ({
      label,
      type: row.type,
      frazzle: row.frazzle ?? null,
      erosion: row.erosion ?? null,
      mv: talentMv(1, 10, row.base, row.max, 1),
      tags: row.tags ?? [],
    }));
  }, [ability, current?.id]);

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
      let scalingBonusAdd = 0;
      let rowDefIgnore = 0; // extra defIgnore from scoped effects
      let addAllAmp = 0; // extra amplification
      let addTypeBonus = 0; // extra type DMG bonus
      let addElemBonus = 0; // extra element DMG bonus
      let receivedAmp = 0;
      let atkPct = Number(stats?.atkPct ?? 0);
      let hpPct = Number(stats?.hpPct ?? 0);
      let defPct = Number(stats?.defPct ?? 0);
      let specificCd = 0;

      for (const eff of pool) {
        if (!matches(eff.appliesTo, row)) continue;
        const amt = Number(eff.amount ?? eff.value ?? 0);

        switch (eff.stat) {
          case "skillBouns":
            scalingBonus += amt;
            break;
          case "skillBounsAdd":
            scalingBonusAdd += amt;
            break;
          case "defIgnore":
            rowDefIgnore += amt;
            break;
          case "allAmp":
            addAllAmp += amt;
            break;
          case "cd":
            specificCd += amt;
            break;
          case "receivedAmp":
            receivedAmp += amt;
            break;
          case "baDmg":
          case "haDmg":
          case "skill":
          case "ult":
            if (eff.stat === row.type) addTypeBonus += amt;
            break;
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
      const mv = (baseMv + scalingBonusAdd) * (1 + scalingBonus);
      const atk = baseAtk * (1 + atkPct) + flatAtk;
      const hp = baseHp * (1 + hpPct) + flatHp;
      const def = baseDef * (1 + defPct) + flatDef;

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
        scalingBonus,
        defIgnore: rowDefIgnore,
        addAllAmp,
        addTypeBonus,
        addElemBonus,
        receivedAmp,
      };
    });
  }, [rows, stats, scopedInherent, scopedChain, defIgnoreGlobal, defIgnoreScope, current?.element]);

  const typeBonusKey = (t) =>
    t === "baDmg" ? "baDmg" :
    t === "haDmg" ? "haDmg" :
    t === "skill" ? "skill" :
    t === "ult"   ? "ult"   : null;

  const computedRows = useMemo(() => {
    if (!rowsWithMods.length || !stats || !current) return [];

    const elementKey = (current.element ?? "").toLowerCase();
    const baseElemBonus = Number(stats?.[elementKey] ?? 0);
    const baseReceivedAmp = Number(stats?.receivedAmp ?? 0);

    return rowsWithMods.map((row) => {
      const tbKey = typeBonusKey(row.type);
      const baseTypeBonus = Number(tbKey ? stats?.[tbKey] ?? 0 : 0);

      const { nonCrit, crit, avg } = finalHit({
        atk: row.atk,
        mv: Number(row.mv ?? 0),
        scalingBonus: 0,
        elementBonus: baseElemBonus + (row.addElemBonus ?? 0),
        skillBonus: baseTypeBonus + (row.addTypeBonus ?? 0),
        allAmp: Number(stats.allAmp ?? 0) + (row.addAllAmp ?? 0),
        elementAmp: 0,
        skillTypeAmp: 0,
        attackerLevel: Number(current.level ?? 90),
        enemyLevel: Number(stats.enemylevel ?? 100),
        defIgnore: Number(row.defIgnore ?? 0),
        defReduction: 0,
        resistance: Number(stats.enemyRes ?? 0) / 100,
        resShred: shred,
        critRate: Math.max(0, Math.min(1, (stats.cr ?? 0) / 100)),
        critDmgMult: Number(stats.cd ?? 0) / 100 + row.specificCd,
        receivedAmp: baseReceivedAmp + (row.receivedAmp ?? 0),
      });

      return { ...row, nonCrit, avg, crit };
    });
  }, [rowsWithMods, stats, current]);

  if (!stats || !current) return null;

  return (
    <div className="p-4 lg:m-4 grid gap-2 border-1 border-gray-500/30 shadow-md rounded-2xl">
      <p className="text-base lg:text-lg font-bold tracking-tight text-center text-[var(--color-highlight)]">
        {title}
      </p>
      {!ability && <div>N/A</div>}

      {computedRows.map((r) => (
        <div key={r.label} className="flex items-center justify-between px-3 py-2 odd:bg-gray-500/20">
          <div>
            <p className="text-xs lg:text-base font-medium">{r.label}</p>
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
