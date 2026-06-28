import { useEffect, useState } from "react";
import { BookOpen, Users, Code2, Bell } from "lucide-react";
import api from "../api/axios.js";
import { formatTime12h } from "../utils/date.js";

const ICONS = [BookOpen, Users, Code2];

export default function UpcomingPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/tasks/upcoming"), api.get("/timetable/upcoming")])
      .then(([tasksRes, slotsRes]) => {
        const taskItems = tasksRes.data.tasks.map((t) => ({
          id: t._id,
          title: t.title,
          date: t.date,
          time: null,
          kind: "task",
        }));
        const slotItems = slotsRes.data.slots.map((s) => ({
          id: s._id,
          title: s.activity,
          date: s.date,
          time: s.startTime,
          kind: "slot",
        }));
        const merged = [...taskItems, ...slotItems]
          .sort((a, b) => (a.date + (a.time || "00:00")).localeCompare(b.date + (b.time || "00:00")))
          .slice(0, 5);
        setItems(merged);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatWhen = (date, time) => {
    const d = new Date(`${date}T00:00:00`);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return time ? `${label}, ${formatTime12h(time)}` : label;
  };

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-slate-100">Upcoming</h2>
        <span className="text-xs font-medium text-violet-soft">View all</span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">Nothing on the horizon. Enjoy it.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li
                key={`${item.kind}-${item.id}`}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet/15 text-violet-soft">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-100">{item.title}</p>
                  <p className="text-xs text-slate-500">{formatWhen(item.date, item.time)}</p>
                </div>
                <Bell className="h-3.5 w-3.5 text-slate-500" />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
