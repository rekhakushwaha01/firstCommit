import { Link } from 'react-router-dom'
import { PageTransition } from '@/components/animations/PageTransition'
import { Container } from '@/components/ui/Container'
import { StatusPills } from '@/components/ui/StatusPills'
import { SAFETY_LINE } from '@/data/navigation'

type ComingSoonPageProps = {
  kicker: string
  title: string
  summary: string
}

export function ComingSoonPage({ kicker, title, summary }: ComingSoonPageProps) {
  return (
    <PageTransition>
      <section className="min-h-screen bg-[linear-gradient(180deg,#afc5d5_0%,#eaf2f6_55%,#f7fbfd_100%)] pt-28 pb-20">
        <Container className="max-w-3xl">
          <StatusPills />
          <p className="mt-8 text-[12px] font-semibold tracking-[0.2em] text-blue uppercase">{kicker}</p>
          <h1 className="font-display mt-4 text-4xl leading-tight text-blue-dark sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">{summary}</p>
          <p className="mt-8 text-sm text-text-muted">{SAFETY_LINE}</p>
          <Link
            to="/"
            className="mt-10 inline-flex text-sm font-semibold tracking-[0.08em] text-blue-dark uppercase underline-offset-4 hover:underline"
          >
            Return to overview
          </Link>
        </Container>
      </section>
    </PageTransition>
  )
}
