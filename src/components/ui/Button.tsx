import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { useLocalePath } from '@/hooks/useLang'
import { cn } from '@/lib/cn'
import { SPRING, TAP } from '@/lib/motion'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,box-shadow,border-color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-gold-400 to-gold-500 text-navy-950 shadow-[0_1px_0_rgba(255,255,255,.5)_inset,0_8px_20px_-10px_rgba(168,123,29,.9)] hover:from-gold-300 hover:to-gold-400',
  secondary: 'bg-navy-900 text-white hover:bg-navy-800',
  outline: 'border border-navy-200 bg-white text-navy-800 hover:border-navy-400 hover:bg-navy-50',
  ghost: 'text-navy-700 hover:bg-navy-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
}

type Common = { variant?: Variant; size?: Size; className?: string; children?: ReactNode }

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: Common & Omit<HTMLMotionProps<'button'>, 'children' | 'className'>) {
  return (
    <motion.button
      type="button"
      whileTap={TAP}
      transition={SPRING}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

/**
 * Liên kết dạng nút. Đường dẫn nội bộ (bắt đầu bằng "/") đi qua React Router và tự gắn tiền tố ngôn ngữ (/ko);
 * liên kết ngoài / mailto / tel dùng thẻ <a> thường.
 */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  onClick,
  ...rest
}: Common & Omit<HTMLMotionProps<'a'>, 'children' | 'className'>) {
  const lp = useLocalePath()
  const cls = cn(base, variants[variant], sizes[size], className)
  if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('/admin')) {
    return (
      <Link
        to={lp(href)}
        onClick={onClick}
        className={cn(cls, 'active:scale-[0.98] [transition-property:transform,background-color,color,box-shadow,border-color]')}
      >
        {children}
      </Link>
    )
  }
  return (
    <motion.a whileTap={TAP} transition={SPRING} className={cls} href={href} onClick={onClick} {...rest}>
      {children}
    </motion.a>
  )
}
