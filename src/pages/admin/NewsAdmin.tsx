import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/Button'
import { ConfirmButton } from '@/components/ui/ConfirmButton'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/utils'
import { useNewsStore, type Article } from '@/store/newsStore'
import { toast } from '@/store/toastStore'

const koDone = (a: Article) => Boolean(a.ko.title.trim() && a.ko.body.trim())

export default function NewsAdmin() {
  const items = useNewsStore((s) => s.items)
  const add = useNewsStore((s) => s.add)
  const clearSamples = useNewsStore((s) => s.clearSamples)
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const sorted = [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    if (!needle) return sorted
    return sorted.filter((a) => [a.vi.title, a.slug, a.category, a.tags.join(' ')].some((v) => v.toLowerCase().includes(needle)))
  }, [items, q])

  const create = () => {
    const id = add()
    toast.success('Đã tạo bản nháp mới')
    navigate(`/admin/news/${id}`)
  }

  return (
    <>
      <PageHeader
        title="Bài viết (Tin tức)"
        description="Viết bài chuẩn SEO: tiêu đề, đường dẫn, mô tả, ảnh bìa. Mỗi bài có bản tiếng Việt (gốc) và bản tiếng Hàn dịch tay."
        actions={
          <>
            {items.some((a) => a.isSample) && (
              <ConfirmButton
                size="sm"
                confirmLabel="Bấm lần nữa để xóa bài mẫu"
                onConfirm={() => {
                  clearSamples()
                  toast.info('Đã xóa các bài mẫu')
                }}
              >
                Xóa bài mẫu
              </ConfirmButton>
            )}
            <Button size="sm" onClick={create}>
              + Viết bài mới
            </Button>
          </>
        }
      />

      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tiêu đề, đường dẫn, chuyên mục…" aria-label="Tìm bài viết" className="input mb-5 max-w-sm" />

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="bg-navy-50/70 text-xs uppercase tracking-wider text-navy-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Bài viết</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Ngày đăng</th>
                <th className="px-4 py-3 font-semibold">Tiếng Hàn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filtered.map((a) => (
                <tr key={a.id} className="transition-colors duration-150 hover:bg-gold-50/60">
                  <td className="px-4 py-3">
                    <Link to={`/admin/news/${a.id}`} className="font-semibold text-navy-900 hover:text-gold-700">
                      {a.vi.title || <span className="text-navy-400">(chưa đặt tiêu đề)</span>}
                    </Link>
                    {a.isSample && <span className="ml-2 rounded bg-gold-100 px-1.5 py-0.5 text-[10px] font-bold text-gold-800">Mẫu</span>}
                    <p className="text-xs text-navy-400">/tin-tuc/{a.slug || '…'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', a.status === 'published' ? 'bg-emerald-50 text-emerald-800' : 'bg-navy-100 text-navy-600')}>
                      {a.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-navy-600">{formatDate(a.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', koDone(a) ? 'bg-sky-50 text-sky-800' : 'bg-navy-50 text-navy-500')}>
                      {koDone(a) ? 'Đã dịch' : 'Chưa dịch'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="px-4 py-12 text-center text-sm text-navy-400">Chưa có bài viết nào.</p>}
      </div>
    </>
  )
}
