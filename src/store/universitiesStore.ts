import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { published } from '@/data/published'
import { adminWriteStorage } from './storage'
import { initialUniversities } from '@/data/universities'
import { uid } from '@/lib/utils'

export type Region = 'seoul' | 'gyeonggi-incheon' | 'other'

export const REGION_LABEL: Record<Region, string> = {
  seoul: 'Seoul',
  'gyeonggi-incheon': 'Gyeonggi / Incheon',
  other: 'Khu vực khác',
}

export interface University {
  id: string
  nameEn: string
  nameKo?: string
  city: string
  /** Bản dịch tiếng Hàn (nhập tay ở admin); trống = dùng tiếng Việt */
  cityKo?: string
  region: Region
  /** Hệ tiếng D-4-1 */
  d4: boolean
  /** Chuyên ngành D-2 */
  d2: boolean
  logoKey?: string
  photoKey?: string
  /** Học phí dự kiến – nhập tay, để trống nếu chưa có số liệu */
  tuition?: string
  note?: string
  noteKo?: string
  featured: boolean
}

interface UniversitiesState {
  items: University[]
  add: (u: Omit<University, 'id'>) => string
  update: (id: string, patch: Partial<University>) => void
  remove: (id: string) => void
  reset: () => void
}

const baseItems: University[] = published.universities ?? initialUniversities

export const useUniversitiesStore = create<UniversitiesState>()(
  persist(
    (set) => ({
      items: baseItems,
      add: (u) => {
        const id = uid('uni')
        set((s) => ({ items: [...s.items, { ...u, id }] }))
        return id
      },
      update: (id, patch) =>
        set((s) => ({ items: s.items.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
      reset: () => set({ items: baseItems }),
    }),
    { name: 'antin.universities.v1', version: 1, storage: adminWriteStorage },
  ),
)
