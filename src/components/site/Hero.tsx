import { motion } from 'framer-motion'
import { ASSETS } from '@/constants/assets'
import { EASE_OUT } from '@/lib/motion'
import { ROUTES } from '@/constants/routes'
import { telHref } from '@/lib/utils'
import { useContent } from '@/hooks/useContent'
import { ButtonLink } from '../ui/Button'

/** Vào cảnh một lần: tiêu đề dẫn đầu, phần còn lại nối theo sau 60ms/bước, ảnh vào song song. */
const enter = (delay: number, y = 14) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: EASE_OUT, delay },
})

export function Hero() {
  const { brand, contact, hero, ui } = useContent()
  const [lead, accent] = brand.slogan.split(' - ')

  return (
    <section className="relative overflow-hidden bg-ivory">
      {/* nền trang trí tĩnh – không chuyển động */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-gradient-to-br from-gold-200/70 via-gold-100/40 to-transparent blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -left-40 h-[34rem] w-[34rem] rounded-full bg-gradient-to-tr from-navy-100/80 to-transparent blur-2xl"
      />

      <div className="container-x relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
        <div>
          <motion.p {...enter(0, 8)} className="eyebrow mb-5 inline-flex items-center gap-2">
            <span className="h-px w-8 bg-gold-500" />
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            {...enter(0.06, 18)}
            className="display text-balance text-4xl leading-[1.08] sm:text-5xl lg:text-[3.6rem]"
          >
            {lead}
            {accent && (
              <>
                {' - '}
                <span className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 bg-clip-text text-transparent">
                  {accent}
                </span>
              </>
            )}
          </motion.h1>

          <motion.p {...enter(0.12)} className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-navy-700 sm:text-lg">
            {hero.subline}
          </motion.p>

          <motion.div {...enter(0.18)} className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={ROUTES.contact} size="lg">
              {hero.ctaPrimary}
            </ButtonLink>
            <ButtonLink href={ROUTES.roadmap} size="lg" variant="outline">
              {hero.ctaSecondary}
            </ButtonLink>
          </motion.div>

          <motion.dl {...enter(0.24, 8)} className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">{ui.common.hotline}</dt>
              <dd>
                <a href={telHref(contact.hotline)} className="font-bold text-navy-900 transition-colors hover:text-gold-700">
                  {contact.hotline}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">{ui.common.email}</dt>
              <dd>
                <a href={`mailto:${contact.email}`} className="font-bold text-navy-900 transition-colors hover:text-gold-700">
                  {contact.email}
                </a>
              </dd>
            </div>
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
          className="relative mx-auto w-full max-w-xl lg:max-w-none"
        >
          <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-gold-300/60 to-navy-200/50 blur-xl" aria-hidden />
          <div className="relative aspect-[3/2] overflow-hidden rounded-[1.75rem] border border-white bg-navy-100 shadow-lift">
            <img
              src={ASSETS.staff.teamGroup}
              alt="Đội ngũ An Tín Korea trước văn phòng"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/55 to-transparent" aria-hidden />
          </div>

          <div className="absolute -left-3 -top-4 grid h-20 w-20 place-items-center rounded-2xl border border-gold-200 bg-white p-2 shadow-card sm:-left-6 sm:h-24 sm:w-24">
            <img src={ASSETS.logo.mark} alt="Logo An Tín Korea" className="h-full w-full object-contain" />
          </div>

          <div className="absolute -bottom-6 right-3 flex max-w-[17rem] items-center gap-3 rounded-2xl border border-navy-100 bg-white p-2.5 pr-4 shadow-lift sm:-right-4">
            <img src={ASSETS.offices.korea} alt="Văn phòng tại Hàn Quốc" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
            <p className="text-xs font-medium leading-snug text-navy-700">{contact.koreaBranch}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
