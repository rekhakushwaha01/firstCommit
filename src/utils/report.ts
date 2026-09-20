import type { SimulationResult } from '@/engine/optimization'

export function printReport(result: SimulationResult) {
  const target = document.getElementById('qabx-print-report')
  if (!target) return

  target.hidden = false
  target.innerHTML = renderReportHtml(result)
  window.print()
  target.hidden = true
}

function renderReportHtml(result: SimulationResult) {
  const p = result.profileSnapshot
  return `
    <article class="print-sheet">
      <header>
        <p class="wm">SYNTHETIC DEMONSTRATION — NOT FOR CLINICAL USE</p>
        <h1>Q-ABX demo report</h1>
        <p>${result.runId} · ${new Date(result.completedAt).toLocaleString()}</p>
        <p>Research prototype · Simulated optimization · Not clinically validated</p>
      </header>
      <section>
        <h2>Patient assessment summary</h2>
        <p>${p.patientId}, ${p.ageYears} years, ${p.sex}, ${p.weightKg} kg / ${p.heightCm} cm</p>
        <p>Allergies: ${p.allergies.join('; ') || 'None recorded'}</p>
        <p>Organism: ${p.organism} (${p.sampleType}, ${p.cultureResult})</p>
        <p>Medications: ${p.medications.map((item) => item.name).join(', ')}</p>
      </section>
      <section>
        <h2>Susceptibility simulation</h2>
        <ul>${result.susceptibility.map((row) => `<li>${row.candidate}: compatibility ${row.susceptibility}, confidence ${row.confidence}, uncertainty ${row.uncertainty}</li>`).join('')}</ul>
      </section>
      <section>
        <h2>Entropy / uncertainty</h2>
        <p>Score ${result.entropy.uncertaintyScore} · confidence ${result.entropy.informationConfidence} · completeness ${result.entropy.dataCompleteness}% · band ${result.entropy.band}</p>
        <p>Entropy is an information/uncertainty measure, not a clinical risk score.</p>
      </section>
      <section>
        <h2>Hybrid optimization trace</h2>
        <ol>${result.decisionTrace.map((item) => `<li><strong>${item.title}:</strong> ${item.detail}</li>`).join('')}</ol>
      </section>
      <section>
        <h2>Candidate strategies</h2>
        <ul>${result.candidates.map((item) => `<li>${item.label} — compatibility ${item.compatibility}; ${item.explanation} REQUIRES CLINICIAN REVIEW. DEMO/SIMULATED OUTPUT.</li>`).join('')}</ul>
      </section>
      <section>
        <h2>Safety checks</h2>
        <p>${result.safety.headline}</p>
        <ul>${result.safety.checks.map((item) => `<li>${item.label}: ${item.passed ? 'passed (prototype)' : 'review'} — ${item.detail}</li>`).join('')}</ul>
      </section>
      <section>
        <h2>Explainability</h2>
        <ul>${result.contributions.map((item) => `<li>${item.category}: ${item.weight}% — ${item.note}</li>`).join('')}</ul>
      </section>
      <footer>
        <p>Q-ABX supports clinical reasoning; it does not replace clinician judgment.</p>
      </footer>
    </article>
  `
}
