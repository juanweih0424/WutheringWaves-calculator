import React, { createContext, useContext, useMemo, useState } from "react";

const EchoSetContext = createContext(undefined);

export function EchoSetProvider({ setsCatalog = [], children }) {
  const [set1Id, setSet1Id] = useState(null); 
  const [set2Id, setSet2Id] = useState(null); 

  const [stacks, setStacks] = useState({ first: {}, second: {} });

  const getSetById = (id) =>
    setsCatalog.find((s) => String(s.id) === String(id)) || null;

  const setSelectedSet = (which, id) => {
    if (which !== "first" && which !== "second") return;
    if (which === "first") setSet1Id(id ?? null);
    else setSet2Id(id ?? null);

    setStacks((prev) => ({ ...prev, [which]: {} }));
  };

  const setEffectStack = (which, effectKey, nextVal) => {
    if (which !== "first" && which !== "second") return;
    setStacks((prev) => ({
      ...prev,
      [which]: {
        ...(prev[which] || {}),
        [effectKey]: Math.max(0, Number(nextVal) || 0),
      },
    }));
  };

  const sumSetPieces = (selSet, which, pieces) => {
    if (!selSet?.set) return {};
    const out = {};
    const add = (stat, val) => {
      if (!stat || typeof val !== "number") return;
      out[stat] = (out[stat] ?? 0) + val;
    };

    for (const piece of pieces) {
      const block = selSet.set[piece];
      if (!block) continue;
      const effects = block.effects || [];
      effects.forEach((ef, idx) => {
        const key = `${piece}-${idx}`;
        const base = Number(ef?.value) || 0;
        if (ef?.stack) {
          const used = stacks[which]?.[key] ?? 0;
          add(ef.stat, base * used);
        } else {
          add(ef.stat, base);
        }
      });
    }
    return out;
  };

  const setTotals = useMemo(() => {
    const first = sumSetPieces(getSetById(set1Id), "first", ["2pc"]);
    const second = sumSetPieces(getSetById(set2Id), "second", ["5pc", "3pc"]); 

    const total = { ...first };
    for (const [k, v] of Object.entries(second)) total[k] = (total[k] ?? 0) + v;
    return total;
  }, [set1Id, set2Id, stacks, setsCatalog]);


  const value = useMemo(
    () => ({
      setsCatalog,
      set1Id,
      set2Id,
      setSelectedSet,
      stacks,
      setEffectStack,
      setTotals,
      getSetById,
    }),
    [setsCatalog, set1Id, set2Id, stacks, setTotals]
  );

  return (
    <EchoSetContext.Provider value={value}>{children}</EchoSetContext.Provider>
  );
}

export function useEchoSet() {
  const ctx = useContext(EchoSetContext);
  if (!ctx) throw new Error("useEchoSet must be used within <EchoSetProvider>");
  return ctx;
}
