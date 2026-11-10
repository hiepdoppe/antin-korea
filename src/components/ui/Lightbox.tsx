import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_OUT, SPRING } from '@/lib/motion'

export interface LightboxImage {
  src: string
  caption?: string
}

interface LightboxProps {
  images: LightboxImage[]
  /** null = đóng */
  index: number | null
  onClose: () => void
  onIndex: (i: number) => void
  labels?: { close: string; prev: string; next: string; view: string }
}

/** Xem ảnh phóng to. Modal giữ transform-origin ở giữa; điều hướng bằng bàn phím không animate dài. */
export function Lightbox({ images, index, onClose, onIndex, labels }: LightboxProps) {
  const L = labels ?? { close: 'Đóng', prev: 'Ảnh trước', next: 'Ảnh sau', view: 'Xem ảnh' }
  const open = index !== null && images[index] !== undefined

  useEffect(() => {
    if (!open || index === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, index, images.length, onClose, onIndex])

  const current = open && index !== null ? images[index] : null

  return (
    <AnimatePresence>
      {open && current && index !== null && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={L.view}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-navy-950/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.18, ease: EASE_OUT } }}
          exit={{ opacity: 0, transition: { duration: 0.14, ease: EASE_OUT } }}
          onClick={onClose}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.figure
              key={current.src}
              className="relative flex max-h-full max-w-5xl flex-col items-center"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: SPRING }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={current.src}
                alt={current.caption ?? ''}
                className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain shadow-lift"
              />
              {current.caption && (
                <figcaption className="mt-3 max-w-xl text-center text-sm text-white/85">{current.caption}</figcaption>
              )}
            </motion.figure>
          </AnimatePresence>

          <button
            type="button"
            aria-label={L.close}
            onClick={onClose}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors duration-150 hover:bg-white/20"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label={L.prev}
                onClick={(e) => {
                  e.stopPropagation()
                  onIndex((index - 1 + images.length) % images.length)
                }}
                className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors duration-150 hover:bg-white/20"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label={L.next}
                onClick={(e) => {
                  e.stopPropagation()
                  onIndex((index + 1) % images.length)
                }}
                className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors duration-150 hover:bg-white/20"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                {index + 1} / {images.length}
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
