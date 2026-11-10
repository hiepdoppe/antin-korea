import { Link } from 'react-router-dom'
import { ROUTES, type RouteKey } from '@/constants/routes'
import { useContent } from '@/hooks/useContent'
import { useLocalePath } from '@/hooks/useLang'
import { Reveal } from '../ui/Reveal'

const CARDS: { key: RouteKey; text: 'cardAbout' | 'cardTeam' | 'cardPrograms' | 'cardRoadmap' | 'cardFacilities' | 'cardUniversities' }[] = [
  { key: 'about', text: 'cardAbout' },
  { key: 'team', text: 'cardTeam' },
  { key: 'programs', text: 'cardPrograms' },
  { key: 'roadmap', text: 'cardRoadmap' },
  { key: 'facilities', text: 'cardFacilities' },
  { key: 'universities', text: 'cardUniversities' },
]

/** Trang chủ chỉ giới thiệu ngắn từng mục; nội dung đầy đủ nằm ở trang riêng. */
export function HomeCards() {
  const { ui } = useContent()
  const lp = useLocalePath()
  return (
    <section className="bg-ivory py-16 sm:py-24" aria-labelledby="home-cards-title">
      <div className="container-x">
        <Reveal className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="eyebrow mb-3">{ui.home.cardsEyebrow}</p>
          <h2 id="home-cards-title" className="display text-balance text-3xl sm:text-4xl">
            {ui.home.cardsTitle}
          </h2>
          <span className="mx-auto mt-5 block h-1 w-14 rounded-full bg-gradient-to-r from-gold-300 to-gold-500" />
        </Reveal>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <li key={c.key}>
              <Reveal delay={Math.min(i, 5) * 0.04} className="h-full">
                <Link
                  to={lp(ROUTES[c.key])}
                  className="group flex h-full flex-col rounded-3xl border border-navy-100 bg-white p-7 shadow-card transition-[box-shadow,transform] duration-200 ease-out hover:shadow-lift active:scale-[0.98]"
                >
                  <span className="font-display text-sm text-gold-600">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 font-display text-xl text-navy-900">{ui.nav[c.key]}</h3>
                  <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-navy-600">{ui.home[c.text]}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                    {ui.home.learnMore}
                    <span aria-hidden className="transition-transform duration-200 ease-out group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
