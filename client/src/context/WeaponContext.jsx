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


  const weaponStats = useMemo(() => {
    if (!currentWeapon) return null;

    const LMIN = 1, LMAX = 90;
    const t = (weaponLevel - LMIN) / (LMAX - LMIN);
    const lerp = (a, b) => a + (b - a) * t;

    const atkBase = currentWeapon?.atk?.base ?? 0;
    const atkMax  = currentWeapon?.atk?.max ?? 0;
    const subKey  = currentWeapon?.substat;         
    const subBase = currentWeapon?.subval?.base ?? 0;
    const subMax  = currentWeapon?.subval?.max ?? 0;

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
    weaponStats, refine, setRefine
  }), [weapons, loading, error, currentWeapon, weaponLevel, weaponStats, refine]);

  return <WeaponContext.Provider value={value}>{children}</WeaponContext.Provider>;
}

export function useWeapon() {
  const ctx = useContext(WeaponContext);
  if (!ctx) throw new Error("useWeapon must be used within <WeaponProvider>");
  return ctx;
}
