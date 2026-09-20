import type { AssessmentData } from '@/types/assessment'
import type { SusceptibilityRow } from '@/types/susceptibility'
import { bodyMassIndex } from '@/utils/calculations'
import { clamp, round } from '@/engine/hash'

export type EntropyAnalysis = {
  uncertaintyScore: number
  informationConfidence: number
  dataCompleteness: number
  band: 'low' | 'medium' | 'high'
  shannonLike: number
  notes: string[]
}

function completeness(profile: AssessmentData) {
  const checks = [
    profile.patientId,
    profile.ageYears > 0,
    profile.weightKg > 0,
    profile.heightCm > 0,
    profile.comorbidities.length > 0,
    profile.renalFunction !== 'not-recorded',
    profile.hepaticFunction !== 'not-recorded',
    profile.previousInfection,
    profile.medications.some((item) => item.name),
    profile.creatinine !== null,
    profile.egfr !== null,
    profile.ast !== null,
    profile.alt !== null,
    profile.bilirubin !== null,
    profile.albumin !== null,
    profile.organism,
    profile.cultureResult !== 'pending',
    profile.resistanceMarkers,
    profile.susceptibilityNotes,
  ]
  const filled = checks.filter(Boolean).length
  return filled / checks.length
}

export function analyzeEntropy(profile: AssessmentData, matrix: SusceptibilityRow[]): EntropyAnalysis {
  const complete = completeness(profile)
  const probabilities = matrix.map((row) => Math.max(row.susceptibility, 1))
  const total = probabilities.reduce((sum, value) => sum + value, 0)
  const entropy = probabilities.reduce((sum, value) => {
    const p = value / total
    return sum - p * Math.log2(p)
  }, 0)
  const maxEntropy = Math.log2(Math.max(matrix.length, 2))
  const normalized = maxEntropy === 0 ? 0 : entropy / maxEntropy

  let uncertainty = 0.22 + (1 - complete) * 0.42 + normalized * 0.18
  if (profile.cultureResult === 'pending' || profile.cultureResult === 'contaminated') uncertainty += 0.14
  if (profile.renalFunction === 'requires-review' || profile.hepaticFunction === 'requires-review') {
    uncertainty += 0.08
  }
  if (profile.previousAntibioticExposure) uncertainty += 0.06
  if (/esbl|mrsa|resistant/i.test(profile.resistanceMarkers)) uncertainty += 0.07
  if (profile.allergies.length > 0) uncertainty += 0.03
  if (bodyMassIndex(profile.weightKg, profile.heightCm) === 0) uncertainty += 0.05

  uncertainty = clamp(uncertainty)
  const confidence = clamp(1 - uncertainty * 0.85)
  const band: EntropyAnalysis['band'] = uncertainty >= 0.55 ? 'high' : uncertainty >= 0.35 ? 'medium' : 'low'

  const notes = [
    'Entropy here is an information/uncertainty measure for the research prototype, not a clinical risk score.',
    `Data completeness is ${(complete * 100).toFixed(0)}% across synthetic intake fields.`,
    `Dispersion across simulated pathways contributes a Shannon-like term of ${round(normalized, 2)}.`,
  ]

  if (band === 'high') {
    notes.push('High uncertainty: additional microbiology or organ-function review would usually be requested before any stewardship discussion.')
  }

  return {
    uncertaintyScore: round(uncertainty * 100, 1),
    informationConfidence: round(confidence * 100, 1),
    dataCompleteness: round(complete * 100, 1),
    band,
    shannonLike: round(normalized, 3),
    notes,
  }
}
