import type { PageKey } from '@/data/initialContent'
import { useContent } from './useContent'
import { useSeo } from './useSeo'

/** SEO của một trang tĩnh, lấy từ CMS (seo.<trang>.title / description) theo ngôn ngữ hiện tại. */
export function usePageSeo(key: PageKey, extra?: { jsonLd?: Record<string, unknown> }): void {
  const { seo } = useContent()
  useSeo({ title: seo[key].title, description: seo[key].description, image: '/assets/staff/team-group.jpg', jsonLd: extra?.jsonLd })
}
