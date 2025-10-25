import { useMemo, useState } from "react";
import WeaponCard from "../components/WeaponCard";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useWeapon } from "../context/WeaponContext";
import { useResonator } from "../context/ResonatorContext";

export default function WeaponModal({ open, onClose, onSelect }) {
  const { weapons = [] } = useWeapon();
  const { current } = useResonator();

  const baseList = useMemo(() => {
    if (!current?.weapon) return weapons;
    const want = String(current.weapon).toLowerCase().trim();
    return weapons.filter((w) => String(w.weapon).toLowerCase().trim() === want);
  }, [weapons, current]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredWeapons = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return baseList.filter((w) => term.length === 0 || w?.name?.toLowerCase().includes(term));
  }, [baseList, searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
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
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-4">
              {filteredWeapons.map((weapon) => (
                <WeaponCard key={weapon.name} weapon={weapon} onSelect={onSelect} />
              ))}
              {filteredWeapons.length === 0 && (
                <div className="col-span-full py-6 text-center text-sm opacity-70">
                  No weapons match your filters.
                </div>
              )}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
