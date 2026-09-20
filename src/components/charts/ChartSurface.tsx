import type { ReactNode } from 'react'
import { Surface } from '@/components/ui/Surface'

export function ChartSurface({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <Surface className="p-6">
      <h2 className="text-sm font-semibold tracking-[0.14em] text-text-muted uppercase">{title}</h2>
      <p className="mt-1 text-xs tracking-[0.12em] text-text-muted uppercase">Illustrative / demo data</p>
      <div className="mt-5 h-64">{children}</div>
    </Surface>
  )
}
