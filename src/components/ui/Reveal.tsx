import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { reveal } from '@/lib/motion'

/** Hiện dần khi cuộn tới – một lần cho mỗi khối (không stagger lồng nhau). */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 12,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div className={className} {...reveal(delay, y)}>
      {children}
    </motion.div>
  )
}
