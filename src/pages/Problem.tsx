import { PageTransition } from '@/components/animations/PageTransition'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { HumanInTheLoop } from '@/components/ui/HumanInTheLoop'
import { Kicker, PageShell, Surface } from '@/components/ui/Surface'
import { StatusPills } from '@/components/ui/StatusPills'

const POINTS = [
  {
    title: 'Heterogeneous patients',
    copy: 'Age, organ function, pregnancy, immunosuppression and allergy histories change which stewardship options are even discussable.',
  },
  {
    title: 'Incomplete microbiology',
    copy: 'Cultures lag treatment decisions. A research prototype must represent pending, contaminated and resistant synthetic isolates without pretending they are AST reports.',
  },
  {
    title: 'Medication context',
    copy: 'Polypharmacy and organ impairment create constraints. This site uses a prototype interaction review, not a licensed database.',
  },
  {
    title: 'Stewardship pressure',
    copy: 'Unnecessary spectrum and duration increase resistance pressure. The hybrid loop visualizes those costs as an objective, not as an order set.',
  },
]

export function Problem() {
  return (
    <PageTransition>
      <PageShell>
        <Container>
          <StatusPills />
          <Kicker>Clinical problem</Kicker>
          <h1 className="font-display mt-3 max-w-3xl text-4xl leading-tight text-blue-dark sm:text-6xl">
            Antibiotics aren’t one-size-fits-all.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
            Personalized stewardship is a constraint problem: match an evolving infection context to
            safety, ecology and uncertainty — then leave the decision with a clinician. Q-ABX is a
            hybrid quantum-classical research sketch of that loop, using synthetic data only.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {POINTS.map((point) => (
              <Surface key={point.title} className="p-6">
                <h2 className="font-display text-2xl text-blue-dark">{point.title}</h2>
                <p className="mt-3 text-sm leading-7 text-text-muted">{point.copy}</p>
              </Surface>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/assessment">Start patient assessment</Button>
            <Button to="/research" variant="ghost">
              Read the research notes
            </Button>
          </div>
          <div className="mt-8">
            <HumanInTheLoop />
          </div>
        </Container>
      </PageShell>
    </PageTransition>
  )
}
