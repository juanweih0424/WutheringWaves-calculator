import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useEchoSet } from "./EchoSetContext";
import { useResonator } from "./ResonatorContext";
const BuffContext = createContext(null);

export function BuffProvider({ children}) {

    const [enabled, setEnabled] = useState({});           
    const [stacks, setStacks]   = useState({});         
    const {setsCatalog} = useEchoSet();    
    const {current} = useResonator();

    const setBuffEnabled = (setId, isEnabled) =>
        setEnabled(prev => ({ ...prev, [setId]: !!isEnabled }));

    const setBuffStack = (setId, effectKey, nextVal) =>
        setStacks(prev => ({
        ...prev,
        [setId]: {
            ...(prev[setId] || {}),
            [effectKey]: Math.max(0, Number(nextVal) || 0),
        },
        }));

    const clearAllBuffs = () => {
        setEnabled({});
        setStacks({});
    };

    const clearAll = useMemo(()=>{
        clearAllBuffs();
    }, [current])

    const computeTotals = (setsCatalog = []) => {
        const totals = Object.create(null);

        const add = (k, v) => {
        if (!k || typeof v !== "number") return;
        totals[k] = (totals[k] ?? 0) + v;
        };

        for (const s of setsCatalog) {
        const id = s?.id;
        if (!id || !s?.buff || !enabled[id]) continue;

        const effs = s.buff.effects || [];
        const setStacksFor = stacks[id] || {};

        effs.forEach((ef, idx) => {
            const key = String(idx);
            const base = Number(ef?.value) || 0;
            if (ef?.stack) {
            const used = setStacksFor[key] ?? 0;
            add(ef.stat, base * used);
            } else {
            add(ef.stat, base);
            }
        });
        }
        return totals;
    };

    const echoTeamTotals = useMemo(() => computeTotals(setsCatalog), [
        enabled,
        stacks,
        setsCatalog,
    ]);
        

    const value = useMemo(
        () => ({
            enabled,
            stacks,
            echoTeamTotals,
            setBuffEnabled,
            setBuffStack,
            clearAllBuffs,
            computeTotals,
        }),
        [      
            enabled,
            stacks,
        ]
    );

    return <BuffContext.Provider value={value}>{children}</BuffContext.Provider>;
}

export function useBuff() {
  const ctx = useContext(BuffContext);
  if (!ctx) throw new Error("");
  return ctx;
}