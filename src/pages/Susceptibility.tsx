import { motion } from 'framer-motion'
import { ENTROPY_EXPLAINER } from '@/features/entropy/copy'
import { SUSCEPTIBILITY_DISCLAIMER } from '@/features/susceptibility/disclaimer'
import { analyzeEntropy } from '@/engine/entropy'
import { simulateSusceptibility } from '@/engine/susceptibility'
import { PageTransition } from '@/components/animations/PageTransition'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { HumanInTheLoop } from '@/components/ui/HumanInTheLoop'
import { Kicker, PageShell, Surface } from '@/components/ui/Surface'
import { NeedProfile } from '@/components/ui/NeedProfile'
import { StatusPills } from '@/components/ui/StatusPills'
import { useQabx } from '@/state/QabxContext'

export function Susceptibility() {
  const { assessment } = useQabx()

  return (
    <PageTransition>
      <PageShell>
        <Container>
          <StatusPills />
          <Kicker>Susceptibility lab</Kicker>
          <h1 className="font-display mt-3 max-w-3xl text-4xl text-blue-dark sm:text-6xl">
            Simulated compatibility matrix.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-muted">{SUSCEPTIBILITY_DISCLAIMER}</p>
          <div className="mt-8">
            <NeedProfile title="Validate a synthetic profile to populate the lab.">
              {assessment ? <LabBody /> : null}
            </NeedProfile>
          </div>
        </Container>
      </PageShell>
    </PageTransition>
  )
}

function LabBody() {
  const { assessment } = useQabx()
  if (!assessment) return null
  const matrix = simulateSusceptibility(assessment)
  const entropy = analyzeEntropy(assessment, matrix)

  return (
    <div className="grid gap-6">
      <Surface className="overflow-x-auto p-6">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-text-muted uppercase">
          Simulated / demo · not a clinical susceptibility test
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Values shift with the selected synthetic patient (organism, allergies, renal band, prior exposure).
        </p>
        <table className="mt-5 w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-[11px] tracking-[0.12em] text-text-muted uppercase">
              <th className="pb-3">Candidate pathway</th>
              <th className="pb-3">Compatibility</th>
              <th className="pb-3">Confidence</th>
              <th className="pb-3">Uncertainty</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.candidate} className="border-t border-blue-dark/8">
                <td className="py-3 pr-4 font-medium text-blue-dark">{row.candidate}</td>
                <td className="py-3">
                  <Meter value={row.susceptibility} />
                </td>
                <td className="py-3">
                  <Meter value={row.confidence} />
                </td>
                <td className="py-3">
                  <Meter value={row.uncertainty} tone="warn" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Surface>

      <Surface className="p-6 sm:p-8">
        <p className="text-[12px] font-semibold tracking-[0.18em] text-blue uppercase">Entropy / uncertainty</p>
        <h2 className="font-display mt-2 text-3xl text-blue-dark">Information, not clinical risk.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted">{ENTROPY_EXPLAINER}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Stat label="Uncertainty score" value={`${entropy.uncertaintyScore}`} />
          <Stat label="Information confidence" value={`${entropy.informationConfidence}`} />
          <Stat label="Data completeness" value={`${entropy.dataCompleteness}%`} />
          <Stat label="Band" value={entropy.band} />
        </div>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-bg-light">
          <motion.div
            className={`h-full ${entropy.band === 'high' ? 'bg-[#d9a15c]' : entropy.band === 'medium' ? 'bg-cyan' : 'bg-lime'}`}
            initial={{ width: 0 }}
            animate={{ width: `${entropy.uncertaintyScore}%` }}
          />
        </div>
        <ul className="mt-5 space-y-2 text-sm leading-6 text-text-muted">
          {entropy.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Surface>

      <HumanInTheLoop />
      <div className="flex flex-wrap gap-3">
        <Button to="/hybrid-engine">Open hybrid engine</Button>
        <Button to="/assessment" variant="ghost">
          Edit patient
        </Button>
      </div>
    </div>
  )
}

function Meter({ value, tone = 'ok' }: { value: number; tone?: 'ok' | 'warn' }) {
  return (
    <div>
      <span className="text-xs font-semibold text-blue-dark">{value}</span>
      <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-bg-light">
        <div
          className={`h-full ${tone === 'warn' ? 'bg-[#d9a15c]' : 'bg-cyan'}`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-blue-dark/8 bg-bg-light/70 p-4">
      <p className="text-[10px] font-semibold tracking-[0.14em] text-text-muted uppercase">{label}</p>
      <p className="font-display mt-2 text-3xl text-blue-dark">{value}</p>
    </div>
  )
}
