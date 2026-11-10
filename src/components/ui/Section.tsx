import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'

interface SectionProps {
  id: string
  eyebrow?: string
  title: string
  intro?: string
  tone?: 'ivory' | 'white' | 'navy'
  children: ReactNode
  className?: string
  /** Dùng thẻ <h1> cho tiêu đề (trang riêng chỉ có một h1) */
  h1?: boolean
}

const toneClass = {
  ivory: 'bg-ivory',
  white: 'bg-white',
  navy: 'bg-navy-900 text-white',
}

export function Section({ id, eyebrow, title, intro, tone = 'ivory', children, className, h1 }: SectionProps) {
  const dark = tone === 'navy'
  const Heading = h1 ? 'h1' : 'h2'
  return (
    <section id={id} className={cn('relative py-16 sm:py-24', toneClass[tone], className)}>
      <div className="container-x">
        <Reveal className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <Heading className={cn('display text-balance text-3xl sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]', dark && 'text-white')}>
            {title}
          </Heading>
          <span className="mx-auto mt-5 block h-1 w-14 rounded-full bg-gradient-to-r from-gold-300 to-gold-500" />
          {intro && <p className={cn('mt-5 text-pretty leading-relaxed', dark ? 'text-navy-100' : 'text-navy-700')}>{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}
