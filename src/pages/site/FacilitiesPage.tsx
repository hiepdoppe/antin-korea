import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { Facilities } from '@/components/site/Facilities'
import { useContent } from '@/hooks/useContent'
import { usePageSeo } from '@/hooks/usePageSeo'

export default function FacilitiesPage() {
  const { ui } = useContent()
  usePageSeo('facilities')
  return (
    <>
      <Breadcrumb items={[{ label: ui.nav.facilities }]} />
      <Facilities h1 />
      <CtaBand />
    </>
  )
}
