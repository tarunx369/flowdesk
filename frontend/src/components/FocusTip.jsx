const TIPS = [
  { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Small daily improvements lead to staggering long-term results.", author: "Robin Sharma" },
];

export default function FocusTip() {
  const tip = TIPS[new Date().getDate() % TIPS.length];

  return (
    <div className="glass-card flex items-start gap-4 p-5">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber/15 text-amber">
        <span className="text-base">✨</span>
      </div>
      <div>
        <h3 className="mb-1 font-display text-sm font-semibold text-slate-100">Focus Tip</h3>
        <p className="text-sm italic text-slate-400">&ldquo;{tip.quote}&rdquo;</p>
        <p className="mt-1 text-xs text-slate-500">— {tip.author}</p>
      </div>
    </div>
  );
}
