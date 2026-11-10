import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { About } from '@/components/site/About'
import { useContent } from '@/hooks/useContent'
import { usePageSeo } from '@/hooks/usePageSeo'

export default function AboutPage() {
  const { ui } = useContent()
  usePageSeo('about')
  return (
    <>
      <Breadcrumb items={[{ label: ui.nav.about }]} />
      <About h1 />
      <CtaBand />
    </>
  )
}
