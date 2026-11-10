import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { published } from '@/data/published'
import { adminWriteStorage } from './storage'
import { initialGallery } from '@/data/gallery'
import { uid } from '@/lib/utils'

export type GalleryGroup = 'dorm' | 'study' | 'social'

export const GROUP_LABEL: Record<GalleryGroup, string> = {
  dorm: 'Ký túc xá',
  study: 'Không gian học tập',
  social: 'Học viên thực tế',
}

export interface GalleryItem {
  id: string
  src: string
  group: GalleryGroup
  caption: string
  /** Chú thích tiếng Hàn (nhập tay); trống = dùng tiếng Việt */
  captionKo?: string
  featured: boolean
  visible: boolean
  /** tỉ lệ rộng/cao – giữ chỗ trước khi ảnh tải xong (không nhảy bố cục) */
  ar?: number
  /** true nếu ảnh do admin tải lên (lưu dạng data URL) */
  uploaded?: boolean
}

interface GalleryState {
  items: GalleryItem[]
  update: (id: string, patch: Partial<GalleryItem>) => void
  add: (item: Omit<GalleryItem, 'id'>) => string
  remove: (id: string) => void
  reset: () => void
}

const baseItems: GalleryItem[] = published.gallery ?? initialGallery

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set) => ({
      items: baseItems,
      update: (id, patch) =>
        set((s) => ({ items: s.items.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      add: (item) => {
        const id = uid('img')
        set((s) => ({ items: [{ ...item, id }, ...s.items] }))
        return id
      },
      remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
      reset: () => set({ items: baseItems }),
    }),
    { name: 'antin.gallery.v1', version: 1, storage: adminWriteStorage },
  ),
)

/** Ảnh hiển thị ra trang chủ của một nhóm: ảnh nổi bật trước. */
export function selectVisible(items: GalleryItem[], group: GalleryGroup): GalleryItem[] {
  const list = items.filter((i) => i.group === group && i.visible)
  return [...list.filter((i) => i.featured), ...list.filter((i) => !i.featured)]
}
