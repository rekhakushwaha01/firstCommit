import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { NAV_LINKS } from '@/data/navigation'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { twMerge } from '@/components/ui/twMerge'
import { useQabx } from '@/state/QabxContext'

export function Navbar() {
  const { scrolled } = useScrollProgress()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { validated } = useQabx()
  const simulateTo = validated ? '/hybrid-engine' : '/assessment'
  const overHero = location.pathname === '/' && !scrolled

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={twMerge(
        'fixed top-0 right-0 left-0 z-50 border-b transition-all duration-500',
        overHero && !open
          ? 'border-transparent bg-transparent'
          : 'border-blue-dark/10 bg-surface-strong/82 shadow-[0_8px_30px_rgba(21,53,77,0.06)] backdrop-blur-md',
      )}
    >
      <Container className="flex h-[72px] items-center justify-between gap-4 lg:h-[80px]">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Q-ABX home">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-dark">
            <span className="h-2 w-2 rounded-full bg-cyan" />
          </span>
          <span className="font-display text-[22px] leading-none tracking-tight text-blue-dark">
            Q-ABX
          </span>
        </Link>

        <nav className="hidden items-center gap-4 xl:gap-5 xl:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                twMerge(
                  'text-[13px] font-medium tracking-[0.04em] text-text-muted transition-colors hover:text-blue-dark',
                  isActive && 'text-blue-dark',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button to={simulateTo} className="px-4 py-2.5 text-[11px]">
              Run simulation
            </Button>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-blue-dark/10 bg-surface-strong/80 text-blue-dark xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[72px] z-40 bg-bg-light/96 backdrop-blur-xl xl:hidden"
          >
            <nav className="flex h-full flex-col gap-2 px-6 py-8" aria-label="Mobile">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * index }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      twMerge(
                        'block border-b border-blue-dark/8 py-4 font-display text-3xl text-blue-dark',
                        isActive && 'text-blue',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-8">
                <Button to={simulateTo} className="w-full">
                  Run simulation
                </Button>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
