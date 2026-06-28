import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, Flame } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";
import DateNav from "../components/DateNav.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import QuickAddBar from "../components/QuickAddBar.jsx";
import TaskListPanel from "../components/TaskListPanel.jsx";
import TimetablePanel from "../components/TimetablePanel.jsx";
import ProductivityChart from "../components/ProductivityChart.jsx";
import UpcomingPanel from "../components/UpcomingPanel.jsx";
import FocusTip from "../components/FocusTip.jsx";
import FloatingAddButton from "../components/FloatingAddButton.jsx";
import useAuthStore from "../store/authStore.js";
import usePlannerStore from "../store/plannerStore.js";
import { greeting, isToday } from "../utils/date.js";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { selectedDate, tasks, fetchAll } = usePlannerStore();

  useEffect(() => {
    fetchAll(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const percent = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <TopBar />

        <main className="mx-auto max-w-6xl space-y-6 px-6 pb-24">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-gradient-to-br from-violet/90 via-violet to-indigo-700 p-6 shadow-glow"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      {isToday(selectedDate)
                        ? `${greeting()}, ${user?.name?.split(" ")[0] || ""}!`
                        : "Planning ahead"}{" "}
                      <span aria-hidden>👋</span>
                    </h1>
                    <p className="mt-1 text-sm text-white/80">
                      {tasks.length === 0
                        ? "A clean slate — add what matters for today."
                        : "You're making great progress today."}
                    </p>
                  </div>
                  <ProgressRing percent={percent} />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <StatCardLight icon={CheckCircle2} value={completedCount} label="Tasks Done" />
                  <StatCardLight icon={Clock3} value={pendingCount} label="Tasks Pending" />
                  <StatCardLight icon={Flame} value="🔥" label="See streak below" />
                </div>
              </motion.div>

              <QuickAddBar />
              <DateNav />

              <div className="grid gap-6 md:grid-cols-2">
                <TaskListPanel />
                <TimetablePanel />
              </div>
            </div>

            <div className="space-y-6">
              <ProductivityChart />
              <UpcomingPanel />
              <FocusTip />
            </div>
          </div>
        </main>
      </div>

      <FloatingAddButton />
    </div>
  );
}

function StatCardLight({ icon: Icon, value, label }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="font-display text-lg font-bold">{value}</span>
      </div>
      <p className="mt-1 text-xs text-white/70">{label}</p>
    </div>
  );
}
