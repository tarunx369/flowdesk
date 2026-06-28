import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { addDays, formatLongDate, isToday, toDateKey } from "../utils/date.js";
import usePlannerStore from "../store/plannerStore.js";

export default function DateNav() {
  const { selectedDate, setSelectedDate } = usePlannerStore();

  return (
    <div className="glass-card flex items-center justify-between gap-3 px-4 py-3">
      <button
        onClick={() => setSelectedDate(addDays(selectedDate, -1))}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 hover:bg-white/10"
        aria-label="Previous day"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex flex-1 items-center justify-center gap-2 text-sm font-medium text-slate-200">
        <CalendarDays className="h-4 w-4 text-violet-soft" />
        <span>{formatLongDate(selectedDate)}</span>
        {isToday(selectedDate) && (
          <span className="rounded-full bg-violet/20 px-2 py-0.5 text-xs font-semibold text-violet-soft">
            Today
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isToday(selectedDate) && (
          <button
            onClick={() => setSelectedDate(toDateKey(new Date()))}
            className="hidden rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 sm:block"
          >
            Today
          </button>
        )}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-full border border-white/10 bg-transparent px-2 py-1.5 text-xs text-slate-300 [color-scheme:dark]"
        />
        <button
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 hover:bg-white/10"
          aria-label="Next day"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
