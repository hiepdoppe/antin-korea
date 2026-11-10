import { Link } from 'react-router-dom'
import { ASSETS } from '@/constants/assets'
import { NAV_KEYS, ROUTES } from '@/constants/routes'
import { useContent } from '@/hooks/useContent'
import { useLocalePath } from '@/hooks/useLang'
import { telHref } from '@/lib/utils'

export function Footer() {
  const { brand, contact, ui } = useContent()
  const lp = useLocalePath()
  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.3fr_0.8fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={ASSETS.logo.mark} alt="" className="h-14 w-14 object-contain" />
            <div>
              <p className="font-display text-xl tracking-wide text-white">AN TÍN KOREA</p>
              <p className="text-sm font-medium text-gold-300">{brand.slogan}</p>
            </div>
          </div>
          <p className="mt-5 text-sm font-bold text-white">{brand.nameVi}</p>
          <p className="mt-1 text-xs tracking-wide text-navy-300">{brand.nameEn}</p>
          <p className="mt-4 text-sm text-navy-200">
            {ui.common.taxCode}: <span className="font-semibold text-white">{brand.taxCode}</span>
          </p>
          <p className="mt-1 text-sm text-navy-200">
            {ui.common.legalRep}: <span className="font-semibold text-white">{brand.legalRep}</span> - {brand.legalRepTitle}
          </p>
        </div>

        <nav aria-label={ui.common.sitemap}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{ui.common.sitemap}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to={lp(ROUTES.home)} className="transition-colors hover:text-gold-300">
                {ui.nav.home}
              </Link>
            </li>
            {NAV_KEYS.map((k) => (
              <li key={k}>
                <Link to={lp(ROUTES[k])} className="transition-colors hover:text-gold-300">
                  {ui.nav[k]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{ui.common.hqVn}</p>
            <p className="mt-1 leading-relaxed">{contact.address}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{ui.common.hqKr}</p>
            <p className="mt-1 leading-relaxed">{contact.koreaBranch}</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <a href={telHref(contact.hotline)} className="font-bold text-white transition-colors hover:text-gold-300">
              {contact.hotline}
            </a>
            <a href={`mailto:${contact.email}`} className="font-semibold text-white transition-colors hover:text-gold-300">
              {contact.email}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-navy-300">
          <p>
            © {new Date().getFullYear()} {brand.nameVi}
          </p>
          <a href="/admin" className="transition-colors hover:text-gold-300">
            {ui.common.admin}
          </a>
        </div>
      </div>
    </footer>
  )
}
