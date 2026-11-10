import type { Transition } from 'framer-motion'

/** Spring chuẩn cho tab, accordion, drawer, card (theo đặc tả). */
export const SPRING: Transition = { type: 'spring', stiffness: 450, damping: 32 }

/** Ease-out mạnh – dùng cho vào/ra cảnh theo thời gian. */
export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

/** Thoát luôn nhanh hơn vào. */
export const EXIT: Transition = { duration: 0.16, ease: EASE_OUT }

/** Hiệu ứng nhấn chuẩn cho mọi phần tử bấm được. */
export const TAP = { scale: 0.98 }

/** Reveal khi cuộn tới: một lần, không stagger lồng nhau. */
export const reveal = (delay = 0, y = 12) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: EASE_OUT, delay },
})
