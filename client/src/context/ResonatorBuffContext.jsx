import React, { createContext, useContext, useMemo, useState } from "react";
import { useResonator } from "./ResonatorContext";

const ResonatorBuffContext = createContext(null);

export function ResonatorBuffProvider({ children }) {
  const { current, items = [] } = useResonator();

  // up to 2 teammates (do not include current resonator)
  const [teammates, setTeammates] = useState([null, null]);

  const pickTeammate = (slotIndex, r) => {
    if (!r) return;
    if (current && r.id === current.id) return; // prevent picking current
    const otherIndex = slotIndex === 0 ? 1 : 0;
    if (teammates[otherIndex]?.id === r.id) return; // avoid duplicate between slots
    const next = [...teammates];
    next[slotIndex] = r;
    setTeammates(next);
  };

  const clearSelection = () => setTeammates([null, null]);

  const removeTeammate = (slotIndex) => {
    setTeammates((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  // Build ONE card per teamBuff entry; keep ALL its effects inside `effects`
  const buffList = useMemo(() => {
    const out = [];
    for (const mate of teammates) {
      if (!mate?.teamBuff?.length) continue;
      mate.teamBuff.forEach((b, bi) => {
        out.push({
          id: `${mate.name}#${bi}`,
          owner: mate.name,
          ownerId: mate.id,
          name: b.name,
          desc: b.desc,
          effects: (b.effects || []).map((eff) => ({
            statKey: eff.stat,
            value: Number(eff.value || 0),
            stack: Boolean(eff.stack),
            maxStack: Number(eff.maxStack || 0),
          })),
        });
      });
    }
    return out;
  }, [teammates]);

  // UI state
  const [enabled, setEnabled] = useState({});            // { [cardId]: boolean }
  const [stacksById, setStacksById] = useState({});      // { [cardId]: { [statKey]: number } }

  const toggle = (id) => setEnabled((m) => ({ ...m, [id]: !m[id] }));
  const setStacks = (id, statKey, v) =>
    setStacksById((m) => ({
      ...m,
      [id]: { ...(m[id] || {}), [statKey]: Math.max(0, Number(v) || 0) },
    }));

  const clearAll = () => {
    clearSelection();
    setEnabled({});
    setStacksById({});
  };

  const clearAllSelection = useMemo(()=>{
    clearAll();
  }, [current])

  // Aggregate ALL enabled effects from each enabled card
  const activeStatsResonator = useMemo(() => {
    const acc = {};
    for (const card of buffList) {
      if (!enabled[card.id]) continue;
      for (const eff of card.effects) {
        const stacks = eff.stack
          ? Math.min(eff.maxStack || 0, stacksById[card.id]?.[eff.statKey] ?? 0)
          : 1;
        const add = eff.value * (eff.stack ? stacks : 1);
        acc[eff.statKey] = (acc[eff.statKey] ?? 0) + add;
      }
    }
    return acc;
  }, [buffList, enabled, stacksById]);

  const value = {
    teammates,
    pickTeammate,
    removeTeammate,
    clearSelection,
    buffList,
    enabled,
    stacksById,
    toggle,
    setStacks,
    clearAll,
    activeStatsResonator,
    // convenience for UI
    roster: items.filter((r) => !current || r.id !== current.id),
  };

  return (
    <ResonatorBuffContext.Provider value={value}>
      {children}
    </ResonatorBuffContext.Provider>
  );
}

export function useResonatorBuffs() {
  const ctx = useContext(ResonatorBuffContext);
  if (!ctx) throw new Error("useResonatorBuffs must be used inside ResonatorBuffProvider");
  return ctx;
}
