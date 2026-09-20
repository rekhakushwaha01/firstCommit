import { useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { inputClass } from '@/components/ui/Field'

type TagEditorProps = {
  values: string[]
  onChange: (values: string[]) => void
  placeholder: string
  label: string
}

export function TagEditor({ values, onChange, placeholder, label }: TagEditorProps) {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const next = draft.trim()
    if (!next) return
    if (!values.includes(next)) onChange([...values, next])
    setDraft('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      commit()
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {values.length === 0 ? (
          <span className="text-sm text-text-muted">None recorded</span>
        ) : (
          values.map((value) => (
            <button
              key={value}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-blue-dark/10 bg-bg-light px-3 py-1.5 text-xs text-blue-dark"
              onClick={() => onChange(values.filter((item) => item !== value))}
              aria-label={`Remove ${value}`}
            >
              {value}
              <X size={12} />
            </button>
          ))
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className={inputClass}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label={label}
        />
        <button
          type="button"
          onClick={commit}
          className="shrink-0 rounded-full border border-blue-dark/12 px-4 text-xs font-semibold tracking-[0.12em] text-blue-dark uppercase"
        >
          Add
        </button>
      </div>
    </div>
  )
}
