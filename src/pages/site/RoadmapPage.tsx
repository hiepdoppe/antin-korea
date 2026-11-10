import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { Roadmap } from '@/components/site/Roadmap'
import { useContent } from '@/hooks/useContent'
import { usePageSeo } from '@/hooks/usePageSeo'

export default function RoadmapPage() {
  const { ui } = useContent()
  usePageSeo('roadmap')
  return (
    <>
      <Breadcrumb items={[{ label: ui.nav.roadmap }]} />
      <Roadmap h1 />
      <CtaBand />
    </>
  )
}
