import { forwardRef, useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ASSETS } from '@/constants/assets'
import { cn } from '@/lib/cn'
import { SPRING } from '@/lib/motion'
import { useLang } from '@/hooks/useLang'
import { fmt } from '@/lib/i18n'
import { useUniversitiesStore, type Region, type University } from '@/store/universitiesStore'
import type { UiContent } from '@/data/initialContent'
import { useContent } from '@/hooks/useContent'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { Tabs } from '../ui/Tabs'

type RegionFilter = 'all' | Region
type TrackFilter = 'all' | 'd4' | 'd2'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

type UniUi = UiContent['universities']

function regionLabel(r: Region, t: UniUi): string {
  return r === 'seoul' ? t.regionSeoul : r === 'gyeonggi-incheon' ? t.regionGyeonggi : t.regionOther
}

const UniversityCard = forwardRef<HTMLElement, { u: University; t: UniUi }>(function UniversityCard({ u, t }, ref) {
  const lang = useLang()
  const city = lang === 'ko' && u.cityKo?.trim() ? u.cityKo : u.city
  const note = lang === 'ko' && u.noteKo?.trim() ? u.noteKo : u.note
  const logo = u.logoKey ? ASSETS.universities.logos[u.logoKey] : undefined
  const photo = u.photoKey ? (ASSETS.universities.meetings as Record<string, string>)[u.photoKey] : undefined

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.14 } }}
      transition={SPRING}
      className="group flex flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card transition-shadow duration-200 ease-out hover:shadow-lift"
    >
      <div className="relative grid h-36 place-items-center overflow-hidden bg-white">
        {photo ? (
          <img src={photo} alt={`Buổi làm việc với ${u.nameEn}`} loading="lazy" className="h-full w-full object-cover object-[50%_30%]" />
        ) : logo ? (
          <img src={logo} alt={`Logo ${u.nameEn}`} loading="lazy" className="max-h-24 w-auto max-w-[78%] object-contain" />
        ) : (
          <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-navy-700 to-navy-900 font-display text-2xl text-gold-300">
            {initials(u.nameEn)}
          </span>
        )}
        {u.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-100 px-2.5 py-1 text-[11px] font-bold text-gold-800 ring-1 ring-gold-300">
            {t.featured}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-navy-50 p-5">
        <h3 className="font-display text-lg leading-snug text-navy-900">{u.nameEn}</h3>
        {u.nameKo && <p className="mt-0.5 text-sm text-navy-500">{u.nameKo}</p>}
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-navy-600">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-gold-600" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M8 14s5-4.300 5-8a5 5 0 10-10 0c0 3.700 5 8 5 8z" />
            <circle cx="8" cy="6" r="1.800" />
          </svg>
          {city} · {regionLabel(u.region, t)}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {u.d4 && <span className="rounded-md bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-800">{t.d4}</span>}
          {u.d2 && <span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800">{t.d2}</span>}
        </div>
        {u.tuition && (
          <p className="mt-3 text-xs text-navy-600">
            {t.tuition}: <span className="font-semibold text-navy-900">{u.tuition}</span>
          </p>
        )}
        {note && <p className="mt-2 text-xs leading-relaxed text-navy-500">{note}</p>}
      </div>
    </motion.article>
  )
})

export function UniversityExplorer({ h1 }: { h1?: boolean }) {
  const { sections, ui } = useContent()
  const t = ui.universities
  const items = useUniversitiesStore((s) => s.items)
  const [region, setRegion] = useState<RegionFilter>('all')
  const [track, setTrack] = useState<TrackFilter>('all')

  const filtered = useMemo(
    () =>
      items.filter(
        (u) =>
          (region === 'all' || u.region === region) &&
          (track === 'all' || (track === 'd4' ? u.d4 : u.d2)),
      ),
    [items, region, track],
  )

  return (
    <Section id="universities" h1={h1} eyebrow={t.eyebrow} title={sections.universities} intro={t.intro} tone="white">
      <LayoutGroup id="uni-filters">
        <Reveal className="flex flex-col items-center gap-3 sm:gap-4">
          <Tabs
            ariaLabel={t.filterRegion}
            layoutId="region-pill"
            value={region}
            onChange={setRegion}
            items={[
              { id: 'all', label: t.all },
              { id: 'seoul', label: t.regionSeoul },
              { id: 'gyeonggi-incheon', label: t.regionGyeonggi },
              { id: 'other', label: t.regionOther },
            ]}
          />
          <Tabs
            ariaLabel={t.filterTrack}
            layoutId="track-pill"
            tone="gold"
            value={track}
            onChange={setTrack}
            items={[
              { id: 'all', label: t.allTracks },
              { id: 'd4', label: t.d4 },
              { id: 'd2', label: t.d2 },
            ]}
          />
        </Reveal>
      </LayoutGroup>

      <p className="mt-6 text-center text-sm text-navy-500" aria-live="polite">
        {fmt(t.showing, { n: filtered.length, total: items.length })}
      </p>

      <div className="relative mt-6">
        <div className={cn('relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3', filtered.length === 0 && 'hidden')}>
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((u) => (
              <UniversityCard key={u.id} u={u} t={t} />
            ))}
          </AnimatePresence>
        </div>
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-navy-200 bg-ivory py-12 text-center text-navy-500">
            {t.none}
          </p>
        )}
      </div>
    </Section>
  )
}
