import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/animations/PageTransition'
import { SafetyGatePanel } from '@/components/safety/SafetyGatePanel'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { HumanInTheLoop } from '@/components/ui/HumanInTheLoop'
import { Kicker, PageShell, Surface } from '@/components/ui/Surface'
import { NeedProfile } from '@/components/ui/NeedProfile'
import { StatusPills } from '@/components/ui/StatusPills'
import { DECISION_TRACE_STEPS } from '@/features/explainability/trace'
import { describeFactor, type SimulationResult } from '@/engine/optimization'
import type { ScenarioFactor } from '@/types/assessment'
import { useQabx } from '@/state/QabxContext'
import { printReport } from '@/utils/report'

const FACTORS: { id: ScenarioFactor; label: string }[] = [
  { id: 'previousAntibioticExposure', label: 'Previous antibiotic exposure' },
  { id: 'renalFunction', label: 'Renal function' },
  { id: 'organism', label: 'Organism' },
  { id: 'allergy', label: 'Allergy' },
]

export function Results() {
  const { simulation, runOptimization, runComparison, replaySimulation, engineRunning } = useQabx()
  const [traceOpen, setTraceOpen] = useState(true)
  const [replayFlash, setReplayFlash] = useState(0)

  const onReplay = async () => {
    await replaySimulation()
    setReplayFlash((value) => value + 1)
  }

  return (
    <PageTransition>
      <PageShell>
        <Container>
          <StatusPills />
          <Kicker>Results</Kicker>
          <h1 className="font-display mt-3 max-w-3xl text-4xl text-blue-dark sm:text-6xl">
            Candidate strategies, not prescriptions.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-muted">
            Demo / simulated output. Each pathway is a discussion object for clinician review — never a
            medically correct antibiotic.
          </p>

          <div className="mt-8">
            <NeedProfile title="Validate a patient, then run hybrid optimization.">
              {simulation ? (
                <ResultsBody
                  simulation={simulation}
                  traceOpen={traceOpen}
                  onToggleTrace={() => setTraceOpen((value) => !value)}
                  onReplay={onReplay}
                  replaying={engineRunning}
                  replayFlash={replayFlash}
                  onCompare={(factor) => void runComparison(factor)}
                  onRerun={() => void runOptimization()}
                />
              ) : (
                <Surface className="p-8">
                  <h2 className="font-display text-3xl text-blue-dark">No simulation stored yet.</h2>
                  <p className="mt-3 text-text-muted">
                    The profile is validated. Run the hybrid engine to write a result into session state.
                  </p>
                  <Button className="mt-6" to="/hybrid-engine">
                    Run hybrid optimization
                  </Button>
                </Surface>
              )}
            </NeedProfile>
          </div>
        </Container>
      </PageShell>
    </PageTransition>
  )
}

function ResultsBody({
  simulation,
  traceOpen,
  onToggleTrace,
  onReplay,
  replaying,
  replayFlash,
  onCompare,
  onRerun,
}: {
  simulation: SimulationResult
  traceOpen: boolean
  onToggleTrace: () => void
  onReplay: () => void
  replaying: boolean
  replayFlash: number
  onCompare: (factor: ScenarioFactor) => void
  onRerun: () => void
}) {
  const { comparison } = useQabx()
  const maxContribution = Math.max(...simulation.contributions.map((item) => item.weight))

  return (
    <div className="grid gap-6">
      <Surface className="p-6 sm:p-8">
        <p className="text-[12px] font-semibold tracking-[0.18em] text-cyan uppercase">Hybrid analysis complete</p>
        <h2 className="font-display mt-2 text-3xl text-blue-dark">{simulation.runId}</h2>
        <p className="mt-2 text-sm text-text-muted">
          Requires clinician review · Demo / simulated output · Not clinically validated
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Mini label="Data confidence" value={`${simulation.entropy.informationConfidence}`} />
          <Mini label="Uncertainty" value={`${simulation.entropy.uncertaintyScore} (${simulation.entropy.band})`} />
          <Mini
            label="Constraints"
            value={`${simulation.constraints.filter((item) => item.satisfied).length}/${simulation.constraints.length} held`}
          />
          <Mini label="Objective total" value={`${simulation.objective.total}`} />
        </div>
      </Surface>

      <div className="grid gap-4">
        {simulation.candidates.map((candidate) => (
          <Surface key={candidate.id} className="p-6">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-blue uppercase">
              Candidate Strategy {candidate.id}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-blue-dark">{candidate.label}</h3>
            <p className="mt-3 text-sm leading-7 text-text-muted">{candidate.explanation}</p>
            <p className="mt-3 text-sm text-text-muted">
              Compatibility {candidate.compatibility} · Uncertainty {candidate.uncertainty}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f3e0c8] px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#8a4b12] uppercase">
                Requires clinician review
              </span>
              <span className="rounded-full border border-blue-dark/10 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-text-muted uppercase">
                Demo / simulated output
              </span>
            </div>
          </Surface>
        ))}
      </div>

      <SafetyGatePanel safety={simulation.safety} />

      <Surface className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.18em] text-blue uppercase">Explainability</p>
            <h2 className="font-display mt-2 text-3xl text-blue-dark">Why did the system generate this output?</h2>
          </div>
          <Button variant="outline" onClick={onToggleTrace}>
            {traceOpen ? 'Hide decision trace' : 'View decision trace'}
          </Button>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-text-muted">
          Contribution categories are prototype attributions for the synthetic run, not causal clinical proof.
        </p>
        <div className="mt-6 space-y-3">
          {simulation.contributions.map((item) => (
            <div key={item.category}>
              <div className="flex justify-between text-sm text-blue-dark">
                <span>{item.category}</span>
                <span>{item.weight}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-bg-light">
                <motion.div
                  className="h-full bg-cyan"
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.weight / maxContribution) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-text-muted">{item.note}</p>
            </div>
          ))}
        </div>
        {traceOpen ? (
          <ol className="mt-8 space-y-3">
            {simulation.decisionTrace.map((item, index) => (
              <li key={item.title} className="rounded-2xl border border-blue-dark/8 bg-bg-light/70 px-4 py-3">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-blue uppercase">
                  {String(index + 1).padStart(2, '0')} · {DECISION_TRACE_STEPS[index] ?? item.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-text-muted">{item.detail}</p>
              </li>
            ))}
          </ol>
        ) : null}
      </Surface>

      <Surface className="p-6 sm:p-8">
        <p className="text-[12px] font-semibold tracking-[0.18em] text-blue uppercase">Compare scenarios</p>
        <h2 className="font-display mt-2 text-3xl text-blue-dark">Duplicate, change one factor, rerun.</h2>
        <p className="mt-3 text-sm text-text-muted">
          The comparison copy is synthetic. It shows which demo input shifted the simulated ranking.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {FACTORS.map((factor) => (
            <Button key={factor.id} variant="outline" onClick={() => onCompare(factor.id)}>
              Compare {factor.label.toLowerCase()}
            </Button>
          ))}
        </div>
        {comparison ? (
          <div className="mt-6 rounded-[1.3rem] border border-blue-dark/10 bg-bg-light/80 p-5">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-blue uppercase">What changed?</p>
            <p className="mt-2 text-sm font-medium text-blue-dark">{describeFactor(comparison.factor)}</p>
            <ul className="mt-3 space-y-1 text-sm text-text-muted">
              {comparison.changedInputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] text-text-muted uppercase">Output shift</p>
            <ul className="mt-2 space-y-1 text-sm text-text-muted">
              {comparison.outputShifts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </Surface>

      <ReplayStrip nonce={replayFlash} running={replaying} />

      <div className="flex flex-wrap gap-3">
        <Button onClick={onReplay} disabled={replaying}>
          Simulation replay
        </Button>
        <Button variant="outline" onClick={() => printReport(simulation)}>
          Export report
        </Button>
        <Button variant="ghost" onClick={onRerun} disabled={replaying}>
          Re-run hybrid optimization
        </Button>
        <Button variant="ghost" to="/dashboard">
          Stewardship dashboard
        </Button>
      </div>
      <HumanInTheLoop />
    </div>
  )
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-bg-light/80 p-4">
      <p className="text-[10px] font-semibold tracking-[0.14em] text-text-muted uppercase">{label}</p>
      <p className="mt-2 text-lg font-semibold text-blue-dark">{value}</p>
    </div>
  )
}

function ReplayStrip({ nonce, running }: { nonce: number; running: boolean }) {
  const stages = useMemo(
    () => ['Patient profile', 'Features', 'Susceptibility', 'Constraints', 'Simulated optimizer', 'Validation', 'Trace'],
    [],
  )

  return (
    <Surface className="p-6">
      <p className="text-[12px] font-semibold tracking-[0.18em] text-blue uppercase">Simulation replay</p>
      <p className="mt-2 text-sm text-text-muted">
        Replays the stored pipeline visually after a completed run. Still simulated optimization.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {stages.map((stage, index) => (
          <motion.span
            key={`${stage}-${nonce}`}
            initial={{ opacity: 0.35, y: 6 }}
            animate={{ opacity: running ? 1 : 0.9, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-full border border-blue-dark/10 bg-surface px-3 py-1 text-xs text-blue-dark"
          >
            {stage}
          </motion.span>
        ))}
      </div>
    </Surface>
  )
}
