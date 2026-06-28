import { motion } from "framer-motion";
import { Pin, Trash2, Check } from "lucide-react";
import usePlannerStore from "../store/plannerStore.js";

const priorityColor = {
  Low: "bg-mint/20 text-mint",
  Medium: "bg-amber/20 text-amber",
  High: "bg-coral/20 text-coral",
};

export default function TaskItem({ task }) {
  const { toggleTask, togglePin, deleteTask } = usePlannerStore();

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3"
    >
      <button
        onClick={() => toggleTask(task._id)}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          task.completed ? "border-violet bg-violet" : "border-slate-500"
        }`}
      >
        {task.completed && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
      </button>

      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            task.completed ? "text-slate-500 line-through" : "text-slate-100"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 text-xs text-slate-500">{task.description}</p>
        )}
        <span
          className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityColor[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => togglePin(task._id)}
          aria-label="Pin task"
          className={`flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10 ${
            task.pinned ? "text-amber" : "text-slate-500"
          }`}
        >
          <Pin className="h-3.5 w-3.5" fill={task.pinned ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => deleteTask(task._id)}
          aria-label="Delete task"
          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-coral/20 hover:text-coral"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.li>
  );
}
