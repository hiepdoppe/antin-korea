import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { langFromPath, withLang, type Lang } from '@/lib/i18n'

export function useLang(): Lang {
  return langFromPath(useLocation().pathname)
}

/** Trả về hàm gắn tiền tố ngôn ngữ cho đường dẫn nội bộ: lp('/tin-tuc') → '/ko/tin-tuc' khi đang ở bản Hàn. */
export function useLocalePath(): (path: string) => string {
  const lang = useLang()
  return useCallback((path: string) => withLang(path, lang), [lang])
}
