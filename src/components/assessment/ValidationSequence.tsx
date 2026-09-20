import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export const VALIDATION_SEQUENCE = [
  'VALIDATING PATIENT PROFILE',
  'Demographics',
  'Medical History',
  'Medication Profile',
  'Clinical Factors',
  'Microbiology',
  'Susceptibility Inputs',
  'Constraints',
] as const

type ValidationSequenceProps = {
  open: boolean
  index: number
  complete: boolean
}

export function ValidationSequence({ open, index, complete }: ValidationSequenceProps) {
  const reduced = useReducedMotion()

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-[#15354d]/35 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="alertdialog"
          aria-label="Profile validation"
        >
          <motion.div
            initial={reduced ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-lg rounded-[1.8rem] border border-white/70 bg-surface-strong p-8 shadow-[0_30px_80px_rgba(21,53,77,0.18)]"
          >
            <p className="text-[12px] font-semibold tracking-[0.2em] text-blue uppercase">Check successfully</p>
            <h2 className="font-display mt-2 text-3xl text-blue-dark">
              {complete ? 'Profile validated' : 'Validating synthetic intake'}
            </h2>
            <ul className="mt-6 space-y-2">
              {VALIDATION_SEQUENCE.map((label, itemIndex) => {
                const done = complete || itemIndex < index
                const current = !complete && itemIndex === index
                return (
                  <li
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-blue-dark/8 bg-bg-light/70 px-4 py-2.5 text-sm text-blue-dark"
                  >
                    <span>{label}</span>
                    <span className="text-xs font-semibold tracking-[0.14em] uppercase">
                      {done ? (
                        <span className="inline-flex items-center gap-1">
                          <Check size={14} />
                          {itemIndex === 0 && !complete ? '' : '✓'}
                        </span>
                      ) : current ? (
                        '…'
                      ) : (
                        ''
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
            {complete ? (
              <div className="mt-6 grid gap-2 text-[12px] font-semibold tracking-[0.14em] text-blue uppercase">
                <p>Profile validated</p>
                <p>Inputs complete</p>
                <p>Data consistent</p>
                <p>Analysis ready</p>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
