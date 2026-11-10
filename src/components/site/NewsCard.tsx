import { Link } from 'react-router-dom'
import { ASSETS } from '@/constants/assets'
import { ROUTES } from '@/constants/routes'
import { useContent } from '@/hooks/useContent'
import { useLang, useLocalePath } from '@/hooks/useLang'
import { formatDate } from '@/lib/utils'
import { articleText, categoryLabel, type Article } from '@/store/newsStore'

export function NewsCard({ a }: { a: Article }) {
  const lang = useLang()
  const lp = useLocalePath()
  const { ui } = useContent()
  const t = articleText(a, lang)
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card transition-shadow duration-200 ease-out hover:shadow-lift">
      <Link to={lp(`${ROUTES.news}/${a.slug}`)} className="block" tabIndex={-1} aria-hidden>
        <div className="aspect-[16/9] overflow-hidden bg-navy-50">
          {a.cover ? (
            <img
              src={a.cover}
              alt={a.coverAlt || t.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-gold-100 to-navy-50">
              <img src={ASSETS.logo.mark} alt="" className="h-16 w-16 object-contain opacity-70" />
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex flex-wrap items-center gap-x-2 text-xs font-medium text-navy-500">
          {a.category && <span className="rounded-full bg-gold-100 px-2.5 py-0.5 font-semibold text-gold-800">{categoryLabel(a.category, lang)}</span>}
          <time dateTime={a.publishedAt}>{formatDate(a.publishedAt, lang)}</time>
        </p>
        <h3 className="mt-3 font-display text-lg leading-snug text-navy-900 text-balance">
          <Link to={lp(`${ROUTES.news}/${a.slug}`)} className="transition-colors hover:text-gold-700">
            {t.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy-600">{t.excerpt}</p>
        <Link
          to={lp(`${ROUTES.news}/${a.slug}`)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 transition-colors hover:text-gold-700"
        >
          {ui.news.readMore} <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  )
}
