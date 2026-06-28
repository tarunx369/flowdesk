import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import usePlannerStore from "../store/plannerStore.js";

export default function AddTaskModal({ open, onClose }) {
  const addTask = usePlannerStore((s) => s.addTask);
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await addTask(form);
      setForm({ title: "", description: "", priority: "Medium" });
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
              <h3 className="font-display text-lg font-semibold text-slate-50">Add Task</h3>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                autoFocus
                required
                placeholder="Task title"
                className="input-field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                placeholder="Description (optional)"
                rows={2}
                className="input-field resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="flex gap-2">
                {["Low", "Medium", "High"].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setForm({ ...form, priority: p })}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      form.priority === p
                        ? "border-violet bg-violet/20 text-violet-soft"
                        : "border-white/10 text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Adding..." : "Add Task"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
