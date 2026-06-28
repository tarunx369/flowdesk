import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Clock } from "lucide-react";
import usePlannerStore from "../store/plannerStore.js";
import SlotItem from "./SlotItem.jsx";
import AddSlotModal from "./AddSlotModal.jsx";

export default function TimetablePanel() {
  const slots = usePlannerStore((s) => s.slots);
  const [modalOpen, setModalOpen] = useState(false);
  const sorted = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate-100">
          <Clock className="h-4 w-4 text-violet-soft" />
          Today's Schedule
        </h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 rounded-full bg-violet/15 px-3 py-1.5 text-xs font-semibold text-violet-soft hover:bg-violet/25"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No activities planned — block out your day.
        </p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {sorted.map((slot) => (
              <SlotItem key={slot._id} slot={slot} />
            ))}
          </AnimatePresence>
        </ul>
      )}

      <AddSlotModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
