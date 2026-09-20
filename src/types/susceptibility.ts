export type SampleType = 'urine' | 'blood' | 'respiratory' | 'wound' | 'other'

export type SusceptibilityRow = {
  candidate: string
  susceptibility: number
  confidence: number
  uncertainty: number
  synthetic: true
}
