import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useResonator } from "./ResonatorContext";

const ResonatorChainContext = createContext(null);

export function ResonatorChainProvider( { children }) {

    const {current} = useResonator();

    const [enabledChain, setEnabledChain] = useState({});
    const [chainStacks, setChainStacks] = useState({});

    useEffect(() => {
      if (!current?.chain) { setEnabledChain({}); setChainStacks({}); return; }
      const initEnabled = {};
      const initStacks  = {};

      for (const name of Object.keys(current.chain)) {
        initEnabled[name] = false;
        const hasStack = (current.chain[name].effects ?? []).some(e => e.stack);
        initStacks[name]  = hasStack ? 0 : 0;
      }
      setEnabledChain(initEnabled);
      setChainStacks(initStacks);
    }, [current?.id]);

    const getMaxStacks = (name) =>
      Math.max(
        1,
        ...((current?.chain?.[name]?.effects ?? [])
            .filter(e => e.stack)
            .map(e => e.maxStack ?? 1))
      );

    const toggleChain = (name) => {
      setEnabledChain(prev => {
        const willEnable = !prev[name];
        if (willEnable) {
          const hasStack = (current?.chain?.[name]?.effects ?? []).some(e => e.stack);
          if (hasStack) {
            const max = getMaxStacks(name);
            setChainStacks(s => ({ ...s, [name]: s[name] > 0 ? Math.min(s[name], max) : 1 }));
          }
        }
        return { ...prev, [name]: willEnable };
      });
    };

    const setChainStack = (name, val) => {
      const max = getMaxStacks(name);
      const n = Math.max(0, Math.min(max, Number(val) || 0));
      setChainStacks(prev => ({ ...prev, [name]: n }));
    };

    const activeChain = useMemo(() => {
      if (!current?.chain) return [];
      const out = [];
      for (const [name, node] of Object.entries(current.chain)) {
        if (!enabledChain[name]) continue;
        for (const e of node.effects ?? []) {
          const stacks = e.stack ? Math.min(getMaxStacks(name), chainStacks[name] ?? 0) : 1;
          out.push({        
            stat: e.stat,          
            amount: (Number(e.value) || 0) * stacks,
            appliesTo: e.tags ?? null,
          });
        }
      }
      return out;
  }, [current?.id, enabledChain, chainStacks]);

    const value = useMemo(() => ({
    enabledChain, chainStacks,
    toggleChain, setChainStack,
    activeChain,
  }), [enabledChain, chainStacks, activeChain]);
  return <ResonatorChainContext.Provider value={value}>{children}</ResonatorChainContext.Provider>;
}

export const useResonatorChain = () => useContext(ResonatorChainContext);