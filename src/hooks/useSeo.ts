import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { stripLang, withLang } from '@/lib/i18n'
import { useLang } from './useLang'

const SITE = ((import.meta.env.VITE_SITE_URL as string | undefined) ?? '').replace(/\/$/, '')

interface SeoInput {
  title: string
  description: string
  /** đường dẫn ảnh chia sẻ (tương đối hoặc tuyệt đối) */
  image?: string
  type?: 'website' | 'article'
  /** dữ liệu có cấu trúc schema.org (JSON-LD) */
  jsonLd?: Record<string, unknown>
  noindex?: boolean
}

function upsert(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

const meta = (key: 'name' | 'property', name: string, content: string) =>
  upsert(`meta[${key}="${name}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute(key, name)
    return m
  }, 'content', content)

const link = (rel: string, href: string, hreflang?: string) =>
  upsert(`link[rel="${rel}"]${hreflang ? `[hreflang="${hreflang}"]` : ':not([hreflang])'}`, () => {
    const l = document.createElement('link')
    l.setAttribute('rel', rel)
    if (hreflang) l.setAttribute('hreflang', hreflang)
    return l
  }, 'href', href)

/** Đặt <title>, mô tả, canonical, hreflang (vi/ko), Open Graph và JSON-LD cho trang hiện tại. */
export function useSeo({ title, description, image, type = 'website', jsonLd, noindex }: SeoInput): void {
  const lang = useLang()
  const { pathname } = useLocation()
  const ld = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const base = stripLang(pathname)
    const abs = (p: string) => (SITE ? `${SITE}${p}` : p)
    document.documentElement.lang = lang
    document.title = title
    meta('name', 'description', description)
    meta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow')
    meta('property', 'og:title', title)
    meta('property', 'og:description', description)
    meta('property', 'og:type', type)
    meta('property', 'og:locale', lang === 'ko' ? 'ko_KR' : 'vi_VN')
    if (image) meta('property', 'og:image', image.startsWith('http') ? image : abs(image))
    meta('name', 'twitter:card', 'summary_large_image')
    if (SITE) {
      link('canonical', abs(withLang(base, lang)))
      link('alternate', abs(withLang(base, 'vi')), 'vi')
      link('alternate', abs(withLang(base, 'ko')), 'ko')
      link('alternate', abs(base), 'x-default')
    }

    const id = 'ld-json-page'
    document.getElementById(id)?.remove()
    if (ld) {
      const s = document.createElement('script')
      s.id = id
      s.type = 'application/ld+json'
      s.text = ld
      document.head.appendChild(s)
    }
    return () => document.getElementById(id)?.remove()
  }, [lang, pathname, title, description, image, type, ld, noindex])
}
