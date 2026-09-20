export type CandidateStrategy = {
  id: 'A' | 'B' | 'C'
  label: string
  compatibility: number
  uncertainty: number
  explanation: string
  requiresClinicianReview: true
}
