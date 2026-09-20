import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { Home } from '@/pages/Home'
import { Problem } from '@/pages/Problem'
import { Assessment } from '@/pages/Assessment'
import { HybridEngine } from '@/pages/HybridEngine'
import { Susceptibility } from '@/pages/Susceptibility'
import { Results } from '@/pages/Results'
import { Dashboard } from '@/pages/Dashboard'
import { Research } from '@/pages/Research'

export default function App() {
  const location = useLocation()

  return (
    <SiteLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/problem" element={<Problem />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/hybrid-engine" element={<HybridEngine />} />
          <Route path="/susceptibility" element={<Susceptibility />} />
          <Route path="/results" element={<Results />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/research" element={<Research />} />
        </Routes>
      </AnimatePresence>
    </SiteLayout>
  )
}
