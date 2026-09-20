import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SAFETY_LINE } from '@/data/navigation'

export function SiteFooter() {
  return (
    <footer className="border-t border-blue-dark/8 bg-bg-light/70">
      <Container className="flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xl text-blue-dark">Q-ABX</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">{SAFETY_LINE}</p>
        </div>
        <p className="text-xs tracking-[0.12em] text-text-muted uppercase">
          Synthetic demonstration · Not for clinical use
        </p>
        <Link to="/research" className="text-sm text-blue underline-offset-4 hover:underline">
          Research notes
        </Link>
      </Container>
    </footer>
  )
}
