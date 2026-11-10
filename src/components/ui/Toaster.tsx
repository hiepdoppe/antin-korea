import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { cn } from '@/lib/cn'
import { EASE_OUT, SPRING } from '@/lib/motion'
import { useToastStore, type ToastData, type ToastKind } from '@/store/toastStore'

const H = 68 // chiều cao cố định của một toast
const GAP = 10

const icon: Record<ToastKind, ReactNode> = {
  success: (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" className="fill-emerald-500" />
      <path d="M6 10.4l2.8 2.8L14 7.8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" className="fill-red-500" />
      <path d="M10 5.5v5.2M10 13.6v.1" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" className="fill-navy-700" />
      <path d="M10 9v5M10 6.2v.1" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
}

function ToastItem({
  toast,
  index,
  expanded,
  paused,
  onHover,
}: {
  toast: ToastData
  index: number
  expanded: boolean
  paused: boolean
  onHover: (v: boolean) => void
}) {
  const dismiss = useToastStore((s) => s.dismiss)

  // Tự đóng; tạm dừng khi hover hoặc khi tab bị ẩn.
  useEffect(() => {
    if (paused) return
    const t = window.setTimeout(() => dismiss(toast.id), toast.duration ?? 3800)
    return () => window.clearTimeout(t)
  }, [paused, toast.id, toast.title, toast.description, toast.duration, dismiss])

  const hidden = !expanded && index > 2
  const y = expanded ? -index * (H + GAP) : -index * 10
  const scale = expanded ? 1 : 1 - index * 0.05

  const onDragEnd = (_: unknown, info: PanInfo) => {
    // Quẹt sang phải: vượt ngưỡng khoảng cách HOẶC đủ nhanh (flick).
    if (info.offset.x > 80 || info.velocity.x > 500) dismiss(toast.id)
  }

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, x: 48, y: 0, scale: 1 }}
      animate={{ opacity: hidden ? 0 : 1, x: 0, y, scale }}
      exit={{ opacity: 0, x: 56, transition: { duration: 0.18, ease: EASE_OUT } }}
      transition={SPRING}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 0.7 }}
      dragSnapToOrigin
      onDragEnd={onDragEnd}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      style={{ height: H, zIndex: 100 - index, transformOrigin: 'bottom center', touchAction: 'pan-y' }}
      className={cn(
        'pointer-events-auto absolute inset-x-0 bottom-0 flex cursor-grab items-center gap-3 rounded-2xl border border-navy-100 bg-white px-4 shadow-lift active:cursor-grabbing',
        // lấp khoảng hở giữa các toast để hover không bị ngắt
        'after:absolute after:inset-x-0 after:-bottom-[10px] after:h-[10px] after:content-[""]',
        hidden && 'pointer-events-none',
      )}
    >
      <span className="shrink-0">{icon[toast.kind]}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy-900">{toast.title}</p>
        {toast.description && <p className="line-clamp-1 text-xs text-navy-500">{toast.description}</p>}
      </div>
      <button
        type="button"
        aria-label="Đóng thông báo"
        onClick={() => dismiss(toast.id)}
        className="-mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-navy-400 transition-colors duration-150 hover:bg-navy-50 hover:text-navy-700"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </motion.div>
  )
}

/** Toast xếp chồng kiểu Sonner. Gắn <Toaster /> một lần; gọi toast.success() từ bất kỳ đâu. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const [expanded, setExpanded] = useState(false)
  const [docHidden, setDocHidden] = useState(false)

  useEffect(() => {
    const onVis = () => setDocHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    if (toasts.length === 0) setExpanded(false)
  }, [toasts.length])

  const list = [...toasts].reverse() // mới nhất ở index 0 (phía trước)

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[200] w-[min(360px,calc(100vw-2rem))] pb-[env(safe-area-inset-bottom)]"
      style={{ height: H }}
    >
      <AnimatePresence initial={false}>
        {list.map((t, i) => (
          <ToastItem
            key={t.id}
            toast={t}
            index={i}
            expanded={expanded}
            paused={expanded || docHidden}
            onHover={setExpanded}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
