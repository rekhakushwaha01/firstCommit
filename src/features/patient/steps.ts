export const PATIENT_WIZARD_STEPS = [
  { id: 'demographics', number: '01', label: 'Patient Demographics' },
  { id: 'history', number: '02', label: 'Medical History' },
  { id: 'medications', number: '03', label: 'Medications' },
  { id: 'clinical', number: '04', label: 'Clinical / Enzyme Factors' },
  { id: 'microbiology', number: '05', label: 'Microbiology' },
  { id: 'review', number: '06', label: 'Review' },
] as const

export type WizardStepId = (typeof PATIENT_WIZARD_STEPS)[number]['id']
