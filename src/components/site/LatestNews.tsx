import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useContent } from '@/hooks/useContent'
import { useLocalePath } from '@/hooks/useLang'
import { selectPublished, useNewsStore } from '@/store/newsStore'
import { Reveal } from '../ui/Reveal'
import { NewsCard } from './NewsCard'

export function LatestNews() {
  const { ui } = useContent()
  const lp = useLocalePath()
  const items = useNewsStore((s) => s.items)
  const latest = useMemo(() => selectPublished(items).slice(0, 3), [items])
  if (latest.length === 0) return null

  return (
    <section className="bg-white py-16 sm:py-24" aria-labelledby="home-news-title">
      <div className="container-x">
        <Reveal className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="eyebrow mb-3">{ui.home.newsEyebrow}</p>
          <h2 id="home-news-title" className="display text-balance text-3xl sm:text-4xl">
            {ui.home.newsTitle}
          </h2>
          <span className="mx-auto mt-5 block h-1 w-14 rounded-full bg-gradient-to-r from-gold-300 to-gold-500" />
        </Reveal>
        <ul className="grid gap-5 md:grid-cols-3">
          {latest.map((a) => (
            <li key={a.id}>
              <Reveal className="h-full">
                <NewsCard a={a} />
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-9 flex justify-center">
          <Link to={lp(ROUTES.news)} className="inline-flex items-center gap-1.5 font-semibold text-navy-900 underline decoration-gold-400 decoration-2 underline-offset-4 transition-colors hover:text-gold-700">
            {ui.home.newsAll} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
