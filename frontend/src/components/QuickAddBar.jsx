import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import usePlannerStore from "../store/plannerStore.js";

const PRIORITIES = ["Low", "Medium", "High"];

export default function QuickAddBar() {
  const addTask = usePlannerStore((s) => s.addTask);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await addTask({ title, priority });
      setTitle("");
      setPriority("Medium");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-gradient-to-br from-violet via-violet/90 to-indigo-600 p-5 shadow-glow"
    >
      <div className="mb-3 flex items-center gap-2 text-white">
        <Sparkles className="h-4 w-4" />
        <h2 className="font-display text-sm font-semibold">Add Task</h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to accomplish?"
          className="flex-1 rounded-xl border border-white/20 bg-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/60 outline-none focus:bg-white/20"
        />

        <div className="flex gap-2">
          {PRIORITIES.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPriority(p)}
              className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                priority === p
                  ? "border-white bg-white text-violet"
                  : "border-white/30 text-white/80 hover:bg-white/10"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-1 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-violet shadow-md transition hover:scale-[1.02] disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> {loading ? "Adding..." : "Add Task"}
        </button>
      </div>
    </form>
  );
}
