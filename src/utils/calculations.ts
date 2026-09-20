export function bodyMassIndex(weightKg: number, heightCm: number) {
  if (heightCm <= 0) return 0
  const heightM = heightCm / 100
  return Number((weightKg / (heightM * heightM)).toFixed(1))
}
