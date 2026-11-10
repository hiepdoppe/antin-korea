import { Fragment, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { NewsCard } from '@/components/site/NewsCard'
import { ROUTES } from '@/constants/routes'
import { useContent } from '@/hooks/useContent'
import { useLang, useLocalePath } from '@/hooks/useLang'
import { useSeo } from '@/hooks/useSeo'
import { parseBody } from '@/lib/blocks'
import { formatDate } from '@/lib/utils'
import { articleText, categoryLabel, selectPublished, useNewsStore } from '@/store/newsStore'
import NotFoundPage from './NotFoundPage'

function Article({ slug }: { slug: string }) {
  const lang = useLang()
  const lp = useLocalePath()
  const { ui, brand } = useContent()
  const items = useNewsStore((s) => s.items)
  const list = useMemo(() => selectPublished(items), [items])
  const a = list.find((x) => x.slug === slug)
  const t = a ? articleText(a, lang) : null

  useSeo({
    title: t ? t.metaTitle || t.title : `404 – ${ui.news.notFound}`,
    description: t ? t.metaDescription || t.excerpt : ui.news.notFound,
    image: a?.cover,
    type: 'article',
    // bản tiếng Hàn chưa dịch (đang hiện tiếng Việt) → không cho Google lập chỉ mục để tránh trùng lặp
    noindex: !a || (lang === 'ko' && !(a.ko.title.trim() && a.ko.body.trim())),
    jsonLd:
      a && t
        ? {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: t.title,
            description: t.metaDescription || t.excerpt,
            image: a.cover || undefined,
            datePublished: a.publishedAt,
            dateModified: a.updatedAt,
            inLanguage: lang,
            author: { '@type': 'Organization', name: brand.nameVi },
            publisher: { '@type': 'Organization', name: brand.nameVi },
          }
        : undefined,
  })

  if (!a || !t) return <NotFoundPage />

  const blocks = parseBody(t.body)
  const related = [...list.filter((x) => x.id !== a.id && x.category === a.category), ...list.filter((x) => x.id !== a.id && x.category !== a.category)].slice(0, 3)

  return (
    <>
      <Breadcrumb items={[{ label: ui.nav.news, to: ROUTES.news }, { label: t.title }]} />
      <article className="bg-white py-12 sm:py-16">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-navy-500">
              {a.category && <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-bold text-gold-800">{categoryLabel(a.category, lang)}</span>}
              <span>
                {ui.news.publishedOn} <time dateTime={a.publishedAt}>{formatDate(a.publishedAt, lang)}</time>
              </span>
            </p>
            <h1 className="display mt-4 text-balance text-3xl sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">{t.title}</h1>
            {t.excerpt && <p className="mt-5 text-pretty text-lg leading-relaxed text-navy-600">{t.excerpt}</p>}
          </div>

          {a.cover && (
            <figure className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border border-navy-100 bg-navy-50 shadow-card">
              <div className="aspect-[16/9]">
                <img src={a.cover} alt={a.coverAlt || t.title} className="h-full w-full object-cover" />
              </div>
            </figure>
          )}

          <div className="mx-auto mt-10 max-w-3xl space-y-5 text-pretty leading-[1.85] text-navy-800">
            {blocks.map((b, i) => (
              <Fragment key={i}>
                {b.t === 'h2' && <h2 className="pt-4 font-display text-2xl text-navy-900">{b.text}</h2>}
                {b.t === 'h3' && <h3 className="pt-2 font-display text-xl text-navy-900">{b.text}</h3>}
                {b.t === 'p' && <p>{b.text}</p>}
                {b.t === 'ul' && (
                  <ul className="list-disc space-y-1.5 pl-6 marker:text-gold-500">
                    {b.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                )}
              </Fragment>
            ))}
          </div>

          {a.tags.length > 0 && (
            <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap gap-2">
              {a.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-navy-100 bg-ivory px-3 py-1 text-xs font-medium text-navy-600">
                  #{tag}
                </li>
              ))}
            </ul>
          )}

          <div className="mx-auto mt-10 max-w-3xl">
            <Link to={lp(ROUTES.news)} className="font-semibold text-navy-900 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-gold-700">
              ← {ui.news.back}
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-ivory py-14 sm:py-20" aria-labelledby="related-title">
          <div className="container-x">
            <h2 id="related-title" className="display mb-8 text-center text-2xl sm:text-3xl">
              {ui.news.related}
            </h2>
            <ul className="grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <NewsCard a={r} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaBand title={ui.news.ctaTitle} label={ui.news.ctaButton} />
    </>
  )
}

export default function NewsDetailPage() {
  const { slug = '' } = useParams()
  return <Article key={slug} slug={slug} />
}
