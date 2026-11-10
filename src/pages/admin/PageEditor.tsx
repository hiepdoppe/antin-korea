import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/Button'
import { ConfirmButton } from '@/components/ui/ConfirmButton'
import { Field, inputClass } from '@/components/ui/Field'
import { Tabs } from '@/components/ui/Tabs'
import { initialContent } from '@/data/initialContent'
import { cn } from '@/lib/cn'
import { withLang, type Lang } from '@/lib/i18n'
import { getIn } from '@/lib/utils'
import { baseContent, useContentStore } from '@/store/contentStore'
import { toast } from '@/store/toastStore'
import { buildPages, type FieldDef } from './pageDefs'

// Toast "Đã lưu" gộp: gõ liên tục chỉ hiện một toast (cùng id, thay tại chỗ).
let saveTimer: number | undefined
function notifySaved(lang: Lang) {
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    toast.success('Đã lưu thay đổi', lang === 'ko' ? 'Bản dịch tiếng Hàn đã cập nhật.' : 'Trang web được cập nhật ngay.', { id: 'content-saved', duration: 2200 })
  }, 700)
}

function counter(len: number, limit?: number): string | undefined {
  if (!limit) return undefined
  return `${len}/${limit} ký tự${len > limit ? ' – dài hơn mức khuyến nghị, Google có thể cắt bớt' : ''}`
}

function EditableField({ def, lang }: { def: FieldDef; lang: Lang }) {
  const vi = (useContentStore((s) => getIn(s.content, def.path)) as string | undefined) ?? ''
  const ko = useContentStore((s) => s.ko[def.path]) ?? ''
  const setField = useContentStore((s) => s.setField)
  const setKo = useContentStore((s) => s.setKo)
  const id = `cms-${lang}-${def.path}`
  const value = lang === 'ko' ? ko : vi
  const onChange = (v: string) => {
    if (lang === 'ko') setKo(def.path, v)
    else setField(def.path, v)
    notifySaved(lang)
  }
  const common = { id, value, lang, onChange: (e: { target: { value: string } }) => onChange(e.target.value) }

  return (
    <Field label={def.label} htmlFor={id} hint={counter(value.length, def.limit)}>
      {lang === 'ko' && (
        <div className="mb-1.5 flex items-start justify-between gap-3 rounded-lg bg-navy-50 px-3 py-2 text-xs leading-relaxed text-navy-600">
          <span lang="vi">
            <b className="mr-1 text-navy-400">VI</b>
            {vi || '—'}
          </span>
          <button
            type="button"
            onClick={() => onChange(vi)}
            className="shrink-0 rounded-md px-1.5 py-0.5 font-semibold text-gold-700 transition-colors hover:bg-gold-100"
            title="Giữ nguyên (tên riêng, số điện thoại…)"
          >
            Giữ nguyên
          </button>
        </div>
      )}
      {def.area ? (
        <textarea rows={def.rows ?? 3} className={inputClass()} placeholder={lang === 'ko' ? 'Chưa dịch – trang đang hiển thị tiếng Việt' : undefined} {...common} />
      ) : (
        <input className={inputClass()} placeholder={lang === 'ko' ? 'Chưa dịch – trang đang hiển thị tiếng Việt' : undefined} {...common} />
      )}
    </Field>
  )
}

export default function PageEditor() {
  const { page = 'home' } = useParams()
  const defs = useMemo(() => buildPages(initialContent), [])
  const def = defs.find((d) => d.id === page)
  const [lang, setLang] = useState<Lang>('vi')
  const [preview, setPreview] = useState(false)
  const ko = useContentStore((s) => s.ko)
  const setField = useContentStore((s) => s.setField)
  const resetKo = useContentStore((s) => s.resetKo)

  if (!def) return <Navigate to="/admin/pages/home" replace />

  const fields = def.groups.flatMap((g) => g.fields)
  const translated = fields.filter((f) => ko[f.path]?.trim()).length
  const publicUrl = withLang(def.publicPath, lang)

  return (
    <>
      <PageHeader
        title={def.title}
        description={def.hint}
        actions={
          <>
            <Button size="sm" variant={preview ? 'secondary' : 'outline'} className="hidden xl:inline-flex" onClick={() => setPreview((v) => !v)}>
              {preview ? 'Ẩn xem trước' : 'Xem trước trực tiếp'}
            </Button>
            <a href={publicUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-gold-700 hover:text-gold-800">
              Mở trang ↗
            </a>
          </>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Tabs
          ariaLabel="Ngôn ngữ đang chỉnh sửa"
          layoutId="edit-lang"
          value={lang}
          onChange={setLang}
          items={[
            { id: 'vi', label: 'Tiếng Việt (gốc)' },
            { id: 'ko', label: `한국어 – dịch tay (${translated}/${fields.length})` },
          ]}
        />
        {lang === 'ko' && (
          <p className="text-xs text-navy-500">Ô nào để trống thì trang tiếng Hàn sẽ hiển thị tiếng Việt thay thế.</p>
        )}
      </div>

      {def.related && (
        <ul className="mb-6 flex flex-wrap gap-2">
          {def.related.map((r) => (
            <li key={r.to}>
              <Link to={r.to} className="inline-flex rounded-full border border-gold-300 bg-gold-50 px-3.5 py-1.5 text-xs font-semibold text-gold-800 transition-colors hover:bg-gold-100">
                {r.label} →
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className={cn('grid gap-6', preview && 'xl:grid-cols-[minmax(0,1fr)_26rem]')}>
        <section className="min-w-0 max-w-3xl rounded-2xl border border-navy-100 bg-white p-5 shadow-card sm:p-7">
          <div className="space-y-9">
            {def.groups.map((g, gi) => (
              <fieldset key={`${def.id}-${gi}`} className="min-w-0">
                {g.title && <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-gold-700">{g.title}</legend>}
                <div className="grid gap-4">
                  {g.fields.map((f) => (
                    <EditableField key={`${lang}-${f.path}`} def={f} lang={lang} />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-10 border-t border-navy-50 pt-5">
            <ConfirmButton
              size="sm"
              confirmLabel="Bấm lần nữa để khôi phục"
              onConfirm={() => {
                if (lang === 'ko') fields.forEach((f) => resetKo(f.path))
                else fields.forEach((f) => setField(f.path, getIn(baseContent, f.path)))
                toast.info(lang === 'ko' ? 'Đã khôi phục bản dịch nháp' : 'Đã khôi phục nội dung gốc', def.title)
              }}
            >
              {lang === 'ko' ? 'Khôi phục bản dịch của trang này' : 'Khôi phục nội dung gốc của trang này'}
            </ConfirmButton>
          </div>
        </section>

        {preview && (
          <aside className="hidden xl:block">
            <div className="sticky top-6 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-navy-50 px-4 py-2.5 text-xs font-semibold text-navy-500">
                <span>Xem trước: {publicUrl}</span>
                <span className="text-emerald-600">● Trực tiếp</span>
              </div>
              {/* Cùng origin → nhận sự kiện storage và tự cập nhật khi bạn gõ */}
              <iframe key={publicUrl} title="Xem trước trang" src={publicUrl} className="h-[78vh] w-full bg-white" />
            </div>
          </aside>
        )}
      </div>
    </>
  )
}
