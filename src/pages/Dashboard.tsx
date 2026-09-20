import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageTransition } from '@/components/animations/PageTransition'
import { ChartSurface } from '@/components/charts/ChartSurface'
import { Container } from '@/components/ui/Container'
import { HumanInTheLoop } from '@/components/ui/HumanInTheLoop'
import { Kicker, PageShell, Surface } from '@/components/ui/Surface'
import { StatusPills } from '@/components/ui/StatusPills'
import { deriveDashboardMetrics } from '@/engine/dashboard'
import { useQabx } from '@/state/QabxContext'
import { Button } from '@/components/ui/Button'

export function Dashboard() {
  const { simulation } = useQabx()
  const metrics = deriveDashboardMetrics(simulation)

  return (
    <PageTransition>
      <PageShell>
        <Container>
          <StatusPills />
          <Kicker>Stewardship dashboard</Kicker>
          <h1 className="font-display mt-3 max-w-3xl text-4xl text-blue-dark sm:text-6xl">
            Illustrative operational metrics.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-muted">
            All figures are synthetic demonstration data. They do not report real-world clinical
            performance or proven stewardship benefit.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Patients analyzed" value={metrics.patientsAnalyzed} />
            <Metric label="Cases flagged" value={metrics.casesFlagged} />
            <Metric label="High uncertainty" value={metrics.highUncertainty} />
            <Metric label="Review required" value={metrics.reviewRequired} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ChartSurface title="Antibiotic utilization trends">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.utilization}>
                  <CartesianGrid stroke="rgba(21,53,77,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#607b8c' }} interval={0} angle={-18} height={60} />
                  <YAxis tick={{ fontSize: 11, fill: '#607b8c' }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#61C7D9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartSurface>
            <ChartSurface title="Susceptibility distribution">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.susceptibility}>
                  <CartesianGrid stroke="rgba(21,53,77,0.08)" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <YAxis tick={{ fontSize: 11, fill: '#607b8c' }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#47738F" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartSurface>
            <ChartSurface title="Uncertainty trend">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.uncertaintyTrend}>
                  <CartesianGrid stroke="rgba(21,53,77,0.08)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#607b8c' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#607b8c' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#15354D" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartSurface>
            <ChartSurface title="Stewardship interventions">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.interventions}>
                  <CartesianGrid stroke="rgba(21,53,77,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#607b8c' }} interval={0} angle={-20} height={70} />
                  <YAxis tick={{ fontSize: 11, fill: '#607b8c' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#C4EF3D" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartSurface>
            <ChartSurface title="Treatment-duration charts">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.duration}>
                  <CartesianGrid stroke="rgba(21,53,77,0.08)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#607b8c' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#607b8c' }} />
                  <Tooltip />
                  <Bar dataKey="cases" fill="#7EA8BE" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartSurface>
            <Surface className="p-6">
              <h2 className="text-sm font-semibold tracking-[0.14em] text-text-muted uppercase">Session coupling</h2>
              <p className="mt-3 text-sm leading-7 text-text-muted">
                {simulation
                  ? `The latest simulated run (${simulation.runId}) slightly shifts demo counters so the dashboard is not a static poster.`
                  : 'No live simulation is stored. Charts still render illustrative baseline values.'}
              </p>
              <Button className="mt-6" to="/results">
                View results
              </Button>
            </Surface>
          </div>
          <div className="mt-8">
            <HumanInTheLoop />
          </div>
        </Container>
      </PageShell>
    </PageTransition>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Surface className="p-5">
      <p className="text-[10px] font-semibold tracking-[0.14em] text-text-muted uppercase">{label}</p>
      <p className="font-display mt-2 text-4xl text-blue-dark">{value}</p>
      <p className="mt-2 text-[10px] tracking-[0.12em] text-text-muted uppercase">Illustrative / demo data</p>
    </Surface>
  )
}
