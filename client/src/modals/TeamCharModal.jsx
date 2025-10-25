import { useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useResonator } from "../context/ResonatorContext";
import CharacterCard from "../components/CharacterCard";
import { getCharacterWeaponUrl } from "../utils/character";

const elementIcons = import.meta.glob("../assets/images/element/*.webp", {
  eager: true,
  as: "url",
});

function iconForElement(element = "") {
  const lower = element.toLowerCase();
  const entry = Object.entries(elementIcons).find(([key]) => key.toLowerCase().includes(lower));
  return entry ? entry[1] : null;
}

export default function TeamCharModal({ open, onClose, onSelect, excludeIds = [] }) {
  const { items, current } = useResonator();

  const baseList = useMemo(() => {
    return (items || []).filter((r) => {
      if (current && r.id === current.id) return false;
      if (excludeIds?.length && excludeIds.includes(r.id)) return false;
      return true;
    });
  }, [items, current, excludeIds]);

  const [searchTerm, setSearchTerm] = useState("");
  const [elementFilter, setElementFilter] = useState(null);
  const [rarityFilter, setRarityFilter] = useState(null);
  const [weaponFilter, setWeaponFilter] = useState(null);

  const elementOptions = useMemo(() => {
    const unique = new Set();
    baseList.forEach((r) => r?.element && unique.add(r.element));
    return Array.from(unique).sort();
  }, [baseList]);

  const rarityOptions = useMemo(() => {
    const unique = new Set();
    baseList.forEach((r) => r?.rarity && unique.add(Number(r.rarity)));
    return Array.from(unique).sort((a, b) => b - a);
  }, [baseList]);

  const weaponOptions = useMemo(() => {
    const unique = new Set();
    baseList.forEach((r) => r?.weapon && unique.add(r.weapon));
    return Array.from(unique).sort();
  }, [baseList]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return baseList.filter((r) => {
      const matchesElement = !elementFilter || r?.element === elementFilter;
      const matchesName = term.length === 0 || r?.name?.toLowerCase().includes(term);
      const matchesRarity =
        !rarityFilter || Number(r?.rarity ?? 0) === Number(rarityFilter);
      const matchesWeapon = !weaponFilter || r?.weapon === weaponFilter;
      return matchesElement && matchesName && matchesRarity && matchesWeapon;
    });
  }, [baseList, searchTerm, elementFilter, rarityFilter, weaponFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setElementFilter(null);
    setRarityFilter(null);
    setWeaponFilter(null);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <DialogPanel className="relative flex h-[70vh] w-[65vw] flex-col overflow-hidden rounded-2xl bg-[var(--color-bg)] px-5 pb-6 pt-12">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full p-2 hover:bg-black/10 focus:outline-none"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-6">
              <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
            </svg>
          </button>

          <div className="mb-5 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-500/30 bg-[var(--color-bg)] px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-2 flex items-center text-lg opacity-70 hover:opacity-100"
                  aria-label="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-5">
                    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4 lg:flex-row">
              {elementOptions.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase tracking-wide opacity-60">Element</span>
                  {elementOptions.map((el) => {
                    const iconSrc = iconForElement(el);
                    const active = elementFilter === el;
                    return (
                      <button
                        key={el}
                        type="button"
                        onClick={() => setElementFilter(active ? null : el)}
                        className={`flex items-center justify-center rounded-full p-0.5 transition cursor-pointer duration-200 ${
                          active ? "ring-2 ring-[var(--color-highlight)]" : ""
                        }`}
                        aria-pressed={active}
                      >
                        {iconSrc ? (
                          <img
                            src={iconSrc}
                            alt=""
                            title={el}
                            className="h-7 w-7 lg:h-10 lg:w-10 rounded-full"
                          />
                        ) : (
                          <span className="text-xs font-semibold">{el.slice(0, 1)}</span>
                        )}
                        <span className="sr-only">{el}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {rarityOptions.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase tracking-wide opacity-60">Rarity</span>
                  {rarityOptions.map((rarity) => {
                    const active = Number(rarityFilter) === Number(rarity);
                    return (
                      <button
                        key={rarity}
                        type="button"
                        onClick={() => setRarityFilter(active ? null : rarity)}
                        className={`flex items-center justify-center rounded-full border cursor-pointer px-3 py-1 text-xs lg:text-sm transition ${
                          active
                            ? "border-[var(--color-highlight)] text-[var(--color-highlight)] ring-2 ring-[var(--color-highlight)]"
                            : "border-gray-500/30 text-white/80 hover:border-[var(--color-highlight)]"
                        }`}
                        aria-pressed={active}
                      >
                        {rarity}★
                      </button>
                    );
                  })}
                </div>
              )}

              {weaponOptions.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase tracking-wide opacity-60">Weapon</span>
                  {weaponOptions.map((weapon) => {
                    const iconSrc = getCharacterWeaponUrl(weapon);
                    const active = weaponFilter === weapon;
                    return (
                      <button
                        key={weapon}
                        type="button"
                        onClick={() => setWeaponFilter(active ? null : weapon)}
                        className={`flex items-center justify-center rounded-full cursor-pointer border px-3 py-1 transition ${
                          active
                            ? "border-[var(--color-highlight)] ring-2 ring-[var(--color-highlight)]"
                            : "border-gray-500/30 text-white/80 hover:border-[var(--color-highlight)]"
                        }`}
                        aria-pressed={active}
                      >
                        {iconSrc ? (
                          <img
                            src={iconSrc}
                            alt=""
                            title={weapon}
                            className="h-4 w-4 lg:h-6 lg:w-6 brightness-[var(--color-img)]"
                          />
                        ) : (
                          <span className="text-xs font-semibold">{weapon.slice(0, 1)}</span>
                        )}
                        <span className="sr-only">{weapon}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full cursor-pointer bg-red-400 px-4 py-2 text-xs lg:text-sm transition hover:bg-red-500/90"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-4">
              {filtered.map((r) => (
                <CharacterCard key={r.id ?? r.name} resonator={r} onSelect={onSelect} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-6 text-center text-sm opacity-70">
                  No resonators match your filters.
                </div>
              )}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
