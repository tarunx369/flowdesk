import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import usePlannerStore from "../store/plannerStore.js";

const COLORS = ["#7C5CFC", "#FF7A59", "#3DDC97", "#FFC857", "#60A5FA", "#F472B6"];

export default function AddSlotModal({ open, onClose }) {
  const addSlot = usePlannerStore((s) => s.addSlot);
  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
    activity: "",
    color: COLORS[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startTime || !form.activity.trim()) return;
    setLoading(true);
    try {
      await addSlot(form);
      setForm({ startTime: "", endTime: "", activity: "", color: COLORS[0] });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border border-violet/30 bg-[#161A33] p-6 shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-50">Add Activity</h3>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-slate-400">Start time</label>
                  <input
                    type="time"
                    required
                    className="input-field [color-scheme:dark]"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-slate-400">End time (optional)</label>
                  <input
                    type="time"
                    className="input-field [color-scheme:dark]"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  />
                </div>
              </div>

              <input
                required
                placeholder="Activity or subject"
                className="input-field"
                value={form.activity}
                onChange={(e) => setForm({ ...form, activity: e.target.value })}
              />

              <div>
                <label className="mb-2 block text-xs text-slate-400">Color</label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setForm({ ...form, color: c })}
                      style={{ backgroundColor: c }}
                      className={`h-7 w-7 rounded-full border-2 transition ${
                        form.color === c ? "border-white" : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Adding..." : "Add Activity"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
