/**
 * Định dạng nội dung bài viết đơn giản (không cho phép HTML → an toàn, không cần sanitize):
 *   ## Tiêu đề phụ     ### Tiêu đề nhỏ     - gạch đầu dòng     (dòng trống = đoạn mới)
 */
export type Block =
  | { t: 'h2' | 'h3' | 'p'; text: string }
  | { t: 'ul'; items: string[] }

export function parseBody(body: string): Block[] {
  const blocks: Block[] = []
  for (const chunk of body.replace(/\r\n/g, '\n').split(/\n{2,}/)) {
    const text = chunk.trim()
    if (!text) continue
    const lines = text.split('\n')
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      blocks.push({ t: 'ul', items: lines.map((l) => l.replace(/^\s*[-*]\s+/, '').trim()) })
    } else if (text.startsWith('### ')) {
      blocks.push({ t: 'h3', text: text.slice(4).trim() })
    } else if (text.startsWith('## ')) {
      blocks.push({ t: 'h2', text: text.slice(3).trim() })
    } else {
      blocks.push({ t: 'p', text: lines.join(' ').trim() })
    }
  }
  return blocks
}
