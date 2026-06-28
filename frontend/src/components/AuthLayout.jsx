import { motion } from "framer-motion";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      {/* Signature flow-line backdrop */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="flowline" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C5CFC" />
            <stop offset="50%" stopColor="#FF7A59" />
            <stop offset="100%" stopColor="#3DDC97" />
          </linearGradient>
        </defs>
        <motion.path
          d="M -100 650 C 200 750, 350 450, 600 500 C 850 550, 950 200, 1300 150"
          fill="none"
          stroke="url(#flowline)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
      </svg>

      <div className="relative z-10 m-auto flex w-full max-w-5xl flex-col items-center gap-10 px-6 py-12 md:flex-row md:gap-16">
        {/* Branding panel */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex w-full flex-col justify-center md:w-1/2"
        >
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet shadow-glow">
              <span className="font-display text-lg font-bold text-white">F</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              FlowDesk
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
            Your day,
            <br />
            <span className="text-violet-soft">designed.</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm text-slate-400">
            One calm place for today's tasks and today's schedule — nothing
            else competing for your attention.
          </p>
        </motion.div>

        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="glass-card w-full max-w-md p-8 md:w-1/2"
        >
          <h2 className="font-display text-2xl font-semibold text-slate-50">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}
