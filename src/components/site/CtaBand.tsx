import { ROUTES } from '@/constants/routes'
import { useContent } from '@/hooks/useContent'
import { ButtonLink } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

/** Dải kêu gọi hành động cuối trang → trang Liên hệ. */
export function CtaBand({ title, text, label }: { title?: string; text?: string; label?: string }) {
  const { ui } = useContent()
  return (
    <section className="bg-ivory py-14 sm:py-20">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-navy-900 px-6 py-10 text-center shadow-lift sm:px-12 sm:py-14">
            <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />
            <h2 className="display relative text-balance text-2xl text-white sm:text-4xl">{title ?? ui.home.ctaTitle}</h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-pretty text-navy-100">{text ?? ui.home.ctaText}</p>
            <div className="relative mt-7 flex justify-center">
              <ButtonLink href={ROUTES.contact} size="lg">
                {label ?? ui.nav.register}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
