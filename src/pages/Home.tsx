import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusPills } from '@/components/ui/StatusPills'
import { Container } from '@/components/ui/Container'
import { HeroScene } from '@/components/three/HeroScene'
import { PageTransition } from '@/components/animations/PageTransition'
import { SAFETY_LINE } from '@/data/navigation'

export function Home() {
  return (
    <PageTransition>
      <section className="relative isolate min-h-screen overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(234,242,246,0.95),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(247,251,253,0.7),transparent_26%),linear-gradient(180deg,#afc5d5_0%,#eaf2f6_72%,#f7fbfd_100%)]"
          aria-hidden="true"
        />
        <Container className="relative grid min-h-screen items-center gap-10 pt-24 pb-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-6 lg:pt-20">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[12px] font-semibold tracking-[0.22em] text-blue uppercase"
            >
              Hybrid quantum × classical
              <br />
              Clinical intelligence
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-display mt-6 text-[clamp(3rem,8vw,6.4rem)] leading-[0.9] font-medium tracking-[-0.03em] text-blue-dark"
            >
              Personalized
              <br />
              antibiotic
              <br />
              stewardship
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-7 max-w-xl text-base leading-7 text-text-muted sm:text-lg"
            >
              A research framework combining patient-specific clinical factors,
              susceptibility analysis, uncertainty estimation and hybrid optimization
              to support antibiotic stewardship decisions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button to="/assessment">
                Start patient assessment
                <ArrowRight size={16} />
              </Button>
              <Button to="/problem" variant="ghost">
                Explore the framework
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.34 }}
              className="mt-8"
            >
              <StatusPills />
            </motion.div>
            <p className="mt-8 max-w-lg text-sm leading-6 text-text-muted">{SAFETY_LINE}</p>
          </div>
          <div className="h-[min(72vh,640px)] w-full lg:h-[min(78vh,720px)]">
            <HeroScene />
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
