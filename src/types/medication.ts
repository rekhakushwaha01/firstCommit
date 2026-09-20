export type MedicationRecord = {
  name: string
  dose: string
  frequency: string
  duration: string
}

export type MedicationProfile = {
  current: MedicationRecord[]
  interactionReview: 'prototype-check-only'
}
