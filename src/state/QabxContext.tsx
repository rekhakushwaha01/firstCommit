import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AssessmentData, ScenarioFactor } from '@/types/assessment'
import type { SimulationStep } from '@/types/simulation'
import { applyScenarioChange, runHybridSimulation, type SimulationResult } from '@/engine/optimization'
import { compareScenarios, type ScenarioComparison } from '@/engine/compare'
import { SIMULATION_STEPS } from '@/utils/simulation'

type QabxState = {
  assessment: AssessmentData | null
  validated: boolean
  simulation: SimulationResult | null
  comparison: ScenarioComparison | null
  engineStep: SimulationStep
  engineRunning: boolean
  replayNonce: number
}

type QabxContextValue = QabxState & {
  saveAssessment: (data: AssessmentData) => void
  markValidated: () => void
  runOptimization: (profile?: AssessmentData) => Promise<SimulationResult>
  runComparison: (factor: ScenarioFactor) => Promise<ScenarioComparison>
  replaySimulation: () => Promise<void>
  resetSession: () => void
}

const QabxContext = createContext<QabxContextValue | null>(null)

const initialState: QabxState = {
  assessment: null,
  validated: false,
  simulation: null,
  comparison: null,
  engineStep: 'idle',
  engineRunning: false,
  replayNonce: 0,
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export function QabxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QabxState>(initialState)

  const saveAssessment = useCallback((data: AssessmentData) => {
    setState((current) => ({
      ...current,
      assessment: data,
      validated: false,
      simulation: null,
      comparison: null,
    }))
  }, [])

  const markValidated = useCallback(() => {
    setState((current) => ({ ...current, validated: Boolean(current.assessment) }))
  }, [])

  const runOptimization = useCallback(async (profile?: AssessmentData) => {
    const source = profile ?? state.assessment
    if (!source) {
      throw new Error('No synthetic patient profile is loaded.')
    }

    setState((current) => ({
      ...current,
      assessment: source,
      engineRunning: true,
      engineStep: 'patient-received',
      comparison: current.assessment === source ? current.comparison : null,
    }))

    for (const step of SIMULATION_STEPS) {
      setState((current) => ({ ...current, engineStep: step, engineRunning: true }))
      await delay(step === 'quantum-simulation' ? 700 : 380)
    }

    const simulation = runHybridSimulation(source)
    setState((current) => ({
      ...current,
      assessment: source,
      simulation,
      engineRunning: false,
      engineStep: 'decision-trace',
      replayNonce: current.replayNonce + 1,
    }))
    return simulation
  }, [state.assessment])

  const runComparison = useCallback(
    async (factor: ScenarioFactor) => {
      const source = state.assessment
      if (!source) {
        throw new Error('Validate a synthetic patient before comparing scenarios.')
      }
      const baseline = state.simulation ?? runHybridSimulation(source)
      const variantProfile = applyScenarioChange(source, factor)
      const variant = runHybridSimulation(variantProfile)
      const comparison = compareScenarios(factor, baseline, variant)
      setState((current) => ({
        ...current,
        simulation: baseline,
        comparison,
      }))
      return comparison
    },
    [state.assessment, state.simulation],
  )

  const replaySimulation = useCallback(async () => {
    if (!state.assessment) return
    await runOptimization(state.assessment)
  }, [runOptimization, state.assessment])

  const resetSession = useCallback(() => {
    setState(initialState)
  }, [])

  const value = useMemo<QabxContextValue>(
    () => ({
      ...state,
      saveAssessment,
      markValidated,
      runOptimization,
      runComparison,
      replaySimulation,
      resetSession,
    }),
    [markValidated, replaySimulation, resetSession, runComparison, runOptimization, saveAssessment, state],
  )

  return <QabxContext.Provider value={value}>{children}</QabxContext.Provider>
}

export function useQabx() {
  const context = useContext(QabxContext)
  if (!context) {
    throw new Error('useQabx must be used within QabxProvider')
  }
  return context
}
