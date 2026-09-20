import { PageTransition } from '@/components/animations/PageTransition'
import { Container } from '@/components/ui/Container'
import { HumanInTheLoop } from '@/components/ui/HumanInTheLoop'
import { Kicker, PageShell, Surface } from '@/components/ui/Surface'
import { StatusPills } from '@/components/ui/StatusPills'

const SECTIONS = [
  {
    title: 'Research question',
    copy: 'Can a hybrid classical–simulated-quantum decision-support loop make stewardship constraints, uncertainty and candidate strategies inspectable for clinicians — without issuing a prescription?',
  },
  {
    title: 'Clinical problem',
    copy: 'Empiric antimicrobial choices sit at the intersection of incomplete microbiology, organ function, allergy, prior exposure and ecological cost. Static guidelines do not encode that joint constraint set.',
  },
  {
    title: 'Proposed framework',
    copy: 'Q-ABX stages a patient assessment, a simulated susceptibility lab, an information-entropy uncertainty module, a hybrid optimization visualization and an explainable candidate list that always terminates in clinician review.',
  },
  {
    title: 'Classical layer',
    copy: 'Feature extraction, constraint compilation, safety gates, interaction flags and classical re-ranking. These are transparent, inspectable functions on synthetic inputs.',
  },
  {
    title: 'Quantum layer',
    copy: 'A circuit-like visualization stands in for combinatorial search over stewardship pathways. It is simulated optimization. No QPU is attached and no quantum advantage is claimed.',
  },
  {
    title: 'Hybrid optimization',
    copy: 'Conceptual objective: minimize resistance pressure + safety penalty + treatment burden + uncertainty, subject to allergy, renal, interaction and stewardship constraints. Research visualization only.',
  },
  {
    title: 'Evaluation methodology',
    copy: 'This prototype is evaluated as an interactive demonstration: completeness of intake, consistency of session state, responsiveness of simulated matrices, and clarity of disclaimers. It is not a clinical trial endpoint.',
  },
  {
    title: 'Limitations',
    copy: 'Synthetic patients; demo interaction rules; no laboratory AST; no pharmacokinetic engine; no outcome data; no hardware benchmarks. Outputs must not be used for care.',
  },
  {
    title: 'Future work',
    copy: 'Validated knowledge bases, prospective silent-mode evaluation, calibration of uncertainty estimates, and — only if independently benchmarked — any claim about quantum hardware.',
  },
  {
    title: 'References',
    copy: 'Antimicrobial stewardship literature, information-theoretic uncertainty measures, and hybrid quantum-classical optimization surveys inform the framing. Citations are conceptual in this demonstration build.',
  },
]

export function Research() {
  return (
    <PageTransition>
      <PageShell>
        <Container>
          <StatusPills />
          <Kicker>Research</Kicker>
          <h1 className="font-display mt-3 max-w-3xl text-4xl text-blue-dark sm:text-6xl">
            A prototype, not a validated product.
          </h1>
          <Surface className="mt-8 p-6 sm:p-8">
            <p className="text-[12px] font-semibold tracking-[0.18em] text-blue uppercase">Status panel</p>
            <ul className="mt-4 grid gap-2 text-sm text-blue-dark sm:grid-cols-2">
              <li>Research prototype</li>
              <li>Synthetic data</li>
              <li>Simulated optimization</li>
              <li>Not clinically validated</li>
            </ul>
            <p className="mt-4 text-sm text-text-muted">
              Q-ABX does not claim proven clinical benefit or quantum advantage.
            </p>
          </Surface>
          <div className="mt-8 grid gap-4">
            {SECTIONS.map((section) => (
              <Surface key={section.title} className="p-6">
                <h2 className="font-display text-2xl text-blue-dark">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-text-muted">{section.copy}</p>
              </Surface>
            ))}
          </div>
          <div className="mt-8">
            <HumanInTheLoop />
          </div>
        </Container>
      </PageShell>
    </PageTransition>
  )
}
