import type { ReactNode } from 'react'
import { Navbar } from '@/components/navigation/Navbar'
import { SiteFooter } from '@/components/layout/SiteFooter'

type SiteLayoutProps = {
  children: ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-main text-text">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-surface-strong focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">{children}</main>
      <SiteFooter />
      <div id="qabx-print-report" hidden />
    </div>
  )
}
