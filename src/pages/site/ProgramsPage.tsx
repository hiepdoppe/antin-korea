import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { Programs } from '@/components/site/Programs'
import { useContent } from '@/hooks/useContent'
import { usePageSeo } from '@/hooks/usePageSeo'

export default function ProgramsPage() {
  const { ui } = useContent()
  usePageSeo('programs')
  return (
    <>
      <Breadcrumb items={[{ label: ui.nav.programs }]} />
      <Programs h1 />
      <CtaBand />
    </>
  )
}
