export type Sex = 'female' | 'male' | 'other' | 'unspecified'

export type OrganFunctionBand = 'not-recorded' | 'within-typical-range' | 'requires-review'

export type PatientProfile = {
  id: string
  ageYears: number
  sex: Sex
  weightKg: number
  heightCm: number
  pregnancyStatus: 'not-applicable' | 'not-pregnant' | 'pregnant' | 'unknown'
  comorbidities: string[]
  allergies: string[]
  renalFunction: OrganFunctionBand
  hepaticFunction: OrganFunctionBand
  synthetic: true
}
