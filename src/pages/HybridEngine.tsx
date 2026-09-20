import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/animations/PageTransition'
import { QuantumCircuit } from '@/components/three/QuantumCircuit'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { HumanInTheLoop } from '@/components/ui/HumanInTheLoop'
import { Kicker, PageShell, Surface } from '@/components/ui/Surface'
import { NeedProfile } from '@/components/ui/NeedProfile'
import { StatusPills } from '@/components/ui/StatusPills'
import { OPTIMIZATION_LABEL } from '@/features/optimization/labels'
import { STAGE_COPY } from '@/engine/optimization'
import { useQabx } from '@/state/QabxContext'
import { useSimulation } from '@/hooks/useSimulation'

const FLOW = [
  'Classical intelligence',
  'Feature extraction',
  'Risk / constraint estimation',
  'Quantum optimization simulation',
  'Candidate strategy generation',
  'Classical validation',
  'Explainable output',
]

export function HybridEngine() {
  const { runOptimization, simulation, engineRunning } = useQabx()
  const { step } = useSimulation()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const onRun = async () => {
    setError('')
    try {
      await runOptimization()
      navigate('/results')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Simulation could not start.')
    }
  }

  return (
    <PageTransition>
      <PageShell>
        <Container>
          <StatusPills />
          <Kicker>Hybrid engine</Kicker>
          <h1 className="font-display mt-3 max-w-3xl text-4xl text-blue-dark sm:text-6xl">
            Simulated quantum-classical loop.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-muted">
            {OPTIMIZATION_LABEL}. This visualization does not use quantum hardware and does not claim
            quantum advantage. It is a research animation of a conceptual objective: resistance pressure +
            safety penalty + treatment burden + uncertainty, subject to patient, allergy, interaction and
            stewardship constraints.
          </p>

          <div className="mt-8">
            <NeedProfile title="Validate the patient profile before running the engine.">
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <Surface className="p-6 sm:p-8">
                  <ol className="space-y-3">
                    {FLOW.map((item, index) => (
                      <li key={item} className="flex gap-3 rounded-2xl border border-blue-dark/8 bg-bg-light/60 px-4 py-3">
                        <span className="text-[11px] font-semibold tracking-[0.14em] text-blue uppercase">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-medium text-blue-dark">{item}</span>
                      </li>
                    ))}
                  </ol>
                  <Button className="mt-6 w-full py-4" onClick={onRun} disabled={engineRunning}>
                    {engineRunning ? 'Running simulated optimization…' : 'Run hybrid optimization'}
                  </Button>
                  {error ? <p className="mt-3 text-sm text-[#9a3b3b]">{error}</p> : null}
                  {simulation ? (
                    <p className="mt-3 text-sm text-text-muted">
                      Last run {simulation.runId} is stored in session state and will appear on Results.
                    </p>
                  ) : null}
                </Surface>
                <div>
                  <QuantumCircuit active={engineRunning || Boolean(simulation)} />
                  <Surface className="mt-4 p-5">
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-text-muted uppercase">Simulation stages</p>
                    <ul className="mt-3 space-y-2">
                      {STAGE_COPY.map((stage) => {
                        const active = step === stage.id || engineRunning
                        return (
                          <li key={stage.id} className="text-sm">
                            <span className={`font-semibold ${active ? 'text-blue-dark' : 'text-text-muted'}`}>
                              {stage.number} {stage.label}
                            </span>
                            {step === stage.id ? (
                              <motion.span className="ml-2 text-xs tracking-[0.12em] text-cyan uppercase" layout>
                                live
                              </motion.span>
                            ) : null}
                          </li>
                        )
                      })}
                    </ul>
                  </Surface>
                </div>
              </div>
              <div className="mt-6">
                <HumanInTheLoop />
              </div>
            </NeedProfile>
          </div>
        </Container>
      </PageShell>
    </PageTransition>
  )
}
