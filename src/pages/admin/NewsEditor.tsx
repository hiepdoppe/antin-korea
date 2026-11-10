import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/admin/PageHeader'
import { ConfirmButton } from '@/components/ui/ConfirmButton'
import { Field, inputClass } from '@/components/ui/Field'
import { Tabs } from '@/components/ui/Tabs'
import { ASSETS } from '@/constants/assets'
import { ROUTES } from '@/constants/routes'
import type { Lang } from '@/lib/i18n'
import { slugify } from '@/lib/slug'
import { useNewsStore, type ArticleText } from '@/store/newsStore'
import { toast } from '@/store/toastStore'

const SITE = ((import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://ten-mien-cua-ban.vn').replace(/\/$/, '')

function flatten(o: unknown, trail: string[] = []): { label: string; url: string }[] {
  if (typeof o === 'string') return [{ label: trail.join(' › '), url: o }]
  if (o && typeof o === 'object') return Object.entries(o).flatMap(([k, v]) => flatten(v, [...trail, k]))
  return []
}
const ASSET_OPTIONS = flatten(ASSETS).filter((a) => /\.(jpe?g|png|webp)$/i.test(a.url))

const toLocalInput = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const off = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - off).toISOString().slice(0, 16)
}

let timer: number | undefined
function notifySaved() {
  window.clearTimeout(timer)
  timer = window.setTimeout(() => toast.success('Đã lưu bài viết', undefined, { id: 'news-saved', duration: 2000 }), 700)
}

const FIELDS: { key: keyof ArticleText; label: string; area?: boolean; rows?: number; limit?: number; hint?: string }[] = [
  { key: 'title', label: 'Tiêu đề bài viết (H1)' },
  { key: 'excerpt', label: 'Tóm tắt (hiện ở danh sách và đầu bài)', area: true, rows: 3 },
  {
    key: 'body',
    label: 'Nội dung',
    area: true,
    rows: 18,
    hint: 'Cách viết: dòng trống = đoạn mới · “## Tiêu đề phụ” · “### Tiêu đề nhỏ” · các dòng bắt đầu bằng “- ” = danh sách. Không dùng HTML.',
  },
  { key: 'metaTitle', label: 'SEO – Tiêu đề Google (để trống = dùng tiêu đề bài)', limit: 60 },
  { key: 'metaDescription', label: 'SEO – Mô tả Google (để trống = dùng tóm tắt)', area: true, rows: 3, limit: 160 },
]

export default function NewsEditor() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const items = useNewsStore((s) => s.items)
  const a = items.find((x) => x.id === id)
  const update = useNewsStore((s) => s.update)
  const updateText = useNewsStore((s) => s.updateText)
  const remove = useNewsStore((s) => s.remove)
  const [lang, setLang] = useState<Lang>('vi')

  const categories = useMemo(() => Array.from(new Set(items.map((x) => x.category).filter(Boolean))), [items])
  if (!a) return <Navigate to="/admin/news" replace />

  const dup = items.some((x) => x.id !== a.id && x.slug === a.slug && a.slug)
  const text = a[lang]
  const set = (patch: Parameters<typeof update>[1]) => {
    update(a.id, patch)
    notifySaved()
  }
  const setText = (key: keyof ArticleText, v: string) => {
    updateText(a.id, lang, key, v)
    notifySaved()
  }
  const previewTitle = (lang === 'ko' && a.ko.metaTitle) || a.vi.metaTitle || (lang === 'ko' && a.ko.title) || a.vi.title
  const previewDesc = (lang === 'ko' && a.ko.metaDescription) || a.vi.metaDescription || (lang === 'ko' && a.ko.excerpt) || a.vi.excerpt

  return (
    <>
      <PageHeader
        title={a.vi.title || 'Bài viết mới'}
        description="Mọi thay đổi tự lưu. Bài chỉ hiện ra website khi trạng thái là “Đã đăng”."
        actions={
          <>
            <Link to="/admin/news" className="text-sm font-semibold text-navy-600 hover:text-navy-900">
              ← Danh sách
            </Link>
            {a.slug && (
              <a href={`${lang === 'ko' ? '/ko' : ''}${ROUTES.news}/${a.slug}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-gold-700 hover:text-gold-800">
                Mở bài ↗
              </a>
            )}
          </>
        }
      />

      <div className="mb-6">
        <Tabs
          ariaLabel="Ngôn ngữ bài viết"
          layoutId="news-lang"
          value={lang}
          onChange={setLang}
          items={[
            { id: 'vi', label: 'Tiếng Việt (gốc)' },
            { id: 'ko', label: '한국어 – dịch tay' },
          ]}
        />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <section className="min-w-0 space-y-5 rounded-2xl border border-navy-100 bg-white p-5 shadow-card sm:p-7">
          {lang === 'vi' && (
            <Field
              label="Đường dẫn (slug)"
              htmlFor="n-slug"
              error={dup ? 'Đường dẫn này đã có bài khác dùng.' : undefined}
              hint="Chỉ gồm chữ thường không dấu, số và dấu gạch ngang. Đổi đường dẫn của bài đã đăng sẽ làm đổi URL trên Google."
            >
              <div className="flex gap-2">
                <input id="n-slug" className={inputClass(dup ? 'x' : undefined)} value={a.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} />
                <button
                  type="button"
                  onClick={() => set({ slug: slugify(a.vi.title) })}
                  className="shrink-0 rounded-xl border border-navy-200 px-3 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50"
                >
                  Tạo từ tiêu đề
                </button>
              </div>
            </Field>
          )}

          {FIELDS.map((f) => {
            const fid = `n-${lang}-${f.key}`
            const val = text[f.key]
            const hint = [f.hint, f.limit ? `${val.length}/${f.limit} ký tự${val.length > f.limit ? ' – dài hơn mức khuyến nghị' : ''}` : ''].filter(Boolean).join(' ')
            return (
              <Field key={fid} label={f.label} htmlFor={fid} hint={hint || undefined}>
                {lang === 'ko' && (
                  <p lang="vi" className="mb-1.5 max-h-32 overflow-y-auto whitespace-pre-line rounded-lg bg-navy-50 px-3 py-2 text-xs leading-relaxed text-navy-600">
                    <b className="mr-1 text-navy-400">VI</b>
                    {a.vi[f.key] || '—'}
                  </p>
                )}
                {f.area ? (
                  <textarea
                    id={fid}
                    lang={lang}
                    rows={f.rows ?? 3}
                    className={inputClass(undefined, f.key === 'body' ? 'font-mono text-[13px] leading-relaxed' : undefined)}
                    value={val}
                    placeholder={lang === 'ko' ? 'Chưa dịch – bài tiếng Hàn đang hiển thị tiếng Việt' : undefined}
                    onChange={(e) => setText(f.key, e.target.value)}
                  />
                ) : (
                  <input
                    id={fid}
                    lang={lang}
                    className={inputClass()}
                    value={val}
                    placeholder={lang === 'ko' ? 'Chưa dịch – bài tiếng Hàn đang hiển thị tiếng Việt' : undefined}
                    onChange={(e) => setText(f.key, e.target.value)}
                  />
                )}
              </Field>
            )
          })}

          <div className="rounded-xl border border-navy-100 bg-ivory p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-400">Xem trước trên Google</p>
            <p className="mt-2 truncate text-xs text-emerald-700">
              {SITE}
              {lang === 'ko' ? '/ko' : ''}
              {ROUTES.news}/{a.slug || '…'}
            </p>
            <p className="mt-0.5 line-clamp-1 text-lg text-blue-700">{previewTitle || 'Tiêu đề bài viết'}</p>
            <p className="line-clamp-2 text-sm text-navy-600">{previewDesc || 'Mô tả bài viết…'}</p>
          </div>
        </section>

        <aside className="space-y-5 rounded-2xl border border-navy-100 bg-white p-5 shadow-card xl:sticky xl:top-6">
          <Field label="Trạng thái" htmlFor="n-status">
            <select id="n-status" className={inputClass()} value={a.status} onChange={(e) => set({ status: e.target.value as 'draft' | 'published' })}>
              <option value="draft">Bản nháp (chưa hiện)</option>
              <option value="published">Đã đăng</option>
            </select>
          </Field>
          <Field label="Ngày đăng" htmlFor="n-date" hint="Đặt ngày ở tương lai để hẹn giờ hiển thị.">
            <input id="n-date" type="datetime-local" className={inputClass()} value={toLocalInput(a.publishedAt)} onChange={(e) => e.target.value && set({ publishedAt: new Date(e.target.value).toISOString() })} />
          </Field>
          <Field label="Chuyên mục" htmlFor="n-cat">
            <input id="n-cat" list="n-cats" className={inputClass()} value={a.category} onChange={(e) => set({ category: e.target.value })} />
            <datalist id="n-cats">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Thẻ (phân cách bằng dấu phẩy)" htmlFor="n-tags">
            <input
              id="n-tags"
              className={inputClass()}
              defaultValue={a.tags.join(', ')}
              onBlur={(e) => set({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            />
          </Field>

          <div>
            <Field label="Ảnh bìa (chọn ảnh có sẵn)" htmlFor="n-cover">
              <select id="n-cover" className={inputClass()} value={ASSET_OPTIONS.some((o) => o.url === a.cover) ? a.cover : ''} onChange={(e) => set({ cover: e.target.value })}>
                <option value="">— Không / dùng đường dẫn bên dưới —</option>
                {ASSET_OPTIONS.map((o) => (
                  <option key={o.url} value={o.url}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="hoặc đường dẫn ảnh" htmlFor="n-cover-url" className="mt-3" hint="Chép ảnh vào public/assets/news/ rồi nhập /assets/news/ten-anh.jpg">
              <input id="n-cover-url" className={inputClass()} value={a.cover} onChange={(e) => set({ cover: e.target.value.trim() })} />
            </Field>
            <Field label="Mô tả ảnh (alt)" htmlFor="n-alt" className="mt-3">
              <input id="n-alt" className={inputClass()} value={a.coverAlt} onChange={(e) => set({ coverAlt: e.target.value })} />
            </Field>
            {a.cover && (
              <div className="mt-3 aspect-[16/9] overflow-hidden rounded-xl border border-navy-100 bg-navy-50">
                <img src={a.cover} alt="" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <ConfirmButton
            size="sm"
            className="w-full"
            confirmLabel="Bấm lần nữa để xóa bài"
            onConfirm={() => {
              remove(a.id)
              toast.info('Đã xóa bài viết')
              navigate('/admin/news')
            }}
          >
            Xóa bài viết
          </ConfirmButton>
        </aside>
      </div>
    </>
  )
}
