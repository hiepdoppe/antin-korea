import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useDragControls, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import { EASE_OUT, SPRING } from '@/lib/motion'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

const MAX_W = 480

/**
 * Slide-over từ bên phải (kiểu Vaul/Radix).
 * - Vào bằng spring, ra bằng tween ngắn hơn.
 * - Kéo tay cầm tiêu đề sang phải để đóng: bám ngón tay 1:1, đóng khi vượt 40% HOẶC đủ nhanh.
 * - Độ mờ của lớp nền suy ra từ vị trí kéo (một nguồn sự thật) nên luôn khớp khi bị ngắt giữa chừng.
 * - Esc để đóng, giữ focus trong drawer, trả focus về nút đã mở.
 */
export function Drawer({ open, onClose, title, subtitle, children, footer }: DrawerProps) {
  const [w, setW] = useState(() => (typeof window === 'undefined' ? MAX_W : Math.min(MAX_W, window.innerWidth)))
  const x = useMotionValue(w)
  const overlayOpacity = useTransform(x, (v) => 1 - Math.min(Math.max(v / w, 0), 1))
  const controls = useDragControls()
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    setW(Math.min(MAX_W, window.innerWidth))
    lastFocus.current = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>('[data-autofocus], input, select, textarea')?.focus()
    })
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = prevOverflow
      lastFocus.current?.focus?.()
    }
  }, [open])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab') return
    const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
    )
    if (!nodes || nodes.length === 0) return
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > w * 0.4 || info.velocity.x > 500) onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="drawer" className="fixed inset-0 z-50" onKeyDown={onKeyDown}>
          <motion.div
            aria-hidden
            style={{ opacity: overlayOpacity }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-950/45 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            style={{ x, width: w }}
            initial={{ x: w }}
            animate={{ x: 0, transition: SPRING }}
            exit={{ x: w, transition: { duration: 0.22, ease: EASE_OUT } }}
            drag="x"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.6 }}
            dragMomentum={false}
            onDragEnd={onDragEnd}
            className="absolute right-0 top-0 flex h-full flex-col bg-white shadow-lift"
          >
            <header
              onPointerDown={(e) => controls.start(e)}
              style={{ touchAction: 'none' }}
              className="flex cursor-grab items-start justify-between gap-3 border-b border-navy-100 px-5 py-4 active:cursor-grabbing"
            >
              <div className="min-w-0">
                <h2 className="truncate font-display text-lg text-navy-900">{title}</h2>
                {subtitle && <p className="mt-0.5 truncate text-xs text-navy-500">{subtitle}</p>}
              </div>
              <button
                type="button"
                aria-label="Đóng"
                onClick={onClose}
                onPointerDown={(e) => e.stopPropagation()}
                className="-mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-navy-500 transition-colors duration-150 hover:bg-navy-50 hover:text-navy-900"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
            {footer && <footer className="border-t border-navy-100 bg-ivory/60 px-5 py-3">{footer}</footer>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
