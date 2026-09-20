import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Surface } from '@/components/ui/Surface'
import { useQabx } from '@/state/QabxContext'
import type { ReactNode } from 'react'

export function NeedProfile({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const { validated, assessment } = useQabx()
  if (validated && assessment) return children

  return (
    <Surface className="p-8">
      <p className="text-[12px] font-semibold tracking-[0.18em] text-blue uppercase">Session incomplete</p>
      <h2 className="font-display mt-3 text-3xl text-blue-dark">{title}</h2>
      <p className="mt-4 max-w-xl text-text-muted">
        Load and validate a synthetic patient in Assessment first. Downstream modules read that shared
        session state — they do not invent a clinical case.
      </p>
      <div className="mt-6">
        <Button to="/assessment">Start patient assessment</Button>
      </div>
      <Link to="/" className="mt-4 inline-block text-sm text-blue underline-offset-4 hover:underline">
        Return home
      </Link>
    </Surface>
  )
}
