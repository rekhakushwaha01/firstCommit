export const demoOrganisms = [
  {
    name: 'Escherichia coli',
    sampleType: 'urine',
    resistanceMarkers: ['ESBL screen — synthetic flag'],
    synthetic: true as const,
  },
  {
    name: 'Staphylococcus aureus',
    sampleType: 'wound',
    resistanceMarkers: ['mecA not detected — synthetic'],
    synthetic: true as const,
  },
]
