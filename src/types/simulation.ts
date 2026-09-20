export type SimulationStep =
  | 'idle'
  | 'patient-received'
  | 'features-extracted'
  | 'risk-estimation'
  | 'constraints'
  | 'quantum-simulation'
  | 'classical-validation'
  | 'decision-trace'

export type SimulationStatus = {
  step: SimulationStep
  running: boolean
}
