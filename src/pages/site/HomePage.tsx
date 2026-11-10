import { useContent } from '@/hooks/useContent'
import { usePageSeo } from '@/hooks/usePageSeo'
import { CtaBand } from '@/components/site/CtaBand'
import { Hero } from '@/components/site/Hero'
import { HomeCards } from '@/components/site/HomeCards'
import { LatestNews } from '@/components/site/LatestNews'
import { PartnerMarquee } from '@/components/site/PartnerMarquee'

export default function HomePage() {
  const { brand, contact } = useContent()
  usePageSeo('home', {
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: brand.nameVi,
      alternateName: brand.nameEn,
      slogan: brand.slogan,
      telephone: contact.hotline,
      email: contact.email,
      address: contact.address,
      logo: '/assets/logo/logo-mark.png',
      taxID: brand.taxCode,
    },
  })
  return (
    <>
      <Hero />
      <PartnerMarquee />
      <HomeCards />
      <LatestNews />
      <CtaBand />
    </>
  )
}
