import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { initialContent, type SiteContent } from '@/data/initialContent'
import { koDefaults } from '@/data/koDefaults'
import { published } from '@/data/published'
import { deepMerge, setIn } from '@/lib/utils'
import { adminWriteStorage } from './storage'

/** Nội dung nền = dữ liệu gốc + bản đã xuất bản (published.json). */
export const baseContent: SiteContent = deepMerge(initialContent, published.content)
export const baseKo: Record<string, string> = { ...koDefaults, ...(published.ko ?? {}) }

interface ContentState {
  /** Nội dung tiếng Việt (bản gốc) */
  content: SiteContent
  /** Bản dịch tiếng Hàn theo đường dẫn, ví dụ ko["roadmap.steps.0.title"]. Rỗng = chưa dịch → hiện tiếng Việt. */
  ko: Record<string, string>
  /** Ghi một trường tiếng Việt theo đường dẫn, ví dụ "roadmap.steps.0.title". */
  setField: (path: string, value: unknown) => void
  setKo: (path: string, value: string) => void
  resetAll: () => void
  resetSection: (key: keyof SiteContent) => void
  /** Xóa bản dịch của các đường dẫn bắt đầu bằng prefix (về lại bản dịch nháp mặc định). */
  resetKo: (prefix: string) => void
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      content: baseContent,
      ko: baseKo,
      setField: (path, value) => set((s) => ({ content: setIn(s.content, path, value) })),
      setKo: (path, value) => set((s) => ({ ko: { ...s.ko, [path]: value } })),
      resetAll: () => set({ content: baseContent, ko: baseKo }),
      resetSection: (key) => set((s) => ({ content: { ...s.content, [key]: baseContent[key] } })),
      resetKo: (prefix) =>
        set((s) => {
          const next = { ...s.ko }
          for (const k of Object.keys(next)) if (k === prefix || k.startsWith(prefix + '.')) delete next[k]
          for (const [k, v] of Object.entries(baseKo)) if (k === prefix || k.startsWith(prefix + '.')) next[k] = v
          return { ko: next }
        }),
    }),
    {
      name: 'antin.content.v1',
      version: 1,
      storage: adminWriteStorage,
      merge: (persisted, current) => {
        const p = persisted as Partial<ContentState> | undefined
        return {
          ...current,
          content: deepMerge(baseContent, p?.content),
          ko: { ...baseKo, ...(p?.ko ?? {}) },
        }
      },
    },
  ),
)
