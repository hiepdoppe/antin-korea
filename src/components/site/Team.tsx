import { ASSETS } from '@/constants/assets'
import type { OrgBlock } from '@/data/initialContent'
import { useContent } from '@/hooks/useContent'
import { Reveal } from '../ui/Reveal'

function Node({ img, alt, title, sub, big }: { img: string; alt: string; title: string; sub?: string; big?: boolean }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`overflow-hidden rounded-full border-4 border-gold-300 bg-navy-100 shadow-card ${big ? 'h-32 w-32 sm:h-36 sm:w-36' : 'h-28 w-28 sm:h-32 sm:w-32'}`}
      >
        <img src={img} alt={alt} loading="lazy" className="h-full w-full object-cover object-[50%_35%]" />
      </div>
      <div className="-mt-4 rounded-xl bg-gradient-to-b from-gold-700 to-gold-800 px-5 py-2 text-white shadow-card">
        <p className="text-sm font-bold uppercase tracking-wide">{title}</p>
        {sub && <p className="text-xs text-gold-100">{sub}</p>}
      </div>
    </div>
  )
}

function Units({ block, img, alt }: { block: OrgBlock; img: string; alt: string }) {
  return (
    <div className="relative flex flex-col items-center md:pt-8">
      {/* nhánh nối dọc từ đường ngang */}
      <span className="absolute left-1/2 top-0 hidden h-8 w-px -translate-x-1/2 bg-gold-400 md:block" aria-hidden />
      <Node img={img} alt={alt} title={block.title} sub={block.block} />
      <ul className="mt-5 flex flex-wrap justify-center gap-2">
        {block.units.map((u) => (
          <li key={u} className="rounded-lg border border-gold-200 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-800">
            {u}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Team({ h1 }: { h1?: boolean }) {
  const { team } = useContent()
  const Title = h1 ? 'h1' : 'h2'
  const koreaPhotos = [ASSETS.staff.koreaKy, ASSETS.staff.koreaHyun, ASSETS.staff.koreaEunJi]

  return (
    <section id="team" className="relative bg-white py-16 sm:py-24">
      <div className="container-x">
        {/* Thông điệp nhân sự */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
            <img
              src={ASSETS.staff.teamGroup}
              alt="Toàn thể nhân sự An Tín Korea"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover object-[50%_30%] sm:aspect-[21/9]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/35 to-transparent" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <Title className="font-display text-2xl text-white text-balance sm:text-4xl">{team.headline}</Title>
              <p className="mt-2 text-sm font-semibold text-gold-300 sm:text-lg">{team.tagline}</p>
            </div>
          </div>
        </Reveal>

        {/* Sơ đồ tổ chức */}
        <Reveal className="mt-16">
          <div className="flex flex-col items-center">
            <Node img={ASSETS.leadership.ceo} alt={`${team.ceoTitle} ${team.ceoName}`} title={team.ceoTitle} sub={team.ceoName} big />
            <span className="h-8 w-px bg-gold-400" aria-hidden />
          </div>
          <div className="relative mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:gap-8">
            <span className="absolute left-1/4 right-1/4 top-0 hidden h-px bg-gold-400 md:block" aria-hidden />
            <Units block={team.deputy1} img={ASSETS.leadership.deputy1} alt={team.deputy1.title} />
            <Units block={team.deputy2} img={ASSETS.leadership.deputy2} alt={team.deputy2.title} />
          </div>
        </Reveal>

        {/* Chuyên viên đối ngoại tại Hàn Quốc */}
        <Reveal className="mt-20">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h3 className="font-display text-2xl text-navy-900 text-balance sm:text-3xl">{team.koreaTitle}</h3>
            <p className="mt-2 text-navy-600">{team.koreaIntro}</p>
          </div>
          <ul className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
            {team.koreaStaff.map((p, i) => (
              <li key={`${p.name}-${i}`} className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card">
                <div className="aspect-[4/5] bg-gradient-to-b from-gold-100 to-gold-200">
                  {koreaPhotos[i] && (
                    <img
                      src={koreaPhotos[i]}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top mix-blend-multiply"
                    />
                  )}
                </div>
                <div className="border-t border-gold-100 px-4 py-4 text-center">
                  <p className="font-display text-lg text-navy-900">{p.name}</p>
                  <p className="mt-0.5 text-xs font-medium text-gold-700">{p.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
