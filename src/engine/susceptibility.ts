import type { AssessmentData } from '@/types/assessment'
import type { SusceptibilityRow } from '@/types/susceptibility'
import { clamp, profileFingerprint, round } from '@/engine/hash'

export const CANDIDATE_PATHWAYS = [
  {
    id: 'narrow-urinary',
    candidate: 'Narrow-spectrum urinary stewardship pathway',
  },
  {
    id: 'allergy-avoidant',
    candidate: 'Allergy-avoidant alternative pathway',
  },
  {
    id: 'duration-minimizing',
    candidate: 'Duration-minimizing review pathway',
  },
  {
    id: 'broader-review',
    candidate: 'Broader-spectrum review-only pathway',
  },
  {
    id: 'parenteral-sparing',
    candidate: 'Oral / parenteral-sparing transition pathway',
  },
] as const

export function simulateSusceptibility(profile: AssessmentData): SusceptibilityRow[] {
  const seed = profileFingerprint([
    profile.patientId,
    profile.organism,
    profile.sampleType,
    profile.allergies.join(','),
    profile.renalFunction,
    profile.previousAntibioticExposure,
    profile.resistanceMarkers,
    profile.cultureResult,
  ])

  const esbl = /esbl/i.test(profile.resistanceMarkers)
  const penicillinAllergy = profile.allergies.some((item) => /penicillin|beta[- ]?lactam/i.test(item))
  const urinary = profile.sampleType === 'urine'
  const staph = /staph/i.test(profile.organism)
  const ecoli = /coli/i.test(profile.organism)
  const pending = profile.cultureResult === 'pending' || profile.cultureResult === 'contaminated'

  return CANDIDATE_PATHWAYS.map((pathway, index) => {
    const jitter = ((seed * (index + 3) * 17) % 1) * 0.08
    let susceptibility = 0.62 + jitter
    let confidence = 0.58
    let uncertainty = 0.34

    if (pathway.id === 'narrow-urinary' && urinary && ecoli) susceptibility += 0.18
    if (pathway.id === 'narrow-urinary' && esbl) susceptibility -= 0.22
    if (pathway.id === 'allergy-avoidant' && penicillinAllergy) susceptibility += 0.16
    if (pathway.id === 'allergy-avoidant' && !penicillinAllergy) susceptibility -= 0.08
    if (pathway.id === 'broader-review' && (esbl || profile.immunocompromised)) susceptibility += 0.12
    if (pathway.id === 'broader-review') uncertainty += 0.08
    if (pathway.id === 'duration-minimizing' && !profile.immunocompromised) susceptibility += 0.1
    if (pathway.id === 'parenteral-sparing' && staph && profile.sampleType === 'wound') susceptibility += 0.11
    if (profile.renalFunction === 'requires-review') {
      susceptibility -= 0.05
      uncertainty += 0.07
    }
    if (profile.previousAntibioticExposure) {
      susceptibility -= 0.06
      uncertainty += 0.09
      confidence -= 0.08
    }
    if (pending) {
      confidence -= 0.18
      uncertainty += 0.16
    }

    confidence += 0.12 - uncertainty * 0.2
    return {
      candidate: pathway.candidate,
      susceptibility: round(clamp(susceptibility) * 100, 1),
      confidence: round(clamp(confidence) * 100, 1),
      uncertainty: round(clamp(uncertainty) * 100, 1),
      synthetic: true as const,
    }
  })
}
