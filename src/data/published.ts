import raw from './published.json'
import type { SiteContent } from './initialContent'
import type { Article } from '@/store/newsStore'
import type { GalleryItem } from '@/store/galleryStore'
import type { University } from '@/store/universitiesStore'

/**
 * Bản ĐÃ XUẤT BẢN: file published.json do admin tải về ở /admin/publish rồi đặt vào src/data/ và build lại.
 * Khách truy cập (và công cụ prerender cho SEO) đọc dữ liệu từ đây. Trường nào thiếu thì dùng dữ liệu gốc.
 */
export interface PublishedData {
  content?: unknown // phần ghi đè của SiteContent (tiếng Việt)
  ko?: Record<string, string>
  news?: Article[]
  universities?: University[]
  gallery?: GalleryItem[]
}

export const published = raw as PublishedData
export type { SiteContent }
