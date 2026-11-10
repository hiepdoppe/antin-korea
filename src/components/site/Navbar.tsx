import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS } from '@/constants/assets'
import { NAV_KEYS, ROUTES } from '@/constants/routes'
import { useContent } from '@/hooks/useContent'
import { useLocalePath } from '@/hooks/useLang'
import { cn } from '@/lib/cn'
import { stripLang } from '@/lib/i18n'
import { EASE_OUT, SPRING, TAP } from '@/lib/motion'
import { ButtonLink } from '../ui/Button'
import { LangSwitch } from './LangSwitch'

export function Navbar() {
  const { brand, ui } = useContent()
  const lp = useLocalePath()
  const { pathname } = useLocation()
  const current = stripLang(pathname)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // đổi trang → đóng menu di động
  useEffect(() => setOpen(false), [pathname])

  const links = NAV_KEYS.map((k) => ({ key: k, to: ROUTES[k], label: ui.nav[k] }))
  const isActive = (to: string) => current === to || current.startsWith(`${to}/`)

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-200 ease-out',
        scrolled ? 'border-navy-100 bg-ivory/85 shadow-card backdrop-blur-md' : 'border-transparent bg-ivory/60 backdrop-blur-sm',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1480px] items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 xl:px-8">
        <Link to={lp(ROUTES.home)} className="flex shrink-0 items-center gap-2.5" aria-label={`${brand.nameVi} – ${ui.nav.home}`}>
          <img src={ASSETS.logo.mark} alt="" className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11" />
          <span className="leading-tight">
            <span className="block whitespace-nowrap font-display text-base tracking-wide text-navy-900 sm:text-lg">AN TÍN KOREA</span>
            <span className="hidden whitespace-nowrap text-[11px] font-medium text-gold-700 min-[1700px]:block">{brand.slogan}</span>
          </span>
        </Link>

        <nav aria-label={ui.nav.mainLabel} className="hidden min-w-0 items-center gap-0 xl:flex min-[1440px]:gap-0.5">
          {links.map((l) => {
            const active = isActive(l.to)
            return (
              <Link
                key={l.key}
                to={lp(l.to)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-semibold min-[1440px]:px-3 min-[1440px]:text-sm transition-colors duration-150 ease-out',
                  active ? 'text-navy-950' : 'text-navy-600 hover:text-navy-900',
                )}
              >
                {active && <motion.span layoutId="nav-pill" transition={SPRING} className="absolute inset-0 rounded-full bg-gold-200/70 ring-1 ring-gold-300" />}
                <span className="relative z-10">{l.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
          <LangSwitch />
          <ButtonLink href={ROUTES.contact} size="sm" className="hidden md:inline-flex xl:hidden min-[1440px]:inline-flex">
            {ui.nav.register}
          </ButtonLink>
          <motion.button
            type="button"
            whileTap={TAP}
            aria-label={open ? ui.nav.menuClose : ui.nav.menuOpen}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-navy-100 bg-white text-navy-800 xl:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label={ui.nav.mobileLabel}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.12, ease: EASE_OUT } }}
            className="border-t border-navy-100 bg-ivory xl:hidden"
          >
            <div className="container-x grid gap-1 py-3 sm:grid-cols-2">
              {links.map((l) => (
                <Link
                  key={l.key}
                  to={lp(l.to)}
                  className={cn(
                    'rounded-xl px-3 py-3 text-base font-semibold transition-colors duration-150',
                    isActive(l.to) ? 'bg-gold-100 text-navy-950' : 'text-navy-700 active:bg-navy-50',
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <ButtonLink href={ROUTES.contact} className="mt-2 sm:col-span-2">
                {ui.nav.register}
              </ButtonLink>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
