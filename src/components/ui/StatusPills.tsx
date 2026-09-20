const PILLS = [
  'Research prototype',
  'Synthetic data',
  'Simulated optimization',
  'Not clinically validated',
] as const

export function StatusPills() {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Prototype status">
      {PILLS.map((label, index) => (
        <span
          key={label}
          className="inline-flex items-center gap-2 rounded-full border border-blue-dark/10 bg-surface-strong/80 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-text-muted uppercase"
        >
          {index === 1 ? <span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden="true" /> : null}
          {label}
        </span>
      ))}
    </div>
  )
}
