import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  FolderKanban,
  Tags,
  BarChart3,
  Sparkles,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import useAuthStore from "../store/authStore.js";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/", active: true },
  { label: "My Tasks", icon: CheckSquare, to: "/", active: true },
  { label: "Calendar", icon: CalendarDays, to: "/", soon: true },
  { label: "Projects", icon: FolderKanban, to: "/", soon: true },
  { label: "Tags", icon: Tags, to: "/", soon: true },
  { label: "Stats", icon: BarChart3, to: "/", active: true },
  { label: "Focus Mode", icon: Sparkles, to: "/", soon: true },
];

export default function Sidebar() {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="hidden h-screen w-64 flex-shrink-0 flex-col border-r border-white/5 bg-dusk/60 px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet shadow-glow">
          <span className="font-display text-lg font-bold text-white">F</span>
        </div>
        <span className="font-display text-xl font-bold text-slate-50">FlowDesk</span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon, to, soon }) => {
          const isActive = location.pathname === "/" && to === "/" && label === "Dashboard";
          return (
            <Link
              key={label}
              to={to}
              title={soon ? `${label} — coming soon` : label}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-violet text-white shadow-glow"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              } ${soon ? "opacity-50" : ""}`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {soon && <span className="ml-auto text-[10px] uppercase text-slate-500">Soon</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/5 pt-4">
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Other
        </p>
        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200"
        >
          <Settings className="h-4 w-4" /> Settings
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200"
        >
          <HelpCircle className="h-4 w-4" /> Help &amp; Support
        </a>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-coral/10 hover:text-coral"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
