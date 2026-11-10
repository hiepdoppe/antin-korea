import type { SiteContent } from '@/data/initialContent'

export type Lang = 'vi' | 'ko'
export const KO_PREFIX = '/ko'

/** Lấy ngôn ngữ từ đường dẫn: /ko/... = tiếng Hàn, còn lại = tiếng Việt (bản gốc). */
export function langFromPath(pathname: string): Lang {
  return pathname === KO_PREFIX || pathname.startsWith(`${KO_PREFIX}/`) ? 'ko' : 'vi'
}

/** Bỏ tiền tố ngôn ngữ: /ko/tin-tuc → /tin-tuc */
export function stripLang(pathname: string): string {
  if (pathname === KO_PREFIX) return '/'
  return pathname.startsWith(`${KO_PREFIX}/`) ? pathname.slice(KO_PREFIX.length) : pathname
}

/** Thêm tiền tố ngôn ngữ vào đường dẫn nội bộ. */
export function withLang(path: string, lang: Lang): string {
  if (lang === 'vi') return path
  return path === '/' ? KO_PREFIX : `${KO_PREFIX}${path}`
}

/** Thay {n}, {total}… trong chuỗi nhãn. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''))
}

/**
 * Áp bản dịch lên nội dung: với mỗi chuỗi tại đường dẫn p, nếu ko[p] có chữ thì dùng, nếu không giữ tiếng Việt.
 * Mảng dùng chỉ số: "roadmap.steps.0.title".
 */
export function localize<T>(node: T, ko: Record<string, string>, prefix = ''): T {
  if (typeof node === 'string') {
    const t = ko[prefix]
    return (t && t.trim() ? t : node) as T
  }
  if (Array.isArray(node)) return node.map((v, i) => localize(v, ko, prefix ? `${prefix}.${i}` : String(i))) as T
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      out[k] = localize(v, ko, prefix ? `${prefix}.${k}` : k)
    }
    return out as T
  }
  return node
}

export function localizeContent(content: SiteContent, ko: Record<string, string>): SiteContent {
  return localize(content, ko)
}

/** Duyệt mọi chuỗi trong nội dung → [đường dẫn, giá trị]. Dùng để đếm tiến độ dịch. */
export function stringPaths(node: unknown, prefix = ''): [string, string][] {
  if (typeof node === 'string') return [[prefix, node]]
  if (Array.isArray(node)) return node.flatMap((v, i) => stringPaths(v, prefix ? `${prefix}.${i}` : String(i)))
  if (node && typeof node === 'object') {
    return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) => stringPaths(v, prefix ? `${prefix}.${k}` : k))
  }
  return []
}
