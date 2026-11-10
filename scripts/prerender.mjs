/**
 * Prerender cho SEO (không cần thư viện ngoài): sau `vite build`, sinh một file HTML tĩnh cho từng trang
 * và từng bài viết (cả bản /ko), có <title>, meta description, canonical, hreflang, Open Graph, JSON-LD
 * và phần nội dung chữ để Google đọc được ngay cả khi chưa chạy JavaScript. Ngoài ra tạo sitemap.xml và robots.txt.
 *
 * Nội dung lấy từ: src/data/initialContent.ts + koDefaults.ts + src/data/published.json (bản đã xuất bản).
 * Khai báo tên miền: biến SITE_URL (hoặc VITE_SITE_URL trong file .env), ví dụ https://antinkorea.vn
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

// ---------- đọc cấu hình ----------
function readEnv() {
  const out = {}
  try {
    for (const line of fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m) out[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
    }
  } catch {
    /* không có .env */
  }
  return out
}
const env = { ...readEnv(), ...process.env }
const SITE = (env.SITE_URL || env.VITE_SITE_URL || '').replace(/\/$/, '')

// ---------- nạp file TypeScript dữ liệu ----------
function loadTs(rel) {
  const src = fs.readFileSync(path.join(root, rel), 'utf8')
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
  const m = { exports: {} }
  new Function('module', 'exports', js)(m, m.exports)
  return m.exports
}
const { initialContent } = loadTs('src/data/initialContent.ts')
const { koDefaults } = loadTs('src/data/koDefaults.ts')
const { newsSeed } = loadTs('src/data/newsSeed.ts')
const { ROUTES } = loadTs('src/constants/routes.ts')
const published = JSON.parse(fs.readFileSync(path.join(root, 'src/data/published.json'), 'utf8'))

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)
function deepMerge(base, over) {
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : over
  const out = { ...base }
  for (const k of Object.keys(over)) out[k] = k in base ? deepMerge(base[k], over[k]) : over[k]
  return out
}
function localize(node, ko, prefix = '') {
  if (typeof node === 'string') return ko[prefix]?.trim() ? ko[prefix] : node
  if (Array.isArray(node)) return node.map((v, i) => localize(v, ko, prefix ? `${prefix}.${i}` : String(i)))
  if (isObj(node)) return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, localize(v, ko, prefix ? `${prefix}.${k}` : k)]))
  return node
}

const contentVi = deepMerge(initialContent, published.content)
const ko = { ...koDefaults, ...(published.ko || {}) }
const contentFor = { vi: contentVi, ko: localize(contentVi, ko) }
const universities = published.universities || loadTs('src/data/universities.ts').initialUniversities
const now = Date.now()
const articles = (published.news || newsSeed)
  .filter((a) => a.status === 'published' && a.slug && new Date(a.publishedAt).getTime() <= now)
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

const articleText = (a, lang) => {
  if (lang === 'vi') return a.vi
  const out = { ...a.vi }
  for (const k of Object.keys(out)) if (a.ko?.[k]?.trim()) out[k] = a.ko[k]
  return out
}

// ---------- tiện ích HTML ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const withLang = (p, lang) => (lang === 'vi' ? p : p === '/' ? '/ko' : `/ko${p}`)
const abs = (p) => (SITE ? `${SITE}${p}` : p)
const p = (t) => `<p>${esc(t)}</p>`

function bodyBlocks(body) {
  return String(body)
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const lines = c.split('\n')
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) return `<ul>${lines.map((l) => `<li>${esc(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`
      if (c.startsWith('### ')) return `<h3>${esc(c.slice(4))}</h3>`
      if (c.startsWith('## ')) return `<h2>${esc(c.slice(3))}</h2>`
      return p(lines.join(' '))
    })
    .join('\n')
}

function pageBody(key, c, lang) {
  const nav = Object.entries(ROUTES)
    .filter(([k]) => k !== 'home')
    .map(([k, to]) => `<li><a href="${withLang(to, lang)}">${esc(c.ui.nav[k])}</a></li>`)
    .join('')
  const navHtml = `<nav><ul>${nav}</ul></nav>`
  const contact = `<address>${esc(c.contact.address)}<br>${esc(c.contact.hotline)} · ${esc(c.contact.email)}</address>`
  switch (key) {
    case 'home':
      return `<h1>${esc(c.brand.slogan)}</h1>${p(c.hero.subline)}${navHtml}${contact}`
    case 'about':
      return `<h1>${esc(c.sections.about)}</h1><h2>${esc(c.ceoLetter.greeting)}</h2>${c.ceoLetter.paragraphs.map(p).join('')}<h2>${esc(c.vision.visionTitle)}</h2>${p(c.vision.vision)}<h2>${esc(c.vision.missionTitle)}</h2>${p(c.vision.mission)}<h2>${esc(c.vision.valuesTitle)}</h2><ul>${c.vision.values.map((v) => `<li>${esc(v)}</li>`).join('')}</ul>`
    case 'team':
      return `<h1>${esc(c.team.headline)}</h1>${p(c.team.tagline)}<h2>${esc(c.team.koreaTitle)}</h2>${p(c.team.koreaIntro)}<ul>${c.team.koreaStaff.map((s) => `<li>${esc(s.name)} – ${esc(s.role)}</li>`).join('')}</ul>`
    case 'programs':
      return `<h1>${esc(c.sections.programs)}</h1>${p(c.programs.intro)}${c.programs.items.map((i) => `<h2>${esc(i.title)} (${esc(i.badge)})</h2>${p(i.description)}`).join('')}`
    case 'roadmap':
      return `<h1>${esc(c.sections.roadmap)}</h1><ol>${c.roadmap.steps.map((s) => `<li><h2>${esc(s.title)}</h2>${p(s.description)}</li>`).join('')}</ol>`
    case 'facilities':
      return `<h1>${esc(c.sections.facilities)}</h1><h2>${esc(c.facilities.dormTitle)}</h2>${p(c.facilities.dormText)}<h2>${esc(c.facilities.studyTitle)}</h2>${p(c.facilities.studyText)}<h2>${esc(c.facilities.socialTitle)}</h2>${p(c.facilities.socialText)}`
    case 'universities':
      return `<h1>${esc(c.sections.universities)}</h1>${p(c.ui.universities.intro)}<ul>${universities.map((u) => `<li>${esc(u.nameEn)}${u.nameKo ? ` (${esc(u.nameKo)})` : ''} – ${esc(lang === 'ko' && u.cityKo ? u.cityKo : u.city)}</li>`).join('')}</ul>`
    case 'news':
      return `<h1>${esc(c.sections.news)}</h1>${p(c.ui.news.intro)}<ul>${articles.map((a) => `<li><a href="${withLang(`${ROUTES.news}/${a.slug}`, lang)}">${esc(articleText(a, lang).title)}</a></li>`).join('')}</ul>`
    case 'contact':
      return `<h1>${esc(c.sections.contact)}</h1>${contact}<p>${esc(c.brand.nameVi)} · ${esc(c.ui.common.taxCode)}: ${esc(c.brand.taxCode)}</p>`
    default:
      return ''
  }
}

// ---------- ghi file ----------
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

function render({ lang, basePath, title, description, image, type = 'website', jsonLd, bodyHtml, koAlt = true }) {
  const url = withLang(basePath, lang)
  const tags = [
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:locale" content="${lang === 'ko' ? 'ko_KR' : 'vi_VN'}">`,
    image ? `<meta property="og:image" content="${esc(image.startsWith('http') ? image : abs(image))}">` : '',
    '<meta name="twitter:card" content="summary_large_image">',
    SITE ? `<link rel="canonical" href="${abs(url)}">` : '',
    SITE ? `<link rel="alternate" hreflang="vi" href="${abs(withLang(basePath, 'vi'))}">` : '',
    SITE && koAlt ? `<link rel="alternate" hreflang="ko" href="${abs(withLang(basePath, 'ko'))}">` : '',
    SITE ? `<link rel="alternate" hreflang="x-default" href="${abs(basePath)}">` : '',
    jsonLd ? `<script type="application/ld+json" id="ld-json-page">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : '',
  ].filter(Boolean)

  let html = template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?>/, `<meta name="description" content="${esc(description)}">`)
    .replace('</head>', `${tags.join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><div style="max-width:48rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif;line-height:1.6">${bodyHtml}</div></div>`)

  const file = path.join(dist, url === '/' ? '' : url, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
  return url
}

const urls = []
const pageKeys = ['home', 'about', 'team', 'programs', 'roadmap', 'facilities', 'universities', 'news', 'contact']

for (const lang of ['vi', 'ko']) {
  const c = contentFor[lang]
  for (const key of pageKeys) {
    const base = ROUTES[key]
    const jsonLd =
      key === 'home'
        ? {
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: c.brand.nameVi,
            alternateName: c.brand.nameEn,
            slogan: c.brand.slogan,
            telephone: c.contact.hotline,
            email: c.contact.email,
            address: c.contact.address,
            logo: abs('/assets/logo/logo-mark.png'),
            taxID: c.brand.taxCode,
          }
        : undefined
    urls.push({ base, lang, url: render({ lang, basePath: base, title: c.seo[key].title, description: c.seo[key].description, image: '/assets/staff/team-group.jpg', jsonLd, bodyHtml: pageBody(key, c, lang) }) })
  }
  for (const a of articles) {
    // Bản tiếng Hàn của bài chỉ được tạo khi đã dịch xong tiêu đề và nội dung (tránh trang trùng lặp tiếng Việt)
    const koDone = Boolean(a.ko?.title?.trim() && a.ko?.body?.trim())
    if (lang === 'ko' && !koDone) continue
    const t = articleText(a, lang)
    const base = `${ROUTES.news}/${a.slug}`
    const title = t.metaTitle || t.title
    const description = t.metaDescription || t.excerpt
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: t.title,
      description,
      image: a.cover ? abs(a.cover) : undefined,
      datePublished: a.publishedAt,
      dateModified: a.updatedAt,
      inLanguage: lang,
      author: { '@type': 'Organization', name: c.brand.nameVi },
      publisher: { '@type': 'Organization', name: c.brand.nameVi },
    }
    const bodyHtml = `<article><h1>${esc(t.title)}</h1>${t.excerpt ? p(t.excerpt) : ''}${bodyBlocks(t.body)}</article>`
    urls.push({ base, lang, url: render({ lang, basePath: base, title, description, image: a.cover || '/assets/staff/team-group.jpg', type: 'article', jsonLd, bodyHtml, koAlt: koDone }), lastmod: a.updatedAt })
  }
}

// robots.txt
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n${SITE ? `\nSitemap: ${SITE}/sitemap.xml\n` : ''}`)

// sitemap.xml (cần tên miền tuyệt đối)
if (SITE) {
  const bases = [...new Set(urls.map((u) => u.base))]
  const has = (b, l) => urls.some((u) => u.base === b && u.lang === l)
  const entry = (b, l) => {
    const alts = ['vi', 'ko'].filter((x) => has(b, x))
    const last = urls.find((u) => u.base === b && u.lastmod)?.lastmod
    return `  <url>
    <loc>${abs(withLang(b, l))}</loc>${last ? `\n    <lastmod>${last.slice(0, 10)}</lastmod>` : ''}${alts.length > 1 ? '\n' + alts.map((x) => `    <xhtml:link rel="alternate" hreflang="${x}" href="${abs(withLang(b, x))}"/>`).join('\n') : ''}
  </url>`
  }
  const entries = bases.flatMap((b) => ['vi', 'ko'].filter((l) => has(b, l)).map((l) => entry(b, l))).join('\n')
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`)
} else {
  console.warn('[prerender] Chưa đặt SITE_URL / VITE_SITE_URL → bỏ qua sitemap.xml, canonical và hreflang. Đặt trong file .env, ví dụ VITE_SITE_URL=https://antinkorea.vn')
}

console.log(`[prerender] Đã tạo ${urls.length} trang tĩnh (${articles.length} bài viết đã đăng, cả bản /ko nếu đã dịch).`)
