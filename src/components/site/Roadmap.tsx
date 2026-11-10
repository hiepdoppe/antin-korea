import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { EASE_OUT, SPRING, TAP } from '@/lib/motion'
import { useContent } from '@/hooks/useContent'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

const CIRCLE = 48 // px – khớp với h-12 w-12

export function Roadmap({ h1 }: { h1?: boolean }) {
  const { sections, roadmap, ui } = useContent()
  const steps = roadmap.steps
  const [active, setActive] = useState(0)
  if (steps.length === 0) return null
  const current = steps[Math.min(active, steps.length - 1)]
  const progress = steps.length > 1 ? active / (steps.length - 1) : 0

  return (
    <Section id="roadmap" h1={h1} eyebrow={ui.roadmap.eyebrow} title={sections.roadmap} tone="navy">
      <div className="grid items-start gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        {/* Dòng thời gian: toàn bộ 6 bước luôn hiển thị đủ tiêu đề + mô tả */}
        <Reveal>
          <ol className="relative">
            {/* đường nền + đường tiến độ (transform, không animate height) */}
            <span
              aria-hidden
              className="absolute w-px bg-white/15"
              style={{ left: CIRCLE / 2, top: CIRCLE / 2, bottom: CIRCLE / 2 }}
            />
            <motion.span
              aria-hidden
              className="absolute w-px origin-top bg-gradient-to-b from-gold-300 to-gold-500"
              style={{ left: CIRCLE / 2, top: CIRCLE / 2, bottom: CIRCLE / 2 }}
              initial={false}
              animate={{ scaleY: progress }}
              transition={SPRING}
            />
            {steps.map((s, i) => {
              const isActive = i === active
              const reached = i <= active
              return (
                <li key={`${s.no}-${i}`} className="relative">
                  <motion.button
                    type="button"
                    onClick={() => setActive(i)}
                    whileTap={TAP}
                    transition={SPRING}
                    aria-current={isActive ? 'step' : undefined}
                    className="relative flex w-full items-start gap-4 rounded-2xl px-0 py-3 text-left sm:gap-5"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="roadmap-row"
                        transition={SPRING}
                        className="absolute inset-y-0 -inset-x-2 rounded-2xl bg-white/[0.07] ring-1 ring-white/10"
                      />
                    )}
                    <span
                      className={cn(
                        'relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 font-display text-base transition-colors duration-200 ease-out',
                        reached
                          ? 'border-gold-400 bg-gold-400 text-navy-950'
                          : 'border-white/20 bg-navy-900 text-white/70',
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="roadmap-ring"
                          transition={SPRING}
                          className="absolute -inset-1.5 rounded-full ring-2 ring-gold-300"
                        />
                      )}
                      {s.no}
                    </span>
                    <span className="relative z-10 min-w-0 pt-0.5">
                      <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">{ui.roadmap.step} {s.no}</span>
                      <span className="mt-0.5 block font-display text-lg text-white sm:text-xl">{s.title}</span>
                      <span className="mt-1 block text-pretty text-sm leading-relaxed text-navy-100">{s.description}</span>
                    </span>
                  </motion.button>
                </li>
              )
            })}
          </ol>
        </Reveal>

        {/* Thẻ tập trung vào bước đang chọn */}
        <Reveal delay={0.05} className="hidden lg:sticky lg:top-28 lg:block">
          <div className="relative min-h-[22rem] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-950 p-8 shadow-lift">
            <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.no}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="relative"
              >
                <span className="block font-display text-[7rem] leading-none text-gold-400/90">{current.no}</span>
                <h3 className="mt-2 font-display text-3xl text-white text-balance">{current.title}</h3>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-navy-100">{current.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
