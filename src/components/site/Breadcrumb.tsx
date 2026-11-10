import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useContent } from '@/hooks/useContent'
import { useLocalePath } from '@/hooks/useLang'

export interface Crumb {
  label: string
  to?: string
}

/** Đường dẫn phân cấp (Trang chủ › Trang) – giúp người đọc và công cụ tìm kiếm hiểu cấu trúc site. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const { ui } = useContent()
  const lp = useLocalePath()
  const all: Crumb[] = [{ label: ui.common.breadcrumbHome, to: ROUTES.home }, ...items]
  return (
    <nav aria-label="Breadcrumb" className="border-b border-navy-100 bg-white">
      <ol className="container-x flex flex-wrap items-center gap-1.5 py-3 text-xs text-navy-500">
        {all.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>›</span>}
            {c.to && i < all.length - 1 ? (
              <Link to={lp(c.to)} className="font-medium transition-colors hover:text-gold-700">
                {c.label}
              </Link>
            ) : (
              <span aria-current={i === all.length - 1 ? 'page' : undefined} className="font-semibold text-navy-800">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
