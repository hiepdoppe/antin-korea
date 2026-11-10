import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/admin/PageHeader'
import { initialContent } from '@/data/initialContent'
import { useContentStore } from '@/store/contentStore'
import { useNewsStore } from '@/store/newsStore'
import { buildPages } from './pageDefs'

function Bar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-32 overflow-hidden rounded-full bg-navy-100 sm:w-48" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full origin-left rounded-full bg-gradient-to-r from-gold-400 to-gold-500 transition-transform duration-300 ease-out" style={{ transform: `scaleX(${pct / 100})`, width: '100%' }} />
      </div>
      <span className="text-xs font-semibold tabular-nums text-navy-600">
        {done}/{total} · {pct}%
      </span>
    </div>
  )
}

export default function Translations() {
  const ko = useContentStore((s) => s.ko)
  const news = useNewsStore((s) => s.items)
  const pages = useMemo(() => buildPages(initialContent), [])

  const rows = pages.map((p) => {
    const fields = p.groups.flatMap((g) => g.fields)
    return { id: p.id, title: p.title, total: fields.length, done: fields.filter((f) => ko[f.path]?.trim()).length }
  })
  const published = news.filter((a) => a.status === 'published')
  const newsDone = published.filter((a) => a.ko.title.trim() && a.ko.body.trim()).length

  return (
    <>
      <PageHeader
        title="Dịch thuật Việt – Hàn"
        description="Tiếng Việt là bản gốc. Bạn dịch tay từng trang và từng bài viết; chỗ chưa dịch, trang tiếng Hàn tự hiển thị tiếng Việt."
      />

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-50/70 text-xs uppercase tracking-wider text-navy-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Trang</th>
              <th className="px-4 py-3 font-semibold">Tiến độ dịch</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-semibold text-navy-900">{r.title}</td>
                <td className="px-4 py-3">
                  <Bar done={r.done} total={r.total} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/admin/pages/${r.id}`} className="font-semibold text-gold-700 hover:text-gold-800">
                    Dịch →
                  </Link>
                </td>
              </tr>
            ))}
            <tr>
              <td className="px-4 py-3 font-semibold text-navy-900">Bài viết đã đăng</td>
              <td className="px-4 py-3">
                <Bar done={newsDone} total={published.length} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link to="/admin/news" className="font-semibold text-gold-700 hover:text-gold-800">
                  Dịch →
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-navy-500">
        Các nhãn giao diện, tiêu đề mục và SEO đã có bản dịch nháp; nội dung dài (thư ngỏ, chương trình, bài viết…) để trống cho bạn dịch. Nên nhờ người bản ngữ rà soát bản nháp trước khi công bố.
        Chú thích ảnh, thành phố và ghi chú của từng trường dịch trong “Thư viện ảnh” và “Danh sách trường”.
      </p>
    </>
  )
}
