// client/src/context/WeaponBuffContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { useWeapon } from "./WeaponContext";
import { useResonator } from "./ResonatorContext";

const WeaponBuffContext = createContext(null);

function firstKey(obj) {
  const [k] = Object.keys(obj ?? {});
  return k;
}

export function WeaponBuffProvider({ children }) {
  const { weapons = [] } = useWeapon();
  const {current} = useResonator();
  const buffList = useMemo(() => {
    const out = [];
    for (const w of weapons) {
      if (!w?.buff?.effects?.length) continue;
      const statKey = firstKey(w.buff.effects[0]);
      const values = w.buff.effects.map((x) => x[statKey]);

      out.push({
        id: `${w.name}:${statKey}`,
        weaponName: w.name,
        description: w.buff.description,
        statKey,
        values,
        maxRefine: values.length,
      });
    }
    return out;
  }, [weapons]);

  const [enabled, setEnabled] = useState(() => ({}));      
  const [refineById, setRefineById] = useState(() => ({})); 

  const toggle = (id) => setEnabled((m) => ({ ...m, [id]: !m[id] }));
  const setRefine = (id, val) =>
    setRefineById((m) => ({ ...m, [id]: Math.max(1, Number(val) || 1) }));

  const clearAllBuffs = () => {
    setEnabled({});
    setRefineById({});
  };

  const clearWeaponBuff = useMemo(()=>{
    clearAllBuffs();
  },[current])

  const activeStats = useMemo(() => {
    const acc = {};
    for (const b of buffList) {
      if (!enabled[b.id]) continue;
      const r = Math.min(b.maxRefine, Math.max(1, refineById[b.id] ?? 1));
      const v = b.values[r - 1] ?? 0;
      acc[b.statKey] = (acc[b.statKey] ?? 0) + Number(v || 0);
    }
    return acc;
  }, [buffList, enabled, refineById]);


  const value = useMemo(
    () => ({
      buffList,
      enabled,
      refineById,
      toggle,
      setRefine,
      clearAllBuffs,
      activeStats,
    }),
    [buffList, enabled, refineById, activeStats]
  );

  return (
    <WeaponBuffContext.Provider value={value}>
      {children}
    </WeaponBuffContext.Provider>
  );
}

export function useWeaponBuff() {
  const ctx = useContext(WeaponBuffContext);
  if (!ctx) throw new Error("useWeaponBuff must be used inside WeaponBuffProvider");
  return ctx;
}
