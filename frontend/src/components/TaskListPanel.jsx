import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, ListChecks } from "lucide-react";
import usePlannerStore from "../store/plannerStore.js";
import TaskItem from "./TaskItem.jsx";
import AddTaskModal from "./AddTaskModal.jsx";

export default function TaskListPanel() {
  const { tasks, searchTerm } = usePlannerStore();
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate-100">
          <ListChecks className="h-4 w-4 text-violet-soft" />
          Today's Tasks
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
          Nothing here yet — add your first task for this day.
        </p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {sorted.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </AnimatePresence>
        </ul>
      )}

      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
