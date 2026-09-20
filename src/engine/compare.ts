import type { ScenarioFactor } from '@/types/assessment'
import type { SimulationResult } from '@/engine/optimization'
import { describeFactor } from '@/engine/optimization'

export type ScenarioComparison = {
  factor: ScenarioFactor
  baseline: SimulationResult
  variant: SimulationResult
  changedInputs: string[]
  outputShifts: string[]
}

export function compareScenarios(
  factor: ScenarioFactor,
  baseline: SimulationResult,
  variant: SimulationResult,
): ScenarioComparison {
  const a = baseline.profileSnapshot
  const b = variant.profileSnapshot
  const changedInputs: string[] = []

  if (a.previousAntibioticExposure !== b.previousAntibioticExposure) {
    changedInputs.push(`Previous antibiotic exposure: ${String(a.previousAntibioticExposure)} → ${String(b.previousAntibioticExposure)}`)
  }
  if (a.renalFunction !== b.renalFunction) {
    changedInputs.push(`Renal function: ${a.renalFunction} → ${b.renalFunction}`)
  }
  if (a.organism !== b.organism) {
    changedInputs.push(`Organism: ${a.organism} → ${b.organism}`)
  }
  if (a.allergies.join('|') !== b.allergies.join('|')) {
    changedInputs.push(`Allergies: ${a.allergies.join(', ') || 'none'} → ${b.allergies.join(', ') || 'none'}`)
  }

  const outputShifts = baseline.candidates.map((candidate, index) => {
    const other = variant.candidates[index]
    const delta = round1(other.compatibility - candidate.compatibility)
    return `${candidate.id}: compatibility ${candidate.compatibility} → ${other.compatibility} (${delta >= 0 ? '+' : ''}${delta})`
  })

  outputShifts.push(
    `Uncertainty ${baseline.entropy.uncertaintyScore} → ${variant.entropy.uncertaintyScore}`,
    `Objective total ${baseline.objective.total} → ${variant.objective.total}`,
  )

  if (changedInputs.length === 0) {
    changedInputs.push(`${describeFactor(factor)} was toggled in the comparison copy.`)
  }

  return { factor, baseline, variant, changedInputs, outputShifts }
}

function round1(value: number) {
  return Math.round(value * 10) / 10
}
