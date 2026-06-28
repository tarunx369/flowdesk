export default function StatCard({ icon: Icon, value, label, tone = "violet" }) {
  const toneClasses = {
    violet: "bg-violet/15 text-violet-soft",
    mint: "bg-mint/15 text-mint",
    amber: "bg-amber/15 text-amber",
    coral: "bg-coral/15 text-coral",
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="font-display text-lg font-bold leading-none text-slate-50">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}
