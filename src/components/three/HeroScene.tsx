import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const HeroCanvas = lazy(() => import('./HeroCanvas'))

export function HeroScene() {
  const reduced = useReducedMotion()
  const hostRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const node = hostRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.12 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={hostRef} className="relative h-full min-h-[420px] w-full">
      <div className="absolute inset-3 overflow-hidden rounded-[2rem] border border-white/60 bg-[radial-gradient(circle_at_30%_20%,rgba(247,251,253,0.94),rgba(175,197,213,0.4)_58%,rgba(126,168,190,0.32))] shadow-[0_30px_80px_rgba(21,53,77,0.12)] sm:inset-4">
        <Suspense fallback={<SceneFallback />}>
          <HeroCanvas reduced={reduced} active={visible} compact={isMobile} />
        </Suspense>
        <p className="pointer-events-none absolute right-6 bottom-6 text-[10px] font-semibold tracking-[0.18em] text-text-muted uppercase">
          Simulated visualization
        </p>
      </div>
    </div>
  )
}

function SceneFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
      <div className="h-40 w-40 rounded-full border border-blue-light/40 bg-surface/50" />
    </div>
  )
}
