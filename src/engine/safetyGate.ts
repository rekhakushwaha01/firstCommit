import type { AssessmentData } from '@/types/assessment'
import type { EntropyAnalysis } from '@/engine/entropy'
import { prototypeInteractionReview } from '@/engine/medications'

export type SafetyCheck = {
  id: string
  label: string
  passed: boolean
  detail: string
}

export type SafetyGateResult = {
  checks: SafetyCheck[]
  allPrototypeChecksPassed: boolean
  humanReviewRequired: true
  headline: string
}

export function evaluateSafetyGate(profile: AssessmentData, entropy: EntropyAnalysis): SafetyGateResult {
  const interactions = prototypeInteractionReview(profile.medications, profile.renalFunction === 'requires-review')
  const interactionReviewNeeded = interactions.some((item) => item.severity === 'review')

  const checks: SafetyCheck[] = [
    {
      id: 'allergy',
      label: 'Allergy review',
      passed: true,
      detail: profile.allergies.length
        ? `Allergies recorded: ${profile.allergies.join('; ')}. Pathways that collide with documented classes are down-weighted in the simulation only.`
        : 'No allergies recorded in the synthetic chart. Missing allergy data still requires clinician confirmation.',
    },
    {
      id: 'renal',
      label: 'Renal function review',
      passed: profile.renalFunction !== 'requires-review' && (profile.egfr === null || profile.egfr >= 60),
      detail:
        profile.renalFunction === 'requires-review'
          ? 'Renal function is marked for review. The prototype will not silently clear dose or agent selection.'
          : 'Renal band is within the synthetic typical range or not fully recorded — clinician confirmation remains required.',
    },
    {
      id: 'interaction',
      label: 'Medication interaction review',
      passed: !interactionReviewNeeded,
      detail: interactionReviewNeeded
        ? 'Prototype interaction flags require human review. No validated interaction database is connected.'
        : 'No matching demo interaction rule fired. This is not a clearance.',
    },
    {
      id: 'contraindication',
      label: 'Contraindication review',
      passed: profile.pregnancyStatus !== 'pregnant',
      detail:
        profile.pregnancyStatus === 'pregnant'
          ? 'Pregnancy status is recorded. The prototype cannot authorize any antimicrobial pathway.'
          : 'No pregnancy contraindication flag in this synthetic profile.',
    },
    {
      id: 'culture',
      label: 'Culture compatibility',
      passed: profile.cultureResult === 'growth',
      detail:
        profile.cultureResult === 'growth'
          ? 'Growth is recorded in the demo microbiology panel. Compatibility values remain simulated.'
          : 'Culture is pending, negative, or contaminated. Compatibility cannot be treated as established.',
    },
    {
      id: 'stewardship',
      label: 'Stewardship constraints',
      passed: !profile.immunocompromised,
      detail: profile.immunocompromised
        ? 'Immunocompromised status increases stewardship complexity and forces review.'
        : 'Standard demo stewardship constraints applied (spectrum, duration, route).',
    },
    {
      id: 'confidence',
      label: 'Confidence threshold',
      passed: entropy.band !== 'high' && entropy.informationConfidence >= 55,
      detail:
        entropy.band === 'high'
          ? 'Information-uncertainty is high. The safety gate will not auto-clear the case.'
          : `Demo information confidence is ${entropy.informationConfidence}%. Still not a clinical validation threshold.`,
    },
  ]

  const allPrototypeChecksPassed = checks.every((check) => check.passed)

  return {
    checks,
    allPrototypeChecksPassed,
    humanReviewRequired: true,
    headline: allPrototypeChecksPassed
      ? 'Prototype checks passed — ⚠ human review required before any clinical decision'
      : '⚠ HUMAN REVIEW REQUIRED — one or more prototype safety gates did not pass',
  }
}
