import { Link } from "react-router-dom";
import { Sun, Moon, Search, UserRound, Bell, ChevronDown } from "lucide-react";
import useThemeStore from "../store/themeStore.js";
import useAuthStore from "../store/authStore.js";
import usePlannerStore from "../store/plannerStore.js";

export default function TopBar() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { searchTerm, setSearchTerm, tasks } = usePlannerStore();
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-5">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-9 pr-14 py-2.5 text-sm"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-500">
          Ctrl K
        </kbd>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:bg-white/10"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:bg-white/10"
        >
          <Bell className="h-4 w-4" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white">
              {pendingCount > 9 ? "9+" : pendingCount}
            </span>
          )}
        </button>

        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-full border border-white/10 px-2 py-1.5 hover:bg-white/10"
        >
          <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white/10 text-slate-300">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <UserRound className="h-3.5 w-3.5" />
            )}
          </div>
          <span className="hidden text-sm font-medium text-slate-200 sm:block">
            {user?.name?.split(" ")[0]}
          </span>
          <ChevronDown className="hidden h-3.5 w-3.5 text-slate-500 sm:block" />
        </Link>
      </div>
    </header>
  );
}
