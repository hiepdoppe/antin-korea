import { useMemo } from 'react'
import type { SiteContent } from '@/data/initialContent'
import { localizeContent } from '@/lib/i18n'
import { useContentStore } from '@/store/contentStore'
import { useLang } from './useLang'

/** Nội dung theo ngôn ngữ hiện tại (đường dẫn /ko → tiếng Hàn, thiếu bản dịch thì dùng tiếng Việt). */
export function useContent(): SiteContent {
  const lang = useLang()
  const content = useContentStore((s) => s.content)
  const ko = useContentStore((s) => s.ko)
  return useMemo(() => (lang === 'ko' ? localizeContent(content, ko) : content), [lang, content, ko])
}
