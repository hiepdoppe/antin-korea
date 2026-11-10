import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { UniversityExplorer } from '@/components/site/UniversityExplorer'
import { useContent } from '@/hooks/useContent'
import { usePageSeo } from '@/hooks/usePageSeo'

export default function UniversitiesPage() {
  const { ui } = useContent()
  usePageSeo('universities')
  return (
    <>
      <Breadcrumb items={[{ label: ui.nav.universities }]} />
      <UniversityExplorer h1 />
      <CtaBand />
    </>
  )
}
