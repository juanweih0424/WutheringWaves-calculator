import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useResonator } from "./ResonatorContext";

const WeaponContext = createContext(null);


export function WeaponProvider({ children }) {
  const { current } = useResonator(); 
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentWeapon, setCurrentWeapon] = useState(null);
  const [weaponLevel, setWeaponLevel] = useState(90); 
  const [refine, setRefine] = useState(1)
  const [stacks, setStacks] = useState(0);

  useEffect(() => {
  if (!current) {
    setWeapons([]);
    setCurrentWeapon(null);
    return;
  }

  const ctrl = new AbortController();
  setCurrentWeapon(null);
  setWeaponLevel(90);
  setRefine(1);

  (async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://127.0.0.1:5000/v1/weapons", { signal: ctrl.signal });
      if (!res.ok) throw new Error("Failed to fetch weapons");

      const data = await res.json();
      const list = Array.isArray(data) ? data : [];

      const filtered = list.filter(w => !current?.weapon || w.weapon === current.weapon);

      setWeapons(filtered);
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      setLoading(false);
    }
  })();

  return () => ctrl.abort();
}, [current?.weapon]);

  useEffect(() => {
    if (!currentWeapon) return;    
    setWeaponLevel(90);
    setRefine(1);
    setStacks(0);
  }, [currentWeapon]);   


  const weaponPassive = useMemo(()=>{
    if (!currentWeapon) return null;

    const passive = currentWeapon.passive;
    const currentRankStat = passive?.ranks[refine-1]

    const dict = {
      atkPct: currentRankStat?.atkPct != null ? (currentRankStat.atkPct * 100).toFixed(0) : "0",
      ult: currentRankStat?.ult != null ? (currentRankStat.ult * 100).toFixed(1) : "0",
      haDmg: currentRankStat?.haDmg != null ? (currentRankStat.haDmg * 100).toFixed(1) : "0",
      allAtr: currentRankStat?.allAtr != null ? (currentRankStat.allAtr * 100) : "0",
      baDmg: currentRankStat?.baDmg != null ? (currentRankStat.baDmg * 100) : "0",
      er: currentRankStat?.er != null ? (currentRankStat.er * 100).toFixed(1) : "0",
      skill: currentRankStat?.skill != null ? (currentRankStat.skill * 100) : "0",
      frazzle: currentRankStat?.frazzle != null ? (currentRankStat.frazzle * 100).toFixed(1) : "0",
      defIgnore: currentRankStat?.defIgnore != null ? (currentRankStat.defIgnore * 100).toFixed(2) : "0",
      defIgnorePerStack: currentRankStat?.defIgnorePerStack != null ? (currentRankStat.defIgnorePerStack * 100).toFixed(1) : "0",
    };

    const description = (passive?.description || "").replace(/\{(\w+)\}/g, (_, key) => {
      return dict[key] ?? `{${key}}`; 
    });


    return {
      name:passive?.name,
      description,
      atkPct: currentRankStat?.atkPct ?? null,
      ult: currentRankStat?.ult ?? null,
      maxStack: passive?.maxStack ?? 0,
      haDmg: currentRankStat?.haDmg ?? null,
      baDmg: currentRankStat?.baDmg ?? null,
      er: currentRankStat?.er ?? null,
      skill: currentRankStat?.skill ?? null,
      allAtr: currentRankStat?.allAtr ?? null,
      defIgnorePerStack: currentRankStat?.defIgnorePerStack ?? null,
      stacksMax: currentRankStat?.defIgnorePerStack != null ? 5 : 0,
      defIgnore:   (currentRankStat?.defIgnorePerStack !== undefined && currentRankStat?.defIgnorePerStack !== null)
      ? currentRankStat.defIgnorePerStack * (stacks ?? 0)
      : (currentRankStat?.defIgnore ?? 0),
      frazzle:currentRankStat?.frazzle ?? null,
      defIgnoreScope: passive?.defIgnoreScope ?? null
    }
  },[refine, currentWeapon, stacks])


  const weaponStats = useMemo(() => {
    if (!currentWeapon) return null;

    const LMIN = 1, LMAX = 90;
    const t = (weaponLevel - LMIN) / (LMAX - LMIN);
    const lerp = (a, b) => a + (b - a) * t;

    const atkBase = currentWeapon.atk.base;
    const atkMax  = currentWeapon.atk.max;
    const subKey  = currentWeapon.substat;      
    const subBase = currentWeapon.subval.base
    const subMax  = currentWeapon.subval.max

    const subValue = lerp(subBase, subMax);
    

    return {
      atk: Math.round(lerp(atkBase, atkMax)),
      subKey,
      subValue,                                      
      subDisplay: `${(subValue * 100).toFixed(1)}%`, 
    };
  }, [currentWeapon, weaponLevel]);


  const value = useMemo(() => ({
    weapons, loading, error,
    currentWeapon, setCurrentWeapon,
    weaponLevel, setWeaponLevel,
    weaponStats, refine, setRefine, weaponPassive, stacks,setStacks
  }), [weapons, loading, error, currentWeapon, weaponLevel, weaponStats, refine,weaponPassive, stacks]);

  return <WeaponContext.Provider value={value}>{children}</WeaponContext.Provider>;
}

export function useWeapon() {
  const ctx = useContext(WeaponContext);
  if (!ctx) throw new Error("useWeapon must be used within <WeaponProvider>");
  return ctx;
}
