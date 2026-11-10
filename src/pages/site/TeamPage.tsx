import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { Team } from '@/components/site/Team'
import { useContent } from '@/hooks/useContent'
import { usePageSeo } from '@/hooks/usePageSeo'

export default function TeamPage() {
  const { ui } = useContent()
  usePageSeo('team')
  return (
    <>
      <Breadcrumb items={[{ label: ui.nav.team }]} />
      <Team h1 />
      <CtaBand />
    </>
  )
}
