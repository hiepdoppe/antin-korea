import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useContent } from '@/hooks/useContent'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/cn'
import { stripLang, withLang, type Lang } from '@/lib/i18n'
import { SPRING } from '@/lib/motion'

const OPTIONS: { id: Lang; label: string; full: string }[] = [
  { id: 'vi', label: 'VI', full: 'Tiếng Việt' },
  { id: 'ko', label: '한국어', full: '한국어' },
]

/** Chuyển ngôn ngữ Việt ↔ Hàn: giữ nguyên trang đang xem, chỉ đổi tiền tố /ko trên đường dẫn. */
export function LangSwitch({ className, layoutId = 'lang-pill' }: { className?: string; layoutId?: string }) {
  const lang = useLang()
  const { pathname, search } = useLocation()
  const { ui } = useContent()
  const base = stripLang(pathname)

  return (
    <div role="group" aria-label={ui.nav.langLabel} className={cn('relative inline-flex shrink-0 whitespace-nowrap rounded-full border border-navy-100 bg-white p-0.5', className)}>
      {OPTIONS.map((o) => {
        const active = lang === o.id
        return (
          <Link
            key={o.id}
            to={`${withLang(base, o.id)}${search}`}
            hrefLang={o.id}
            lang={o.id}
            aria-label={o.full}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'relative whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-150',
              active ? 'text-navy-950' : 'text-navy-500 hover:text-navy-900',
            )}
          >
            {active && <motion.span layoutId={layoutId} transition={SPRING} className="absolute inset-0 rounded-full bg-gold-200 ring-1 ring-gold-300" />}
            <span className="relative z-10">{o.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
