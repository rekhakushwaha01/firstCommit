import { SAFETY_LINE } from '@/data/navigation'

export function HumanInTheLoop({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? 'rounded-2xl border border-blue-dark/10 bg-surface/80 px-4 py-3'
          : 'rounded-[1.4rem] border border-blue-dark/10 bg-surface-strong/80 px-5 py-4'
      }
      role="note"
    >
      <p className="text-[11px] font-semibold tracking-[0.16em] text-blue uppercase">
        Q-ABX → Decision support → Clinician review → Final clinical decision
      </p>
      <p className="mt-2 text-sm leading-6 text-text-muted">{SAFETY_LINE}</p>
    </div>
  )
}

export function DemoWatermark() {
  return (
    <p className="text-[11px] font-semibold tracking-[0.16em] text-text-muted uppercase">
      Research prototype · Synthetic data · Simulated optimization · Not clinically validated · Demo output
    </p>
  )
}
