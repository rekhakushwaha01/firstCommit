import type { SimulationStatus } from '@/types/simulation'
import { useQabx } from '@/state/QabxContext'

export function useSimulation(): SimulationStatus {
  const { engineStep, engineRunning } = useQabx()
  return { step: engineStep, running: engineRunning }
}
