import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { newsSeed } from '@/data/newsSeed'
import { published } from '@/data/published'
import { slugify } from '@/lib/slug'
import type { Lang } from '@/lib/i18n'
import { uid } from '@/lib/utils'
import { adminWriteStorage } from './storage'

export interface ArticleText {
  title: string
  excerpt: string
  body: string
  metaTitle: string
  metaDescription: string
}

export interface Article {
  id: string
  /** Đường dẫn bài viết, dùng chung cho cả hai ngôn ngữ: /tin-tuc/<slug> */
  slug: string
  status: 'draft' | 'published'
  publishedAt: string
  updatedAt: string
  cover: string
  coverAlt: string
  category: string
  tags: string[]
  /** Bản tiếng Việt (gốc) */
  vi: ArticleText
  /** Bản tiếng Hàn nhập tay – chuỗi rỗng = chưa dịch */
  ko: ArticleText
  isSample?: boolean
}

export const TEXT_KEYS: (keyof ArticleText)[] = ['title', 'excerpt', 'body', 'metaTitle', 'metaDescription']

const baseItems: Article[] = published.news ?? newsSeed

interface NewsState {
  items: Article[]
  add: (a?: Partial<Article>) => string
  update: (id: string, patch: Partial<Article>) => void
  updateText: (id: string, lang: Lang, key: keyof ArticleText, value: string) => void
  remove: (id: string) => void
  clearSamples: () => void
  reset: () => void
}

const blankText = (): ArticleText => ({ title: '', excerpt: '', body: '', metaTitle: '', metaDescription: '' })

export const useNewsStore = create<NewsState>()(
  persist(
    (set) => ({
      items: baseItems,
      add: (a) => {
        const id = uid('news')
        const now = new Date().toISOString()
        const item: Article = {
          id,
          slug: '',
          status: 'draft',
          publishedAt: now,
          updatedAt: now,
          cover: '',
          coverAlt: '',
          category: '',
          tags: [],
          vi: blankText(),
          ko: blankText(),
          ...a,
        }
        set((s) => ({ items: [item, ...s.items] }))
        return id
      },
      update: (id, patch) =>
        set((s) => ({ items: s.items.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: new Date().toISOString() } : x)) })),
      updateText: (id, lang, key, value) =>
        set((s) => ({
          items: s.items.map((x) =>
            x.id === id ? { ...x, [lang]: { ...x[lang], [key]: value }, updatedAt: new Date().toISOString() } : x,
          ),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
      clearSamples: () => set((s) => ({ items: s.items.filter((x) => !x.isSample) })),
      reset: () => set({ items: baseItems }),
    }),
    { name: 'antin.news.v1', version: 1, storage: adminWriteStorage },
  ),
)

/** Bài đã đăng (không phải nháp, ngày đăng không ở tương lai), mới nhất trước. */
export function selectPublished(items: Article[]): Article[] {
  const now = Date.now()
  return items
    .filter((a) => a.status === 'published' && a.slug && new Date(a.publishedAt).getTime() <= now + 60_000)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

/** Văn bản bài viết theo ngôn ngữ; trường tiếng Hàn trống thì lấy tiếng Việt. */
export function articleText(a: Article, lang: Lang): ArticleText {
  if (lang === 'vi') return a.vi
  const out = { ...a.vi }
  for (const k of TEXT_KEYS) if (a.ko[k]?.trim()) out[k] = a.ko[k]
  return out
}

export const makeSlug = (title: string) => slugify(title)

/** Nhãn chuyên mục theo ngôn ngữ (chuyên mục lạ → giữ nguyên tiếng Việt). */
const CATEGORY_KO: Record<string, string> = {
  'Lộ trình': '로드맵',
  'Chương trình': '프로그램',
  'Học viên': '학생 이야기',
  'Tin tức': '뉴스',
  'Kinh nghiệm': '유학 경험',
  'Visa': '비자',
  'Trường học': '학교 소개',
}
export const categoryLabel = (c: string, lang: Lang) => (lang === 'ko' ? CATEGORY_KO[c] ?? c : c)
