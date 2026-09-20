import type { AssessmentData, ContributionCategory, ScenarioFactor } from '@/types/assessment'
import type { CandidateStrategy } from '@/types/optimization'
import type { SimulationStep } from '@/types/simulation'
import { analyzeEntropy, type EntropyAnalysis } from '@/engine/entropy'
import { evaluateSafetyGate, type SafetyGateResult } from '@/engine/safetyGate'
import { prototypeInteractionReview } from '@/engine/medications'
import { simulateSusceptibility } from '@/engine/susceptibility'
import { clamp, profileFingerprint, round } from '@/engine/hash'

export type ConstraintFlag = {
  id: string
  label: string
  satisfied: boolean
  note: string
}

export type ObjectiveBreakdown = {
  resistancePressure: number
  safetyPenalty: number
  treatmentBurden: number
  uncertainty: number
  total: number
}

export type ContributionSlice = {
  category: ContributionCategory
  weight: number
  note: string
}

export type SimulationStage = {
  id: SimulationStep
  number: string
  label: string
  note: string
}

export type SimulationResult = {
  runId: string
  completedAt: string
  synthetic: true
  simulatedOptimization: true
  notClinicallyValidated: true
  stages: SimulationStage[]
  candidates: CandidateStrategy[]
  susceptibility: ReturnType<typeof simulateSusceptibility>
  entropy: EntropyAnalysis
  safety: SafetyGateResult
  constraints: ConstraintFlag[]
  objective: ObjectiveBreakdown
  contributions: ContributionSlice[]
  decisionTrace: { title: string; detail: string }[]
  interactionFlags: ReturnType<typeof prototypeInteractionReview>
  profileSnapshot: AssessmentData
}

const STAGE_COPY: SimulationStage[] = [
  {
    id: 'patient-received',
    number: '01',
    label: 'Patient data received',
    note: 'Synthetic intake is locked into the session state for this demonstration run.',
  },
  {
    id: 'features-extracted',
    number: '02',
    label: 'Features extracted',
    note: 'Classical layer maps demographics, organ function, medications and microbiology into demo features.',
  },
  {
    id: 'risk-estimation',
    number: '03',
    label: 'Risk estimation',
    note: 'Constraint-oriented risk proxies are estimated. These are not clinical risk scores.',
  },
  {
    id: 'constraints',
    number: '04',
    label: 'Constraint generation',
    note: 'Allergy, renal, interaction, culture and stewardship constraints are compiled for the simulator.',
  },
  {
    id: 'quantum-simulation',
    number: '05',
    label: 'Quantum optimization simulation',
    note: 'A conceptual optimizer explores candidate pathways. No quantum hardware is used.',
  },
  {
    id: 'classical-validation',
    number: '06',
    label: 'Classical validation',
    note: 'Classical checks re-rank candidates against constraints and uncertainty.',
  },
  {
    id: 'decision-trace',
    number: '07',
    label: 'Decision trace',
    note: 'An explainable trace is stored for clinician review. No prescription is issued.',
  },
]

function objectiveFor(profile: AssessmentData, entropy: EntropyAnalysis): ObjectiveBreakdown {
  const resistancePressure =
    (profile.previousAntibioticExposure ? 0.34 : 0.16) + (/esbl|resistant/i.test(profile.resistanceMarkers) ? 0.22 : 0.08)
  const safetyPenalty =
    (profile.allergies.length ? 0.18 : 0.06) +
    (profile.renalFunction === 'requires-review' ? 0.2 : 0.05) +
    (profile.pregnancyStatus === 'pregnant' ? 0.25 : 0)
  const treatmentBurden = clamp(0.08 + profile.medications.length * 0.05 + (profile.immunocompromised ? 0.12 : 0))
  const uncertainty = entropy.uncertaintyScore / 100
  const total = round(resistancePressure + safetyPenalty + treatmentBurden + uncertainty, 3)
  return {
    resistancePressure: round(resistancePressure, 3),
    safetyPenalty: round(safetyPenalty, 3),
    treatmentBurden: round(treatmentBurden, 3),
    uncertainty: round(uncertainty, 3),
    total,
  }
}

function buildConstraints(profile: AssessmentData): ConstraintFlag[] {
  return [
    {
      id: 'allergy',
      label: 'Allergy constraint',
      satisfied: true,
      note: profile.allergies.length
        ? 'Documented allergy classes exclude matching pathway families in the simulation.'
        : 'No allergy tokens; clinician must still confirm the history.',
    },
    {
      id: 'renal',
      label: 'Renal / dosing constraint',
      satisfied: profile.renalFunction !== 'requires-review',
      note: 'Renal band informs penalty terms only. The engine does not calculate doses.',
    },
    {
      id: 'interaction',
      label: 'Interaction constraint',
      satisfied: profile.medications.length < 3,
      note: 'Prototype medication rules only — not a licensed interaction database.',
    },
    {
      id: 'stewardship',
      label: 'Stewardship constraint',
      satisfied: !profile.immunocompromised,
      note: 'Spectrum, duration and route are treated as conceptual costs, not orders.',
    },
    {
      id: 'micro',
      label: 'Microbiology constraint',
      satisfied: profile.cultureResult === 'growth',
      note: 'Simulated isolate context. Not an AST report.',
    },
  ]
}

function buildCandidates(profile: AssessmentData, entropy: EntropyAnalysis): CandidateStrategy[] {
  const penicillinAllergy = profile.allergies.some((item) => /penicillin|beta[- ]?lactam/i.test(item))
  const esbl = /esbl/i.test(profile.resistanceMarkers)
  const urinary = profile.sampleType === 'urine'
  const seed = profileFingerprint([profile.patientId, profile.organism, profile.renalFunction, String(profile.previousAntibioticExposure)])

  const baseA = 78 - entropy.uncertaintyScore * 0.15 + (urinary ? 6 : 0) - (esbl ? 10 : 0)
  const baseB = 71 + (penicillinAllergy ? 8 : -2) - (profile.renalFunction === 'requires-review' ? 6 : 0)
  const baseC = 64 + (profile.previousAntibioticExposure ? 5 : 0) + (esbl ? 7 : -3) + seed * 4

  return [
    {
      id: 'A',
      label: 'Candidate Strategy A — narrow stewardship pathway',
      compatibility: round(clamp(baseA / 100) * 100, 1),
      uncertainty: round(clamp(entropy.uncertaintyScore * 0.9), 1),
      explanation: urinary
        ? 'Appeared because the synthetic isolate is a urinary Gram-negative profile and the objective penalizes unnecessary spectrum.'
        : 'Appeared as a spectrum-sparing option given the recorded sample type and stewardship objective.',
      requiresClinicianReview: true,
    },
    {
      id: 'B',
      label: 'Candidate Strategy B — constraint-aware alternative',
      compatibility: round(clamp(baseB / 100) * 100, 1),
      uncertainty: round(clamp(entropy.uncertaintyScore * 0.95 + (penicillinAllergy ? 4 : 0)), 1),
      explanation: penicillinAllergy
        ? 'Appeared to respect the documented penicillin-class allergy while remaining a simulated pathway, not a substitute prescription.'
        : 'Appeared as an alternative ranking after classical constraint re-weighting.',
      requiresClinicianReview: true,
    },
    {
      id: 'C',
      label: 'Candidate Strategy C — review-first / broader discussion',
      compatibility: round(clamp(baseC / 100) * 100, 1),
      uncertainty: round(clamp(entropy.uncertaintyScore + 6), 1),
      explanation: esbl
        ? 'Appeared because a synthetic resistance marker increased the cost of over-confident narrow ranking.'
        : 'Appeared as a conservative discussion option when uncertainty or exposure history is non-zero.',
      requiresClinicianReview: true,
    },
  ]
}

function contributions(profile: AssessmentData, entropy: EntropyAnalysis): ContributionSlice[] {
  const allergy = profile.allergies.length ? 18 : 8
  const micro = 22 + (/esbl/i.test(profile.resistanceMarkers) ? 8 : 0)
  const safety = 16 + (profile.renalFunction === 'requires-review' ? 8 : 0)
  const meds = 10 + Math.min(profile.medications.length * 3, 12)
  const steward = 14
  const uncertain = Math.max(8, Math.round(entropy.uncertaintyScore * 0.2))
  const raw = [
    { category: 'Patient Factors' as const, weight: 12 + (profile.immunocompromised ? 6 : 0), note: 'Age, organ function and comorbidity tokens from the synthetic chart.' },
    { category: 'Microbiology' as const, weight: micro, note: 'Organism, sample type, culture result and synthetic resistance markers.' },
    { category: 'Safety Constraints' as const, weight: safety + allergy, note: 'Allergy, renal, pregnancy and contraindication gates.' },
    { category: 'Medication Profile' as const, weight: meds, note: 'Current medicines and prototype interaction flags.' },
    { category: 'Stewardship Objective' as const, weight: steward, note: 'Minimize resistance pressure, burden and unnecessary spectrum.' },
    { category: 'Uncertainty' as const, weight: uncertain, note: 'Information-entropy term from completeness and pathway dispersion.' },
  ]
  const sum = raw.reduce((total, item) => total + item.weight, 0)
  return raw.map((item) => ({ ...item, weight: round((item.weight / sum) * 100, 1) }))
}

export function runHybridSimulation(profile: AssessmentData): SimulationResult {
  const susceptibility = simulateSusceptibility(profile)
  const entropy = analyzeEntropy(profile, susceptibility)
  const safety = evaluateSafetyGate(profile, entropy)
  const constraints = buildConstraints(profile)
  const candidates = buildCandidates(profile, entropy)
  const objective = objectiveFor(profile, entropy)
  const interactionFlags = prototypeInteractionReview(profile.medications, profile.renalFunction === 'requires-review')
  const seed = profileFingerprint([profile.patientId, profile.organism, JSON.stringify(profile.allergies)])

  return {
    runId: `SIM-${Math.floor(seed * 9000 + 1000)}`,
    completedAt: new Date().toISOString(),
    synthetic: true,
    simulatedOptimization: true,
    notClinicallyValidated: true,
    stages: STAGE_COPY,
    candidates,
    susceptibility,
    entropy,
    safety,
    constraints,
    objective,
    contributions: contributions(profile, entropy),
    interactionFlags,
    profileSnapshot: structuredClone(profile),
    decisionTrace: [
      { title: 'Patient profile', detail: `${profile.patientId} loaded with synthetic demographics, history and organ-function bands.` },
      { title: 'Feature extraction', detail: 'Classical features include BMI, exposure flags, allergy tokens, isolate descriptors and medication count.' },
      { title: 'Susceptibility inputs', detail: 'A simulated compatibility matrix is derived from organism, sample type and resistance markers. Not a laboratory AST.' },
      { title: 'Constraint generation', detail: `${constraints.filter((item) => !item.satisfied).length} constraint(s) remain open for clinician review.` },
      { title: 'Optimization simulation', detail: `Conceptual objective total ${objective.total} (resistance + safety + burden + uncertainty). Simulated only.` },
      { title: 'Classical validation', detail: safety.headline },
      { title: 'Candidate output', detail: `${candidates.map((item) => item.id).join(', ')} ranked as discussion options — never as a correct antibiotic.` },
      { title: 'Clinician review', detail: 'Q-ABX supports clinical reasoning; it does not replace clinician judgment.' },
    ],
  }
}

export function applyScenarioChange(profile: AssessmentData, factor: ScenarioFactor): AssessmentData {
  const next = structuredClone(profile)
  if (factor === 'previousAntibioticExposure') {
    next.previousAntibioticExposure = !next.previousAntibioticExposure
    next.previousAntibioticNotes = next.previousAntibioticExposure
      ? 'Synthetic toggle: prior antibiotic exposure added for comparison'
      : 'Synthetic toggle: prior antibiotic exposure removed for comparison'
  }
  if (factor === 'renalFunction') {
    next.renalFunction = next.renalFunction === 'requires-review' ? 'within-typical-range' : 'requires-review'
    next.egfr = next.renalFunction === 'requires-review' ? 48 : 92
  }
  if (factor === 'organism') {
    next.organism = /coli/i.test(next.organism) ? 'Staphylococcus aureus' : 'Escherichia coli'
    next.sampleType = /staph/i.test(next.organism) ? 'wound' : 'urine'
    next.resistanceMarkers = /staph/i.test(next.organism)
      ? 'mecA not detected — synthetic'
      : 'ESBL screen — synthetic flag'
  }
  if (factor === 'allergy') {
    next.allergies = next.allergies.length ? [] : ['penicillin class — reported rash']
  }
  return next
}

export function describeFactor(factor: ScenarioFactor) {
  switch (factor) {
    case 'previousAntibioticExposure':
      return 'Previous antibiotic exposure'
    case 'renalFunction':
      return 'Renal function band'
    case 'organism':
      return 'Organism / isolate context'
    case 'allergy':
      return 'Allergy list'
    default:
      return factor
  }
}

export { STAGE_COPY }
