/* eslint-disable @typescript-eslint/no-explicit-any */

/** Đọc giá trị theo đường dẫn "a.b.0.c". */
export function getIn(obj: any, path: string): any {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), obj)
}

/** Ghi giá trị theo đường dẫn, trả về bản sao mới (immutable). Hỗ trợ chỉ số mảng. */
export function setIn<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.')
  const rec = (node: any, i: number): any => {
    const key = keys[i]
    const copy: any = Array.isArray(node) ? [...node] : { ...(node ?? {}) }
    copy[key] = i === keys.length - 1 ? value : rec(node?.[key], i + 1)
    return copy
  }
  return rec(obj, 0)
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

/**
 * Trộn nội dung đã lưu (localStorage) lên nội dung gốc.
 * Trường mới thêm vào initialContent vẫn xuất hiện dù dữ liệu cũ chưa có.
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : override) as T
  }
  const out: Record<string, unknown> = { ...base }
  for (const key of Object.keys(override)) {
    out[key] = key in base ? deepMerge((base as any)[key], (override as any)[key]) : (override as any)[key]
  }
  return out as T
}

let counter = 0
export function uid(prefix = 'id'): string {
  counter += 1
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}${Math.random().toString(36).slice(2, 5)}`
}

export function formatDate(iso: string, locale: 'vi' | 'ko' = 'vi'): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** Số điện thoại → chỉ giữ chữ số (dùng cho href tel:). */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/** Nén ảnh người dùng tải lên thành JPEG data URL nhẹ (để lưu localStorage). */
export function compressImage(file: File, maxSide = 1200, quality = 0.8): Promise<{ src: string; ar: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Không đọc được file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('File không phải ảnh hợp lệ'))
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Trình duyệt không hỗ trợ canvas'))
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve({ src: canvas.toDataURL('image/jpeg', quality), ar: canvas.width / canvas.height })
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}
