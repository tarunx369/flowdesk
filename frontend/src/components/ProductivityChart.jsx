import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axios.js";

export default function ProductivityChart() {
  const [series, setSeries] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tasks/stats/weekly")
      .then(({ data }) => {
        setSeries(data.series);
        setStreak(data.streak);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-slate-100">
          Productivity Overview
        </h2>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
          This Week
        </span>
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-lg bg-white/5" />
      ) : (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: "#11152A",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value) => [`${value}%`, "Completed"]}
              />
              <Line
                type="monotone"
                dataKey="percent"
                stroke="#7C5CFC"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#7C5CFC" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3">
        <MiniStat label="Completion" value={`${series.at(-1)?.percent ?? 0}%`} />
        <MiniStat label="Tasks Done" value={series.reduce((sum, d) => sum + d.completed, 0)} />
        <MiniStat label="Streak" value={`${streak}d`} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
      <p className="font-display text-base font-bold text-slate-50">{value}</p>
      <p className="text-[10px] text-slate-500">{label}</p>
    </div>
  );
}
