import { z } from 'zod'

const optionalMetric = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === '' || value === null || value === undefined) return null
    const numeric = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(numeric) ? numeric : null
  })
  .pipe(z.number().nonnegative().nullable())

export const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dose: z.string().min(1, 'Dose is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
})

export const assessmentSchema = z.object({
  patientId: z.string().trim().min(3, 'Enter a synthetic patient ID'),
  ageYears: z.coerce.number().min(0, 'Age is required').max(120),
  sex: z.enum(['female', 'male', 'other', 'unspecified']),
  weightKg: z.coerce.number().min(1, 'Weight is required').max(400),
  heightCm: z.coerce.number().min(30, 'Height is required').max(250),
  pregnancyStatus: z.enum(['not-applicable', 'not-pregnant', 'pregnant', 'unknown']),
  comorbidities: z.array(z.string()),
  allergies: z.array(z.string()),
  renalFunction: z.enum(['not-recorded', 'within-typical-range', 'requires-review']),
  hepaticFunction: z.enum(['not-recorded', 'within-typical-range', 'requires-review']),
  previousInfection: z.string(),
  recentHospitalization: z.boolean(),
  recentProcedure: z.boolean(),
  previousAntibioticExposure: z.boolean(),
  previousAntibioticNotes: z.string(),
  immunocompromised: z.boolean(),
  medications: z.array(medicationSchema).min(1, 'Add at least one medication row, or record “none”'),
  creatinine: optionalMetric,
  egfr: optionalMetric,
  ast: optionalMetric,
  alt: optionalMetric,
  bilirubin: optionalMetric,
  albumin: optionalMetric,
  otherMarkers: z.string(),
  sampleType: z.enum(['urine', 'blood', 'respiratory', 'wound', 'other']),
  organism: z.string().trim().min(2, 'Organism is required for this demo workflow'),
  cultureResult: z.enum(['pending', 'growth', 'no-growth', 'contaminated']),
  resistanceMarkers: z.string(),
  susceptibilityNotes: z.string(),
})

export type AssessmentFormValues = z.infer<typeof assessmentSchema>

export const STEP_FIELDS: Record<string, (keyof AssessmentFormValues)[]> = {
  demographics: ['patientId', 'ageYears', 'sex', 'weightKg', 'heightCm', 'pregnancyStatus'],
  history: [
    'comorbidities',
    'allergies',
    'renalFunction',
    'hepaticFunction',
    'previousInfection',
    'recentHospitalization',
    'recentProcedure',
    'previousAntibioticExposure',
    'previousAntibioticNotes',
    'immunocompromised',
  ],
  medications: ['medications'],
  clinical: ['creatinine', 'egfr', 'ast', 'alt', 'bilirubin', 'albumin', 'otherMarkers'],
  microbiology: ['sampleType', 'organism', 'cultureResult', 'resistanceMarkers', 'susceptibilityNotes'],
  review: [],
}
