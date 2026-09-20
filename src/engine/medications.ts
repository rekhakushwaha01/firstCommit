import type { AssessmentData } from '@/types/assessment'
import type { MedicationRecord } from '@/types/medication'

export type InteractionFlag = {
  title: string
  detail: string
  severity: 'info' | 'review'
}

export function prototypeInteractionReview(medications: MedicationRecord[], renalReview: boolean) {
  const flags: InteractionFlag[] = []
  const names = medications.map((item) => item.name.toLowerCase())

  if (medications.length >= 3) {
    flags.push({
      title: 'Polypharmacy review',
      detail: 'Three or more concurrent medicines are recorded. This prototype flags stewardship-relevant burden only.',
      severity: 'review',
    })
  }

  if (names.some((name) => name.includes('metformin')) && renalReview) {
    flags.push({
      title: 'Metformin + renal function',
      detail: 'Synthetic rule: metformin with renal-function review is highlighted for clinician attention. Not a dosing recommendation.',
      severity: 'review',
    })
  }

  if (names.some((name) => name.includes('ibuprofen') || name.includes('nsaid'))) {
    flags.push({
      title: 'NSAID coexistence',
      detail: 'Prototype flag for overlapping renal / GI considerations. Demo rule only.',
      severity: 'info',
    })
  }

  if (names.some((name) => name.includes('lisinopril') || name.includes('ace'))) {
    flags.push({
      title: 'ACE inhibitor recorded',
      detail: 'Recorded for constraint context. This is not a validated interaction database result.',
      severity: 'info',
    })
  }

  if (flags.length === 0) {
    flags.push({
      title: 'No prototype flags',
      detail: 'The demo engine did not match a built-in synthetic rule. Absence of flags is not evidence of safety.',
      severity: 'info',
    })
  }

  return flags
}

export function summarizeProfile(profile: AssessmentData) {
  return {
    demographics: `${profile.patientId} · ${profile.ageYears}y · ${profile.sex} · ${profile.weightKg} kg / ${profile.heightCm} cm`,
    allergies: profile.allergies.length ? profile.allergies.join('; ') : 'None recorded',
    organism: `${profile.organism} (${profile.sampleType}, ${profile.cultureResult})`,
  }
}
