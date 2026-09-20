import type { SimulationResult } from '@/engine/optimization'
import { demoMetrics } from '@/data/demoMetrics'

export function deriveDashboardMetrics(result: SimulationResult | null) {
  const uncertaintyBump = result ? Math.round(result.entropy.uncertaintyScore / 8) : 0
  const reviewBump = result && !result.safety.allPrototypeChecksPassed ? 6 : result ? 2 : 0

  return {
    patientsAnalyzed: demoMetrics.patientsAnalyzed + (result ? 1 : 0),
    casesFlagged: demoMetrics.casesFlagged + reviewBump,
    highUncertainty: demoMetrics.highUncertainty + (result?.entropy.band === 'high' ? 1 : 0) + uncertaintyBump,
    reviewRequired: demoMetrics.reviewRequired + (result ? 1 : 0),
    illustrative: true as const,
    utilization: [
      { name: 'Narrow pathway', value: 38 + (result ? 4 : 0) },
      { name: 'Allergy-avoidant', value: 18 },
      { name: 'Duration review', value: 22 },
      { name: 'Broader review', value: 12 + (result?.entropy.band === 'high' ? 5 : 0) },
      { name: 'IV-to-oral', value: 10 },
    ],
    susceptibility: result
      ? result.susceptibility.map((row) => ({
          name: row.candidate.replace(' pathway', '').replace('Candidate ', ''),
          value: row.susceptibility,
        }))
      : [
          { name: 'Narrow urinary', value: 72 },
          { name: 'Allergy-avoidant', value: 64 },
          { name: 'Duration review', value: 69 },
          { name: 'Broader review', value: 51 },
          { name: 'IV-to-oral', value: 60 },
        ],
    uncertaintyTrend: [
      { week: 'W1', score: 41 },
      { week: 'W2', score: 38 },
      { week: 'W3', score: 44 },
      { week: 'W4', score: 36 },
      { week: 'W5', score: result ? result.entropy.uncertaintyScore : 39 },
    ],
    interventions: [
      { name: 'Timeout prompted', count: 42 },
      { name: 'Duration shortened', count: 31 },
      { name: 'IV-to-oral', count: 27 },
      { name: 'Allergy clarified', count: 19 },
      { name: 'Culture follow-up', count: 24 + (result ? 1 : 0) },
    ],
    duration: [
      { day: '3d', cases: 40 },
      { day: '5d', cases: 62 },
      { day: '7d', cases: 48 },
      { day: '10d', cases: 21 },
      { day: '14d', cases: 11 },
    ],
  }
}
