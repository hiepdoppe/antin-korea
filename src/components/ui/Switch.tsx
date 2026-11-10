import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { SPRING } from '@/lib/motion'

interface SwitchProps {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  className?: string
}

export function Switch({ checked, onChange, label, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-out',
        checked ? 'bg-gold-500' : 'bg-navy-200',
        className,
      )}
    >
      <motion.span
        layout
        transition={SPRING}
        className="h-5 w-5 rounded-full bg-white shadow"
        style={{ marginLeft: checked ? 'auto' : 0 }}
      />
    </button>
  )
}
