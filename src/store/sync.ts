import { useContentStore } from './contentStore'
import { useGalleryStore } from './galleryStore'
import { useLeadsStore } from './leadsStore'
import { useNewsStore } from './newsStore'
import { useUniversitiesStore } from './universitiesStore'

const stores: Record<string, { persist: { rehydrate: () => unknown } }> = {
  'antin.content.v1': useContentStore,
  'antin.gallery.v1': useGalleryStore,
  'antin.leads.v1': useLeadsStore,
  'antin.news.v1': useNewsStore,
  'antin.universities.v1': useUniversitiesStore,
}

/**
 * Đồng bộ giữa các tab/iframe cùng origin: khi admin sửa nội dung ở một tab,
 * trang chủ (hoặc khung xem trước trong /admin/content) cập nhật ngay.
 */
export function setupCrossTabSync(): void {
  window.addEventListener('storage', (e) => {
    if (e.key && stores[e.key]) void stores[e.key].persist.rehydrate()
  })
}
