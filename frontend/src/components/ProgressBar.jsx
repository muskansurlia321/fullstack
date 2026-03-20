export function ProgressBar({ value }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0))
  const hue = v < 35 ? 160 : v < 70 ? 40 : 0

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
        <span>Scam probability</span>
        <span className="font-medium text-slate-100">{v.toFixed(1)}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${v}%`,
            background: `linear-gradient(90deg, hsl(${hue} 90% 55%), hsl(${hue} 90% 45%))`,
          }}
        />
      </div>
    </div>
  )
}

