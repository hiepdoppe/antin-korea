import { useRef, useState } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/Button'
import { ConfirmButton } from '@/components/ui/ConfirmButton'
import type { PublishedData } from '@/data/published'
import { deepMerge } from '@/lib/utils'
import { baseContent, baseKo, useContentStore } from '@/store/contentStore'
import { useGalleryStore } from '@/store/galleryStore'
import { useLeadsStore } from '@/store/leadsStore'
import { useNewsStore } from '@/store/newsStore'
import { toast } from '@/store/toastStore'
import { useUniversitiesStore } from '@/store/universitiesStore'

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

function snapshot(): PublishedData {
  return {
    content: useContentStore.getState().content,
    ko: useContentStore.getState().ko,
    news: useNewsStore.getState().items,
    universities: useUniversitiesStore.getState().items,
    gallery: useGalleryStore.getState().items,
  }
}

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`

export default function Publish() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [size, setSize] = useState<number | null>(null)

  const exportJson = () => {
    const json = JSON.stringify(snapshot(), null, 2)
    setSize(json.length)
    download('published.json', json, 'application/json')
    toast.success('Đã tải published.json', 'Đặt file vào src/data/ rồi build lại website.')
  }

  const exportLeads = () => {
    const rows = useLeadsStore.getState().leads
    const head = ['Họ tên', 'SĐT/Zalo', 'Năm sinh', 'GPA', 'Trường mong muốn', 'Chương trình', 'Trạng thái', 'Ghi chú', 'Ngày']
    const lines = rows.map((l) => [l.name, l.phone, l.birthYear, l.gpa, l.targetSchool, l.program, l.status, l.note, l.createdAt].map(csvCell).join(','))
    download('hoc-vien.csv', '﻿' + [head.map(csvCell).join(','), ...lines].join('\n'), 'text/csv;charset=utf-8')
    toast.success(`Đã xuất ${rows.length} học viên`)
  }

  const importJson = async (file: File | undefined) => {
    if (!file) return
    try {
      const d = JSON.parse(await file.text()) as PublishedData
      if (typeof d !== 'object' || d === null) throw new Error('bad')
      if (d.content) useContentStore.setState({ content: deepMerge(baseContent, d.content) })
      if (d.ko) useContentStore.setState({ ko: { ...baseKo, ...d.ko } })
      if (Array.isArray(d.news)) useNewsStore.setState({ items: d.news })
      if (Array.isArray(d.universities)) useUniversitiesStore.setState({ items: d.universities })
      if (Array.isArray(d.gallery)) useGalleryStore.setState({ items: d.gallery })
      toast.success('Đã nạp dữ liệu từ file', file.name)
    } catch {
      toast.error('File không hợp lệ', 'Hãy chọn file published.json đã tải từ trang này.')
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const clearDrafts = () => {
    ;['antin.content.v1', 'antin.news.v1', 'antin.universities.v1', 'antin.gallery.v1'].forEach((k) => {
      try {
        localStorage.removeItem(k)
      } catch {
        /* noop */
      }
    })
    window.location.reload()
  }

  return (
    <>
      <PageHeader title="Xuất bản & sao lưu" description="Đưa nội dung bạn vừa chỉnh sửa lên website thật, và sao lưu dữ liệu." />

      <div className="grid max-w-3xl gap-5">
        <section className="rounded-2xl border border-gold-200 bg-gradient-to-b from-white to-gold-50 p-6 shadow-card">
          <h2 className="font-display text-xl text-navy-900">Xuất bản nội dung lên website</h2>
          <p className="mt-2 text-sm leading-relaxed text-navy-600">
            Website hiện chưa có máy chủ, nên các chỉnh sửa ở trang quản trị chỉ nằm trong trình duyệt này. Khách truy cập (và Google) chỉ thấy nội dung nằm trong file{' '}
            <code className="rounded bg-white px-1">src/data/published.json</code>.
          </p>
          <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-navy-700">
            <li>Bấm “Tải published.json” bên dưới.</li>
            <li>Chép file vào thư mục <code className="rounded bg-white px-1">src/data/</code> (ghi đè file cũ).</li>
            <li>
              Chạy <code className="rounded bg-white px-1">npm run build</code> rồi đưa thư mục <code className="rounded bg-white px-1">dist/</code> lên hosting.
            </li>
          </ol>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button onClick={exportJson}>Tải published.json</Button>
            {size !== null && <span className="text-xs text-navy-500">{Math.round(size / 1024)} KB{size > 1_000_000 ? ' – khá lớn, hãy bớt ảnh tải lên trong Thư viện ảnh' : ''}</span>}
          </div>
        </section>

        <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg text-navy-900">Nạp lại từ file</h2>
          <p className="mt-1 text-sm text-navy-500">Khôi phục nội dung từ một file published.json đã sao lưu.</p>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => void importJson(e.target.files?.[0])} />
          <Button className="mt-4" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            Chọn file…
          </Button>
        </section>

        <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg text-navy-900">Danh sách học viên</h2>
          <p className="mt-1 text-sm text-navy-500">Tải về dạng CSV (mở được bằng Excel). Dữ liệu học viên không nằm trong published.json vì là thông tin riêng tư.</p>
          <Button className="mt-4" variant="outline" size="sm" onClick={exportLeads}>
            Xuất CSV học viên
          </Button>
        </section>

        <section className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg text-navy-900">Xóa bản nháp trong trình duyệt này</h2>
          <p className="mt-1 text-sm text-navy-500">
            Sau khi đã xuất bản, hãy xóa nháp để trình duyệt này hiển thị đúng bản vừa deploy. Mọi chỉnh sửa chưa xuất file sẽ mất.
          </p>
          <ConfirmButton className="mt-4" size="sm" confirmLabel="Bấm lần nữa để xóa nháp" onConfirm={clearDrafts}>
            Xóa bản nháp
          </ConfirmButton>
        </section>
      </div>
    </>
  )
}
