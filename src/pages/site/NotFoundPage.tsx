import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useContent } from '@/hooks/useContent'
import { useLocalePath } from '@/hooks/useLang'
import { useSeo } from '@/hooks/useSeo'

export default function NotFoundPage() {
  const { ui } = useContent()
  const lp = useLocalePath()
  useSeo({ title: `404 – ${ui.common.notFoundTitle}`, description: ui.common.notFoundTitle, noindex: true })
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="font-display text-6xl text-gold-500">404</p>
        <h1 className="mt-3 text-navy-700">{ui.common.notFoundTitle}</h1>
        <Link to={lp(ROUTES.home)} className="mt-5 inline-block font-semibold text-navy-900 underline decoration-gold-400 underline-offset-4">
          {ui.common.backHome}
        </Link>
      </div>
    </div>
  )
}
