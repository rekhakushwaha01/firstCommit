import type { MedicationRecord } from '@/types/medication'
import type { OrganFunctionBand, Sex } from '@/types/patient'
import type { SampleType } from '@/types/susceptibility'

export type PregnancyStatus = 'not-applicable' | 'not-pregnant' | 'pregnant' | 'unknown'

export type CultureResult = 'pending' | 'growth' | 'no-growth' | 'contaminated'

export type AssessmentData = {
  patientId: string
  ageYears: number
  sex: Sex
  weightKg: number
  heightCm: number
  pregnancyStatus: PregnancyStatus
  comorbidities: string[]
  allergies: string[]
  renalFunction: OrganFunctionBand
  hepaticFunction: OrganFunctionBand
  previousInfection: string
  recentHospitalization: boolean
  recentProcedure: boolean
  previousAntibioticExposure: boolean
  previousAntibioticNotes: string
  immunocompromised: boolean
  medications: MedicationRecord[]
  creatinine: number | null
  egfr: number | null
  ast: number | null
  alt: number | null
  bilirubin: number | null
  albumin: number | null
  otherMarkers: string
  sampleType: SampleType
  organism: string
  cultureResult: CultureResult
  resistanceMarkers: string
  susceptibilityNotes: string
}

export type ScenarioFactor =
  | 'previousAntibioticExposure'
  | 'renalFunction'
  | 'organism'
  | 'allergy'

export type ContributionCategory =
  | 'Patient Factors'
  | 'Microbiology'
  | 'Safety Constraints'
  | 'Medication Profile'
  | 'Stewardship Objective'
  | 'Uncertainty'
