import React, { useMemo, useState } from "react";

// --- Weapon buffs (kept) ---
import { useWeaponBuff } from "../context/WeaponBuffContext";
import WeaponBuffCard from "../components/WeaponBuffCard";

// --- Team resonator buffs (updated layout) ---
import { useResonatorBuffs } from "../context/ResonatorBuffContext";
import TeamCharModal from "../modals/TeamCharModal";
import ResonatorBuffCard from "../components/ResonatorBuffCard";
import { getCharacterImageUrl } from "../utils/character";

export default function Team() {
  /* -------------------- WEAPON BUFFS (unchanged) -------------------- */
  const [weaponOpen, setWeaponOpen] = useState(false);
  const { buffList: weaponBuffList, clearAllBuffs } = useWeaponBuff();
  const hasWeaponBuffs = (weaponBuffList?.length ?? 0) > 0;
  const weaponCards = useMemo(
    () => weaponBuffList.map((b) => <WeaponBuffCard key={b.id} buffId={b.id} />),
    [weaponBuffList]
  );

  /* -------------------- TEAM RESONATOR BUFFS ------------------------ */
  const [slotOpen, setSlotOpen] = useState({ 0: false, 1: false });
  const [openByOwner, setOpenByOwner] = useState({}); // per teammate collapsible

  const {
    teammates,
    pickTeammate,
    removeTeammate,
    buffList,     // now one item per teamBuff (with effects inside)
    clearAll,
  } = useResonatorBuffs();

  const avatarFor = (mate) => (mate ? getCharacterImageUrl(mate.id) : null);
  const openSlot = (i) => setSlotOpen((m) => ({ ...m, [i]: true }));
  const closeSlot = (i) => setSlotOpen((m) => ({ ...m, [i]: false }));
  const onSelectSlot = (i) => (r) => {
    pickTeammate(i, r);
    closeSlot(i);
  };

  // group cards by owner for collapsibles
  const buffsByOwner = useMemo(() => {
    const map = {};
    for (const b of buffList) (map[b.owner] ??= []).push(b);
    return map;
  }, [buffList]);

  return (
    <div className="space-y-4 p-2">
      {/* ---- TOP: teammate pickers centered (outside any border) ---- */}
      <div className="flex justify-center gap-10">
        {[0, 1].map((i) => {
          const mate = teammates[i];
          return (
            <div key={i} className="flex flex-col items-center gap-2 mt-8">
              <button
                onClick={() => openSlot(i)}
                className="size-22 lg:size-30 rounded-full border border-amber-400/50 overflow-hidden hover:scale-105 transition cursor-pointer"
                title={`Pick teammate ${i + 1}`}
              >
                {mate ? (
                  <img src={avatarFor(mate)} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs lg:text-sm opacity-70">Select a Teammate</span>
                )}
              </button>
              {mate && <div className="font-semibold tracking-tight text-[var(--color-highlight)]">{mate.name}</div>}

              {mate && (
                <button
                  onClick={() => removeTeammate(i)}
                  className="text-sm px-3 py-1 rounded-lg bg-blue-600/70 hover:bg-blue-600/50 cursor-pointer"
                >
                  Clear
                </button>
              )}

              <TeamCharModal
                open={slotOpen[i]}
                onClose={() => closeSlot(i)}
                onSelect={onSelectSlot(i)}
                excludeIds={[teammates[i === 0 ? 1 : 0]?.id].filter(Boolean)}
              />
            </div>
          );
        })}
      </div>

      {/* ---- Per-selected resonator collapsibles (no outer border/toggle) ---- */}
      {teammates.filter(Boolean).length === 0 ? null : (
        <div className="space-y-4">
          {teammates.filter(Boolean).map((mate) => {
            const owner = mate.name;
            const list = buffsByOwner[owner] ?? [];
            const isOpen = !!openByOwner[owner];

            return (
              <div key={owner} className="border border-gray-500/50 rounded-2xl shadow-md mr-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-xl px-2 lg:py-2 hover:bg-gray-500/20 transition cursor-pointer"
                  onClick={() => setOpenByOwner((m) => ({ ...m, [owner]: !isOpen }))}
                >
                  <p className="text-xs lg:text-sm font-semibold">Buffs for {owner}</p>
                  <span className={`inline-block text-2xl transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </button>

                <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className={`min-h-0 overflow-hidden transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}>
                    <div className="p-3 space-y-3">
                      {list.length === 0 ? (
                        <div className="opacity-70 text-sm">No team buffs found for {owner}.</div>
                      ) : (
                        list.map((b) => <ResonatorBuffCard key={b.id} id={b.id} />)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- Weapon Buffs panel (kept exactly) ---- */}
      <div className="border border-gray-500/50 rounded-2xl shadow-md mr-2">
        <button
          type="button"
          className="w-full flex items-center justify-between rounded-xl px-2 lg:py-2 hover:bg-gray-500/20 transition cursor-pointer"
          onClick={() => setWeaponOpen((v) => !v)}
        >
          <p className="text-xs lg:text-sm font-semibold">Team Weapon Buffs</p>
          <span className={`inline-block text-2xl transition-transform ${weaponOpen ? "rotate-180" : ""}`}>▾</span>
        </button>

        <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${weaponOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className={`min-h-0 overflow-hidden transition-opacity duration-200 ${weaponOpen ? "opacity-100" : "opacity-0"}`}>
            {!hasWeaponBuffs ? (
              <div className="opacity-70 text-sm p-4">No weapon buffs found.</div>
            ) : (
              <div className="space-y-8 p-4 border-0 shadow-md rounded-2xl">
                <button
                  onClick={clearAllBuffs}
                  className="bg-red-500/80 hover:bg-red-500 transition p-2 text-xs lg:text-base rounded-xl cursor-pointer"
                >
                  Clear All
                </button>
                <div className="space-y-3">{weaponCards}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
