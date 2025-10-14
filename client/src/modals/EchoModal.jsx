// src/modals/EchoModal.jsx
import React, { useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useEcho } from "../context/EchoContext";
import EchoCard from "../components/EchoCard";

export default function EchoModal({ open, onClose, onSelect }) {
  const { catalog } = useEcho();
  const [q, setQ] = useState("");
  const [cost, setCost] = useState("all"); // "all" | "1" | "3" | "4"

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (catalog || [])
      .filter(e =>
        cost === "all" ? true : String(e?.cost ?? "") === cost
      )
      .filter(e =>
        !term || String(e?.name ?? "").toLowerCase().includes(term)
      );
  }, [catalog, q, cost]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-11/12 lg:w-3/4 max-h-[85vh] overflow-y-auto rounded-2xl bg-[var(--color-bg,#111)] p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search echo…"
              className="w-full sm:flex-1 rounded border bg-transparent px-3 py-2"
            />
            <select
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full sm:w-40 rounded border bg-transparent px-3 py-2"
            >
              <option value="all">All costs</option>
              <option value="1">Cost 1</option>
              <option value="3">Cost 3</option>
              <option value="4">Cost 4</option>
            </select>
            <button onClick={onClose} className="px-3 py-2 border rounded">Close</button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3">
            {filtered.map((e) => (
              <EchoCard key={e.id ?? e.name} echo={e} onSelect={onSelect} />
            ))}
            {!filtered.length && (
              <div className="col-span-full text-center opacity-70 py-8">
                No echoes match your filters.
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
