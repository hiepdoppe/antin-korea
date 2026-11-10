import { ASSETS } from '@/constants/assets'
import { useContent } from '@/hooks/useContent'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  )
}

export function About({ h1 }: { h1?: boolean }) {
  const { sections, ceoLetter, vision, ui } = useContent()

  return (
    <Section id="about" h1={h1} eyebrow={ui.about.eyebrow} title={sections.about} tone="ivory">
      {/* Thư ngỏ Tổng Giám đốc */}
      <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-12">
        <Reveal className="lg:col-span-2 lg:sticky lg:top-28">
          <figure className="overflow-hidden rounded-3xl border border-white bg-white shadow-lift">
            <div className="aspect-[3/2] bg-navy-100">
              <img
                src={ASSETS.leadership.ceo}
                alt={`${ceoLetter.ceoTitle} ${ceoLetter.ceoName} tại bàn làm việc`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="flex items-center gap-3 border-t border-gold-100 bg-gradient-to-r from-gold-50 to-white px-5 py-4">
              <img src={ASSETS.logo.mark} alt="" className="h-10 w-10 shrink-0 object-contain" />
              <div className="leading-tight">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">{ceoLetter.ceoTitle}</p>
                <p className="font-display text-lg text-navy-900">{ceoLetter.ceoName}</p>
              </div>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-3">
          <article className="relative rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-9">
            <svg viewBox="0 0 48 48" className="absolute right-6 top-6 h-12 w-12 text-gold-200" fill="currentColor" aria-hidden>
              <path d="M10 28c0-8 4-14 12-16l1 3c-4 1.6-6 4.600-6 8h5v13H10V28zm18 0c0-8 4-14 12-16l1 3c-4 1.600-6 4.600-6 8h5v13H28V28z" />
            </svg>
            <p className="font-display text-xl text-navy-900 sm:text-2xl">{ceoLetter.greeting}</p>
            <div className="mt-5 space-y-4 text-pretty leading-[1.75] text-navy-700">
              {ceoLetter.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-7 flex items-end justify-between gap-4 border-t border-navy-100 pt-5">
              <div className="leading-tight">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">{ceoLetter.ceoTitle}</p>
                <p className="font-display text-lg text-navy-900">{ceoLetter.ceoName}</p>
              </div>
              <img
                src={ASSETS.leadership.ceoSignature}
                alt={`Chữ ký ${ceoLetter.ceoName}`}
                loading="lazy"
                className="h-16 w-auto max-w-[45%] object-contain mix-blend-multiply sm:h-20"
              />
            </div>
          </article>
        </Reveal>
      </div>

      {/* Tầm nhìn – Sứ mệnh – Giá trị cốt lõi */}
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-3xl border border-navy-100 bg-white p-7 shadow-card">
            <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gold-100 text-gold-700">
              <Icon d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zM12 15a3 3 0 100-6 3 3 0 000 6z" />
            </span>
            <h3 className="font-display text-2xl text-navy-900">{vision.visionTitle}</h3>
            <p className="mt-3 leading-relaxed text-navy-700">{vision.vision}</p>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="h-full rounded-3xl border border-navy-100 bg-white p-7 shadow-card">
            <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gold-100 text-gold-700">
              <Icon d="M12 2l3 6.500 7 .9-5.100 4.900 1.300 7L12 17.800 5.800 21.300l1.300-7L2 9.400l7-.9L12 2z" />
            </span>
            <h3 className="font-display text-2xl text-navy-900">{vision.missionTitle}</h3>
            <p className="mt-3 leading-relaxed text-navy-700">{vision.mission}</p>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-5">
        <div className="rounded-3xl bg-navy-900 p-7 text-center shadow-lift sm:p-9">
          <h3 className="eyebrow !text-gold-300">{vision.valuesTitle}</h3>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {vision.values.map((v, i) => (
              <li
                key={`${v}-${i}`}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-5 [&:last-child:nth-child(odd)]:col-span-2 sm:[&:last-child:nth-child(odd)]:col-span-1"
              >
                <span className="block font-display text-sm text-gold-400">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-1 block text-sm font-bold tracking-wide text-white sm:text-base">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}
