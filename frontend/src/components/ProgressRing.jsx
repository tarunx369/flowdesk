import { motion } from "framer-motion";

export default function ProgressRing({ percent = 0 }) {
  const radius = 46;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle
          stroke="rgba(255,255,255,0.08)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="#7C5CFC"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-2xl font-bold text-slate-50">{Math.round(percent)}%</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-400">Done</span>
      </div>
    </div>
  );
}
