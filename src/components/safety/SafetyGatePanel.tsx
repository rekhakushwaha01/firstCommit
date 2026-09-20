import type { SafetyGateResult } from '@/engine/safetyGate'
import { AlertTriangle, Check } from 'lucide-react'
import { Surface } from '@/components/ui/Surface'

export function SafetyGatePanel({ safety }: { safety: SafetyGateResult }) {
  return (
    <Surface className="p-6 sm:p-8">
      <p className="text-[12px] font-semibold tracking-[0.18em] text-blue uppercase">Safety gate</p>
      <h2 className="font-display mt-2 text-3xl text-blue-dark">{safety.headline}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">
        Prototype checks never silently approve a clinical decision. Even when every demo gate is green,
        a clinician must review the case.
      </p>
      <ul className="mt-6 grid gap-3">
        {safety.checks.map((check) => (
          <li
            key={check.id}
            className="flex gap-3 rounded-2xl border border-blue-dark/8 bg-bg-light/60 px-4 py-3"
          >
            <span
              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                check.passed ? 'bg-lime/80 text-blue-dark' : 'bg-[#f3e0c8] text-[#8a4b12]'
              }`}
              aria-hidden="true"
            >
              {check.passed ? <Check size={14} /> : <AlertTriangle size={14} />}
            </span>
            <div>
              <p className="text-sm font-semibold text-blue-dark">{check.label}</p>
              <p className="mt-1 text-sm leading-6 text-text-muted">{check.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </Surface>
  )
}
