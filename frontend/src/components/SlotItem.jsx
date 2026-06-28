import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import usePlannerStore from "../store/plannerStore.js";
import { formatTime12h } from "../utils/date.js";

export default function SlotItem({ slot }) {
  const deleteSlot = usePlannerStore((s) => s.deleteSlot);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
    >
      <span className="h-8 w-1 rounded-full" style={{ backgroundColor: slot.color }} />
      <div className="w-24 flex-shrink-0 text-xs font-semibold text-slate-300">
        {formatTime12h(slot.startTime)}
        {slot.endTime && (
          <div className="text-[10px] font-normal text-slate-500">
            – {formatTime12h(slot.endTime)}
          </div>
        )}
      </div>
      <div className="flex-1 text-sm text-slate-100">{slot.activity}</div>
      <button
        onClick={() => deleteSlot(slot._id)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-coral/20 hover:text-coral"
        aria-label="Delete activity"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </motion.li>
  );
}
