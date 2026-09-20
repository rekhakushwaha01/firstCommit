import type { ReactNode } from 'react'
import { twMerge } from '@/components/ui/twMerge'

type FieldProps = {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}

export function Field({ label, htmlFor, hint, error, children, className }: FieldProps) {
  return (
    <label htmlFor={htmlFor} className={twMerge('block', className)}>
      <span className="text-[12px] font-semibold tracking-[0.12em] text-text-muted uppercase">{label}</span>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1.5 text-xs leading-5 text-text-muted">{hint}</p> : null}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-[#9a3b3b]" role="alert">
          {error}
        </p>
      ) : null}
    </label>
  )
}

export const inputClass =
  'w-full rounded-2xl border border-blue-dark/12 bg-surface px-4 py-3 text-sm text-blue-dark outline-none transition focus:border-blue'

export const selectClass = inputClass
