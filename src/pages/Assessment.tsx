import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useFieldArray, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { PageTransition } from '@/components/animations/PageTransition'
import { TagEditor } from '@/components/assessment/TagEditor'
import { ValidationSequence, VALIDATION_SEQUENCE } from '@/components/assessment/ValidationSequence'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Field, inputClass, selectClass } from '@/components/ui/Field'
import { HumanInTheLoop } from '@/components/ui/HumanInTheLoop'
import { Kicker, PageShell, Surface } from '@/components/ui/Surface'
import { StatusPills } from '@/components/ui/StatusPills'
import { demoAssessment, emptyAssessment } from '@/data/demoPatients'
import { INTERACTION_REVIEW_LABEL } from '@/features/medications/labels'
import { PATIENT_WIZARD_STEPS } from '@/features/patient/steps'
import { SAMPLE_TYPES } from '@/features/microbiology/sampleTypes'
import { prototypeInteractionReview } from '@/engine/medications'
import { assessmentSchema, STEP_FIELDS, type AssessmentFormValues } from '@/schemas/assessment'
import { useQabx } from '@/state/QabxContext'
import { bodyMassIndex } from '@/utils/calculations'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const sampleValues = ['urine', 'blood', 'respiratory', 'wound', 'other'] as const

export function Assessment() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const { assessment, saveAssessment, markValidated } = useQabx()
  const [step, setStep] = useState(0)
  const [validating, setValidating] = useState(false)
  const [sequenceIndex, setSequenceIndex] = useState(0)
  const [sequenceComplete, setSequenceComplete] = useState(false)

  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema) as Resolver<AssessmentFormValues>,
    defaultValues: assessment ?? emptyAssessment(),
    mode: 'onTouched',
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'medications' })
  const values = form.watch()
  const bmi = useMemo(() => bodyMassIndex(Number(values.weightKg) || 0, Number(values.heightCm) || 0), [values.heightCm, values.weightKg])
  const interactions = prototypeInteractionReview(values.medications ?? [], values.renalFunction === 'requires-review')
  const current = PATIENT_WIZARD_STEPS[step]

  const goNext = async () => {
    const names = STEP_FIELDS[current.id]
    const valid = names.length ? await form.trigger(names) : true
    if (!valid) return
    setStep((value) => Math.min(value + 1, PATIENT_WIZARD_STEPS.length - 1))
  }

  const loadDemo = () => {
    form.reset(demoAssessment)
    saveAssessment(demoAssessment)
  }

  const checkSuccessfully = async () => {
    const valid = await form.trigger()
    if (!valid) {
      setStep(0)
      return
    }
    const data = assessmentSchema.parse(form.getValues())
    saveAssessment(data)
    setValidating(true)
    setSequenceComplete(false)
    setSequenceIndex(0)

    for (let index = 0; index < VALIDATION_SEQUENCE.length; index += 1) {
      setSequenceIndex(index)
      await wait(reduced ? 40 : 280)
    }
    setSequenceComplete(true)
    markValidated()
    await wait(reduced ? 200 : 900)
    setValidating(false)
  }

  return (
    <PageTransition>
      <PageShell>
        <ValidationSequence open={validating} index={sequenceIndex} complete={sequenceComplete} />
        <Container>
          <StatusPills />
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.2fr]">
            <div>
              <Kicker>Patient assessment</Kicker>
              <h1 className="font-display mt-3 text-4xl leading-tight text-blue-dark sm:text-6xl">
                Guided synthetic intake.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-text-muted">
                Six-step research wizard. Fields store session state only. Nothing here is a medical
                prescription or a validated recommendation.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={loadDemo}>Load demo patient</Button>
                <Button variant="ghost" onClick={() => form.reset(emptyAssessment())}>
                  Clear form
                </Button>
              </div>
              <div className="mt-8">
                <HumanInTheLoop />
              </div>
            </div>

            <Surface className="p-5 sm:p-8">
              <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PATIENT_WIZARD_STEPS.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setStep(index)}
                      className={`w-full rounded-2xl border px-3 py-3 text-left ${
                        index === step
                          ? 'border-blue/40 bg-bg-light'
                          : 'border-blue-dark/8 bg-surface'
                      }`}
                    >
                      <span className="text-[10px] font-semibold tracking-[0.16em] text-text-muted uppercase">
                        {item.number}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-blue-dark">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ol>

              <form className="mt-8" onSubmit={(event) => event.preventDefault()}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={reduced ? false : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduced ? undefined : { opacity: 0, x: -12 }}
                    transition={{ duration: 0.28 }}
                    className="grid gap-5"
                  >
                    {current.id === 'demographics' ? (
                      <>
                        <Field label="Patient ID" htmlFor="patientId" error={form.formState.errors.patientId?.message}>
                          <input id="patientId" className={inputClass} {...form.register('patientId')} />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <Field label="Age (years)" htmlFor="ageYears" error={form.formState.errors.ageYears?.message}>
                            <input id="ageYears" type="number" className={inputClass} {...form.register('ageYears')} />
                          </Field>
                          <Field label="Sex" htmlFor="sex">
                            <select id="sex" className={selectClass} {...form.register('sex')}>
                              <option value="female">Female</option>
                              <option value="male">Male</option>
                              <option value="other">Other</option>
                              <option value="unspecified">Unspecified</option>
                            </select>
                          </Field>
                          <Field label="Pregnancy status" htmlFor="pregnancyStatus">
                            <select id="pregnancyStatus" className={selectClass} {...form.register('pregnancyStatus')}>
                              <option value="not-applicable">Not applicable</option>
                              <option value="not-pregnant">Not pregnant</option>
                              <option value="pregnant">Pregnant</option>
                              <option value="unknown">Unknown</option>
                            </select>
                          </Field>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <Field label="Weight (kg)" htmlFor="weightKg" error={form.formState.errors.weightKg?.message}>
                            <input id="weightKg" type="number" className={inputClass} {...form.register('weightKg')} />
                          </Field>
                          <Field label="Height (cm)" htmlFor="heightCm" error={form.formState.errors.heightCm?.message}>
                            <input id="heightCm" type="number" className={inputClass} {...form.register('heightCm')} />
                          </Field>
                          <Field label="BMI (calculated)" htmlFor="bmi" hint="Derived from weight and height.">
                            <input id="bmi" className={inputClass} value={bmi || '—'} readOnly />
                          </Field>
                        </div>
                      </>
                    ) : null}

                    {current.id === 'history' ? (
                      <>
                        <Controller
                          control={form.control}
                          name="comorbidities"
                          render={({ field }) => (
                            <Field label="Comorbidities" htmlFor="comorbidities">
                              <TagEditor
                                label="Comorbidities"
                                values={field.value}
                                onChange={field.onChange}
                                placeholder="Add comorbidity and press Enter"
                              />
                            </Field>
                          )}
                        />
                        <Controller
                          control={form.control}
                          name="allergies"
                          render={({ field }) => (
                            <Field label="Allergies" htmlFor="allergies">
                              <TagEditor
                                label="Allergies"
                                values={field.value}
                                onChange={field.onChange}
                                placeholder="Add allergy and press Enter"
                              />
                            </Field>
                          )}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Renal function" htmlFor="renalFunction">
                            <select id="renalFunction" className={selectClass} {...form.register('renalFunction')}>
                              <option value="not-recorded">Not recorded</option>
                              <option value="within-typical-range">Within typical range</option>
                              <option value="requires-review">Requires review</option>
                            </select>
                          </Field>
                          <Field label="Hepatic function" htmlFor="hepaticFunction">
                            <select id="hepaticFunction" className={selectClass} {...form.register('hepaticFunction')}>
                              <option value="not-recorded">Not recorded</option>
                              <option value="within-typical-range">Within typical range</option>
                              <option value="requires-review">Requires review</option>
                            </select>
                          </Field>
                        </div>
                        <Field label="Previous infection" htmlFor="previousInfection">
                          <input id="previousInfection" className={inputClass} {...form.register('previousInfection')} />
                        </Field>
                        <label className="flex items-center gap-3 text-sm text-blue-dark">
                          <input type="checkbox" {...form.register('recentHospitalization')} />
                          Recent hospitalization
                        </label>
                        <label className="flex items-center gap-3 text-sm text-blue-dark">
                          <input type="checkbox" {...form.register('recentProcedure')} />
                          Recent procedure
                        </label>
                        <label className="flex items-center gap-3 text-sm text-blue-dark">
                          <input type="checkbox" {...form.register('previousAntibioticExposure')} />
                          Previous antibiotic exposure
                        </label>
                        <Field label="Exposure notes" htmlFor="previousAntibioticNotes">
                          <input id="previousAntibioticNotes" className={inputClass} {...form.register('previousAntibioticNotes')} />
                        </Field>
                        <label className="flex items-center gap-3 text-sm text-blue-dark">
                          <input type="checkbox" {...form.register('immunocompromised')} />
                          Immunocompromised status
                        </label>
                      </>
                    ) : null}

                    {current.id === 'medications' ? (
                      <>
                        <p className="text-sm text-text-muted">{INTERACTION_REVIEW_LABEL}</p>
                        {fields.map((item, index) => (
                          <div key={item.id} className="grid gap-3 rounded-2xl border border-blue-dark/8 p-4 sm:grid-cols-2">
                            <Field label="Medication name" htmlFor={`med-name-${index}`} error={form.formState.errors.medications?.[index]?.name?.message}>
                              <input id={`med-name-${index}`} className={inputClass} {...form.register(`medications.${index}.name`)} />
                            </Field>
                            <Field label="Dose" htmlFor={`med-dose-${index}`} error={form.formState.errors.medications?.[index]?.dose?.message}>
                              <input id={`med-dose-${index}`} className={inputClass} {...form.register(`medications.${index}.dose`)} />
                            </Field>
                            <Field label="Frequency" htmlFor={`med-freq-${index}`}>
                              <input id={`med-freq-${index}`} className={inputClass} {...form.register(`medications.${index}.frequency`)} />
                            </Field>
                            <Field label="Duration" htmlFor={`med-dur-${index}`}>
                              <input id={`med-dur-${index}`} className={inputClass} {...form.register(`medications.${index}.duration`)} />
                            </Field>
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-text-muted uppercase"
                              onClick={() => remove(index)}
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => append({ name: '', dose: '', frequency: '', duration: '' })}
                        >
                          <Plus size={16} /> Add medication
                        </Button>
                        <div className="rounded-2xl bg-bg-light/80 p-4">
                          <p className="text-[11px] font-semibold tracking-[0.16em] text-blue uppercase">
                            Prototype interaction review
                          </p>
                          <ul className="mt-3 space-y-2">
                            {interactions.map((flag) => (
                              <li key={flag.title} className="text-sm text-text-muted">
                                <strong className="text-blue-dark">{flag.title}.</strong> {flag.detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : null}

                    {current.id === 'clinical' ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Creatinine" htmlFor="creatinine">
                          <input id="creatinine" className={inputClass} {...form.register('creatinine')} />
                        </Field>
                        <Field label="eGFR" htmlFor="egfr">
                          <input id="egfr" className={inputClass} {...form.register('egfr')} />
                        </Field>
                        <Field label="AST" htmlFor="ast">
                          <input id="ast" className={inputClass} {...form.register('ast')} />
                        </Field>
                        <Field label="ALT" htmlFor="alt">
                          <input id="alt" className={inputClass} {...form.register('alt')} />
                        </Field>
                        <Field label="Bilirubin" htmlFor="bilirubin">
                          <input id="bilirubin" className={inputClass} {...form.register('bilirubin')} />
                        </Field>
                        <Field label="Albumin" htmlFor="albumin">
                          <input id="albumin" className={inputClass} {...form.register('albumin')} />
                        </Field>
                        <Field label="Other enzyme / clinical markers" htmlFor="otherMarkers" className="sm:col-span-2">
                          <textarea id="otherMarkers" className={`${inputClass} min-h-24`} {...form.register('otherMarkers')} />
                        </Field>
                      </div>
                    ) : null}

                    {current.id === 'microbiology' ? (
                      <>
                        <Field label="Sample type" htmlFor="sampleType">
                          <select id="sampleType" className={selectClass} {...form.register('sampleType')}>
                            {SAMPLE_TYPES.map((label, index) => (
                              <option key={label} value={sampleValues[index]}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Organism" htmlFor="organism" error={form.formState.errors.organism?.message}>
                          <input id="organism" className={inputClass} {...form.register('organism')} />
                        </Field>
                        <Field label="Culture result" htmlFor="cultureResult">
                          <select id="cultureResult" className={selectClass} {...form.register('cultureResult')}>
                            <option value="pending">Pending</option>
                            <option value="growth">Growth</option>
                            <option value="no-growth">No growth</option>
                            <option value="contaminated">Contaminated</option>
                          </select>
                        </Field>
                        <Field label="Resistance markers" htmlFor="resistanceMarkers">
                          <input id="resistanceMarkers" className={inputClass} {...form.register('resistanceMarkers')} />
                        </Field>
                        <Field label="Susceptibility-related inputs" htmlFor="susceptibilityNotes">
                          <textarea id="susceptibilityNotes" className={`${inputClass} min-h-24`} {...form.register('susceptibilityNotes')} />
                        </Field>
                      </>
                    ) : null}

                    {current.id === 'review' ? (
                      <div className="space-y-4 text-sm leading-7 text-text-muted">
                        <ReviewRow label="Patient" value={`${values.patientId} · ${values.ageYears}y · ${values.sex}`} />
                        <ReviewRow label="Body" value={`${values.weightKg} kg / ${values.heightCm} cm · BMI ${bmi || '—'}`} />
                        <ReviewRow label="Allergies" value={values.allergies?.join('; ') || 'None recorded'} />
                        <ReviewRow label="Renal / hepatic" value={`${values.renalFunction} / ${values.hepaticFunction}`} />
                        <ReviewRow label="Medications" value={values.medications?.map((item) => item.name).join(', ') || 'None'} />
                        <ReviewRow label="Microbiology" value={`${values.organism} · ${values.sampleType} · ${values.cultureResult}`} />
                        <p className="rounded-2xl bg-bg-light px-4 py-3">
                          Demo / prototype only. Checking the profile validates completeness and consistency of
                          synthetic inputs — it does not generate a treatment.
                        </p>
                        <Button className="w-full py-4 text-sm" onClick={checkSuccessfully}>
                          <CheckCircle2 size={18} /> Check successfully
                        </Button>
                      </div>
                    ) : null}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between gap-3">
                  <Button variant="ghost" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>
                    <ArrowLeft size={16} /> Back
                  </Button>
                  {step < PATIENT_WIZARD_STEPS.length - 1 ? (
                    <Button onClick={goNext}>
                      Continue <ArrowRight size={16} />
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => navigate('/susceptibility')}>
                      Open susceptibility lab
                    </Button>
                  )}
                </div>
              </form>
            </Surface>
          </div>
        </Container>
      </PageShell>
    </PageTransition>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-semibold text-blue-dark">{label}: </span>
      {value}
    </p>
  )
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
