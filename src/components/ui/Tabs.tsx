import type { KeyboardEvent, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { SPRING, TAP } from '@/lib/motion'

interface TabItem<T extends string> {
  id: T
  label: ReactNode
}

interface TabsProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onChange: (id: T) => void
  /** layoutId của "viên thuốc" – phải khác nhau giữa các nhóm tab trên cùng trang. */
  layoutId: string
  ariaLabel: string
  tone?: 'navy' | 'gold' | 'ink'
  className?: string
  fullWidth?: boolean
}

const pillTone = {
  navy: 'bg-navy-900',
  gold: 'bg-gradient-to-b from-gold-400 to-gold-500',
  ink: 'bg-ink',
}
const activeText = {
  navy: 'text-white',
  gold: 'text-navy-950',
  ink: 'text-white',
}

/** Tab dạng viên thuốc, nền active "trượt" giữa các tab bằng layoutId + spring. */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  layoutId,
  ariaLabel,
  tone = 'navy',
  className,
  fullWidth,
}: TabsProps<T>) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const i = items.findIndex((t) => t.id === value)
    const next = items[(i + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length]
    onChange(next.id)
    // chuyển focus theo tab mới (không animate – thao tác bàn phím)
    const el = e.currentTarget.querySelector<HTMLElement>(`[data-tab="${next.id}"]`)
    el?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        'inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-navy-100 bg-white p-1 shadow-card scrollbar-none',
        fullWidth && 'flex w-full',
        className,
      )}
    >
      {items.map((t) => {
        const active = t.id === value
        return (
          <motion.button
            key={t.id}
            role="tab"
            type="button"
            data-tab={t.id}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            whileTap={TAP}
            transition={SPRING}
            className={cn(
              'relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-150 ease-out',
              fullWidth && 'flex-1',
              active ? activeText[tone] : 'text-navy-700 hover:text-navy-900',
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={SPRING}
                className={cn('absolute inset-0 rounded-full', pillTone[tone])}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
