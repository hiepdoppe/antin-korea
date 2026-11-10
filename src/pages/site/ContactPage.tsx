import { Breadcrumb } from '@/components/site/Breadcrumb'
import { Contact } from '@/components/site/Contact'
import { useContent } from '@/hooks/useContent'
import { usePageSeo } from '@/hooks/usePageSeo'

export default function ContactPage() {
  const { ui, brand, contact } = useContent()
  usePageSeo('contact', {
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: ui.nav.contact,
      about: { '@type': 'Organization', name: brand.nameVi, telephone: contact.hotline, email: contact.email, address: contact.address },
    },
  })
  return (
    <>
      <Breadcrumb items={[{ label: ui.nav.contact }]} />
      <Contact h1 />
    </>
  )
}
