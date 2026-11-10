import { About } from '@/components/site/About'
import { Contact } from '@/components/site/Contact'
import { Facilities } from '@/components/site/Facilities'
import { Footer } from '@/components/site/Footer'
import { Hero } from '@/components/site/Hero'
import { Navbar } from '@/components/site/Navbar'
import { PartnerMarquee } from '@/components/site/PartnerMarquee'
import { Programs } from '@/components/site/Programs'
import { Roadmap } from '@/components/site/Roadmap'
import { Team } from '@/components/site/Team'
import { UniversityExplorer } from '@/components/site/UniversityExplorer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PartnerMarquee />
        <About />
        <Team />
        <Programs />
        <Roadmap />
        <Facilities />
        <UniversityExplorer />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
