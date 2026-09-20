import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const QuantumCanvas = lazy(() => import('./QuantumCanvas'))

export function QuantumCircuit({ active }: { active: boolean }) {
  const reduced = useReducedMotion()
  const hostRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const update = () => setCompact(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const node = hostRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={hostRef} className="relative h-[320px] w-full sm:h-[380px]">
      <div className="absolute inset-0 overflow-hidden rounded-[1.6rem] border border-blue-dark/10 bg-[radial-gradient(circle_at_30%_20%,#f7fbfd,rgba(175,197,213,0.55))]">
        <Suspense fallback={<div className="h-full w-full bg-bg-light/40" />}>
          <QuantumCanvas reduced={reduced} active={visible && active} compact={compact} />
        </Suspense>
        <p className="pointer-events-none absolute right-5 bottom-4 text-[10px] font-semibold tracking-[0.16em] text-text-muted uppercase">
          Simulated optimization · not quantum hardware
        </p>
      </div>
    </div>
  )
}
