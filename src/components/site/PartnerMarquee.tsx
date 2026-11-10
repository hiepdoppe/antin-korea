import { ASSETS } from '@/constants/assets'
import { useContent } from '@/hooks/useContent'
import { useUniversitiesStore } from '@/store/universitiesStore'

/** Dải logo trường đối tác chạy liên tục (CSS, linear – chuyển động hằng định). Dừng khi rê chuột. */
export function PartnerMarquee() {
  const { ui } = useContent()
  const items = useUniversitiesStore((s) => s.items)
  const logos = items
    .filter((u) => u.logoKey && ASSETS.universities.logos[u.logoKey])
    .map((u) => ({ id: u.id, name: u.nameEn, src: ASSETS.universities.logos[u.logoKey as string] }))

  if (logos.length === 0) return null

  const row = (hidden: boolean) =>
    logos.map((l) => (
      <li
        key={`${hidden ? 'b' : 'a'}-${l.id}`}
        aria-hidden={hidden || undefined}
        className="mx-3 grid h-20 w-40 shrink-0 place-items-center rounded-2xl border border-navy-100 bg-white px-4 shadow-card sm:h-24 sm:w-48"
      >
        <img src={l.src} alt={hidden ? '' : l.name} loading="lazy" className="max-h-14 w-auto max-w-full object-contain sm:max-h-16" />
      </li>
    ))

  return (
    <div className="border-y border-navy-100 bg-white py-8" aria-label={ui.universities.partnersLabel}>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <ul className="pause-on-hover flex w-max animate-marquee">
          {row(false)}
          {row(true)}
        </ul>
      </div>
    </div>
  )
}
