import React, { useMemo, useState } from "react";
import { useEchoSet } from "../context/EchoSetContext";
import BuffCard from "../components/BuffCard";
import { useBuff } from "../context/TeamBuffContext";

export default function EchoSetBuff() {
  const { setsCatalog } = useEchoSet();
  const [open, setOpen] = useState(false);
  const { clearAllBuffs } = useBuff();

  const candidates = useMemo(
    () => (setsCatalog || []).filter((s) => !!s.buff),
    [setsCatalog]
  );


  return (
    <div className="border border-gray-500/50 rounded-2xl shadow-md">
      {/* Section header acts as a toggle */}
      <button
        type="button"
        className=" w-full flex items-center justify-between rounded-xl px-2 py-2 hover:bg-gray-500/20 transition cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <p className="text-lg font-semibold">Team EchoSet Buff</p>
        <span
          className={`inline-block text-2xl leading-none transition-transform duration-200 ease-in-out ${open ? "rotate-180" : ""}`}
        >▾</span>
      </button>

      {/* Collapsible content */}
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div
          className={`min-h-0 overflow-hidden transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          {candidates.length === 0 ? (
            <div className="opacity-70 text-sm">No echo sets with team buffs found.</div>
          ) : (
            <div className="space-y-8 p-4 border-0 shadow-md rounded-2xl">
              <button onClick={clearAllBuffs} className="bg-red-500/80 hover:bg-red-500/50 transition-transform duration-200 ease-in-out cursor-pointer p-2 rounded-xl">Clear All</button>
              {candidates.map((s) => (
                <BuffCard key={s.id} setItem={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
