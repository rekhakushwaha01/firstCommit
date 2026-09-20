import type { SimulationStep } from '@/types/simulation'

export const SIMULATION_STEPS: SimulationStep[] = [
  'patient-received',
  'features-extracted',
  'risk-estimation',
  'constraints',
  'quantum-simulation',
  'classical-validation',
  'decision-trace',
]
