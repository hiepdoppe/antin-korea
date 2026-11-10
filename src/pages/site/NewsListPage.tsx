import { useMemo, useState } from 'react'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { NewsCard } from '@/components/site/NewsCard'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { Tabs } from '@/components/ui/Tabs'
import { useContent } from '@/hooks/useContent'
import { usePageSeo } from '@/hooks/usePageSeo'
import { useLang } from '@/hooks/useLang'
import { categoryLabel, selectPublished, useNewsStore } from '@/store/newsStore'

const ALL = '__all__'

export default function NewsListPage() {
  const { ui, sections } = useContent()
  const lang = useLang()
  const items = useNewsStore((s) => s.items)
  const [cat, setCat] = useState<string>(ALL)
  usePageSeo('news')

  const list = useMemo(() => selectPublished(items), [items])
  const categories = useMemo(() => Array.from(new Set(list.map((a) => a.category).filter(Boolean))), [list])
  const shown = cat === ALL ? list : list.filter((a) => a.category === cat)

  return (
    <>
      <Breadcrumb items={[{ label: ui.nav.news }]} />
      <Section id="news" h1 eyebrow={ui.news.eyebrow} title={sections.news} intro={ui.news.intro} tone="ivory">
        {categories.length > 0 && (
          <Reveal className="mb-8 flex justify-center">
            <Tabs
              ariaLabel={ui.news.eyebrow}
              layoutId="news-cat"
              value={categories.includes(cat) ? cat : ALL}
              onChange={setCat}
              items={[{ id: ALL, label: ui.news.all }, ...categories.map((c) => ({ id: c, label: categoryLabel(c, lang) }))]}
            />
          </Reveal>
        )}
        {shown.length === 0 ? (
          <p className="py-10 text-center text-navy-500">{ui.news.empty}</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((a) => (
              <li key={a.id}>
                <NewsCard a={a} />
              </li>
            ))}
          </ul>
        )}
      </Section>
      <CtaBand />
    </>
  )
}
