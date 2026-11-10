import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { ASSETS } from '@/constants/assets'
import { ROUTES } from '@/constants/routes'
import { useLocalePath } from '@/hooks/useLang'
import { EASE_OUT } from '@/lib/motion'
import { useContent } from '@/hooks/useContent'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { Tabs } from '../ui/Tabs'

const slide: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 24 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -24 }),
}

export function Programs({ h1 }: { h1?: boolean }) {
  const { sections, programs, ui } = useContent()
  const navigate = useNavigate()
  const lp = useLocalePath()
  const items = programs.items
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')
  const [dir, setDir] = useState(1)

  if (items.length === 0) return null
  const idx = Math.max(0, items.findIndex((i) => i.id === activeId))
  const active = items[idx]

  const change = (id: string) => {
    const next = items.findIndex((i) => i.id === id)
    setDir(next >= idx ? 1 : -1)
    setActiveId(id)
  }

  const register = () => {
    navigate(`${lp(ROUTES.contact)}?program=${encodeURIComponent(active.id)}`)
  }

  return (
    <Section id="programs" h1={h1} eyebrow={ui.programs.eyebrow} title={sections.programs} intro={programs.intro} tone="white">
      <Reveal className="flex justify-center">
        <Tabs
          ariaLabel={ui.programs.tabsLabel}
          layoutId="program-pill"
          value={active.id}
          onChange={change}
          items={items.map((p) => ({ id: p.id, label: p.title }))}
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        <div className="relative grid items-stretch gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative min-h-[18rem]">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={active.id}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: EASE_OUT }}
                role="tabpanel"
                className="flex h-full flex-col justify-between rounded-3xl border border-navy-100 bg-gradient-to-br from-white to-gold-50 p-7 shadow-card sm:p-9"
              >
                <div>
                  <span className="inline-flex items-center rounded-full bg-navy-900 px-3.5 py-1.5 text-xs font-bold tracking-wide text-gold-300">
                    {active.badge}
                  </span>
                  <h3 className="mt-5 font-display text-2xl text-navy-900 text-balance sm:text-3xl">{active.title}</h3>
                  <p className="mt-4 text-pretty text-base leading-[1.75] text-navy-700">{active.description}</p>
                </div>
                <div className="mt-8">
                  <Button onClick={register}>{ui.programs.registerThis}</Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <figure className="overflow-hidden rounded-3xl border border-white bg-navy-900 shadow-lift">
            <img
              src={ASSETS.marketing.poster}
              alt={ui.programs.posterAlt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </figure>
        </div>
      </Reveal>
    </Section>
  )
}
