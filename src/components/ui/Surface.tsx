import type { ReactNode } from 'react'
import { twMerge } from '@/components/ui/twMerge'

export function Surface({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={twMerge(
        'rounded-[1.6rem] border border-blue-dark/10 bg-surface-strong/90 shadow-[0_18px_50px_rgba(21,53,77,0.06)]',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-[12px] font-semibold tracking-[0.2em] text-blue uppercase">{children}</p>
  )
}

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={twMerge(
        'min-h-screen bg-[linear-gradient(180deg,#afc5d5_0%,#eaf2f6_48%,#f7fbfd_100%)] pt-28 pb-20',
        className,
      )}
    >
      {children}
    </div>
  )
}
