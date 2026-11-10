import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/Button'
import { ConfirmButton } from '@/components/ui/ConfirmButton'
import { Drawer } from '@/components/ui/Drawer'
import { Field, inputClass } from '@/components/ui/Field'
import { Switch } from '@/components/ui/Switch'
import { ASSETS, UNIVERSITY_LOGO_OPTIONS, UNIVERSITY_PHOTO_OPTIONS } from '@/constants/assets'
import { toast } from '@/store/toastStore'
import { REGION_LABEL, useUniversitiesStore, type Region, type University } from '@/store/universitiesStore'

type Draft = Omit<University, 'id'>

const blank: Draft = {
  nameEn: '',
  nameKo: '',
  city: '',
  cityKo: '',
  region: 'seoul',
  d4: true,
  d2: true,
  logoKey: '',
  photoKey: '',
  tuition: '',
  note: '',
  noteKo: '',
  featured: false,
}

function UniversityForm({ item, onDone }: { item: University | null; onDone: () => void }) {
  const add = useUniversitiesStore((s) => s.add)
  const update = useUniversitiesStore((s) => s.update)
  const remove = useUniversitiesStore((s) => s.remove)
  const [d, setD] = useState<Draft>(() => (item ? { ...blank, ...item } : blank))
  const [error, setError] = useState('')
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((s) => ({ ...s, [k]: v }))

  const logo = d.logoKey ? ASSETS.universities.logos[d.logoKey] : undefined

  const save = () => {
    if (d.nameEn.trim().length < 2) {
      setError('Vui lòng nhập tên trường.')
      return
    }
    const clean: Draft = {
      ...d,
      nameEn: d.nameEn.trim(),
      nameKo: d.nameKo?.trim() || undefined,
      city: d.city.trim(),
      logoKey: d.logoKey || undefined,
      photoKey: d.photoKey || undefined,
      tuition: d.tuition?.trim() || undefined,
      note: d.note?.trim() || undefined,
      cityKo: d.cityKo?.trim() || undefined,
      noteKo: d.noteKo?.trim() || undefined,
    }
    if (item) {
      update(item.id, clean)
      toast.success('Đã cập nhật trường', clean.nameEn)
    } else {
      add(clean)
      toast.success('Đã thêm trường đối tác', clean.nameEn)
    }
    onDone()
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
      className="space-y-4"
    >
      <Field label="Tên trường (tiếng Anh)" htmlFor="u-en" required error={error}>
        <input id="u-en" data-autofocus className={inputClass(error)} value={d.nameEn} onChange={(e) => { set('nameEn', e.target.value); setError('') }} />
      </Field>
      <Field label="Tên tiếng Hàn" htmlFor="u-ko">
        <input id="u-ko" className={inputClass()} value={d.nameKo ?? ''} onChange={(e) => set('nameKo', e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Thành phố" htmlFor="u-city">
          <input id="u-city" className={inputClass()} value={d.city} onChange={(e) => set('city', e.target.value)} />
        </Field>
        <Field label="Khu vực (để lọc)" htmlFor="u-region">
          <select id="u-region" className={inputClass()} value={d.region} onChange={(e) => set('region', e.target.value as Region)}>
            {(Object.keys(REGION_LABEL) as Region[]).map((r) => (
              <option key={r} value={r}>
                {REGION_LABEL[r]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-3 rounded-xl bg-navy-50/70 p-4 sm:grid-cols-3">
        <label className="flex items-center justify-between gap-3 text-sm font-medium text-navy-800 sm:flex-col sm:items-start">
          Hệ tiếng D-4-1
          <Switch checked={d.d4} onChange={(v) => set('d4', v)} label="Hệ tiếng D-4-1" />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm font-medium text-navy-800 sm:flex-col sm:items-start">
          Chuyên ngành D-2
          <Switch checked={d.d2} onChange={(v) => set('d2', v)} label="Chuyên ngành D-2" />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm font-medium text-navy-800 sm:flex-col sm:items-start">
          Nổi bật
          <Switch checked={d.featured} onChange={(v) => set('featured', v)} label="Trường nổi bật" />
        </label>
      </div>

      <Field label="Học phí dự kiến" htmlFor="u-tuition" hint="Để trống nếu chưa có số liệu – thẻ trường sẽ không hiện dòng học phí.">
        <input id="u-tuition" className={inputClass()} value={d.tuition ?? ''} onChange={(e) => set('tuition', e.target.value)} placeholder="Ví dụ: 4.000.000 – 5.000.000 KRW / học kỳ" />
      </Field>
      <Field label="Ghi chú hiển thị" htmlFor="u-note">
        <textarea id="u-note" rows={2} className={inputClass()} value={d.note ?? ''} onChange={(e) => set('note', e.target.value)} />
      </Field>

      <fieldset className="grid gap-4 rounded-xl border border-navy-100 p-4 sm:grid-cols-2">
        <legend className="px-1 text-xs font-bold uppercase tracking-wider text-gold-700">한국어 – dịch tay (trống = dùng tiếng Việt)</legend>
        <Field label="Thành phố (KO)" htmlFor="u-city-ko">
          <input id="u-city-ko" lang="ko" className={inputClass()} value={d.cityKo ?? ''} onChange={(e) => set('cityKo', e.target.value)} />
        </Field>
        <Field label="Ghi chú hiển thị (KO)" htmlFor="u-note-ko">
          <input id="u-note-ko" lang="ko" className={inputClass()} value={d.noteKo ?? ''} onChange={(e) => set('noteKo', e.target.value)} />
        </Field>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Logo trường" htmlFor="u-logo">
          <select id="u-logo" className={inputClass()} value={d.logoKey ?? ''} onChange={(e) => set('logoKey', e.target.value)}>
            <option value="">Không có logo</option>
            {UNIVERSITY_LOGO_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.key}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ảnh buổi làm việc" htmlFor="u-photo">
          <select id="u-photo" className={inputClass()} value={d.photoKey ?? ''} onChange={(e) => set('photoKey', e.target.value)}>
            <option value="">Không có ảnh</option>
            {UNIVERSITY_PHOTO_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.key}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {logo && <img src={logo} alt="Xem trước logo" className="h-20 rounded-xl border border-navy-100 bg-white object-contain p-2" />}

      <div className="sticky bottom-0 -mx-5 -mb-5 flex items-center justify-between gap-2 border-t border-navy-100 bg-white px-5 py-3">
        {item ? (
          <ConfirmButton
            size="sm"
            confirmLabel="Bấm lần nữa để xóa"
            onConfirm={() => {
              remove(item.id)
              toast.info('Đã xóa trường', item.nameEn)
              onDone()
            }}
          >
            Xóa
          </ConfirmButton>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onDone}>
            Hủy
          </Button>
          <Button type="submit" size="sm">
            {item ? 'Lưu thay đổi' : 'Thêm trường'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default function Universities() {
  const items = useUniversitiesStore((s) => s.items)
  const reset = useUniversitiesStore((s) => s.reset)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState<University | null>(null)

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return items
    return items.filter((u) => [u.nameEn, u.nameKo ?? '', u.city].some((v) => v.toLowerCase().includes(needle)))
  }, [items, q])

  const openItem = (u: University | null) => {
    setTarget(u)
    setOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Quản lý Trường Đối tác"
        description="Thêm, sửa, xóa trường; chọn logo và ảnh buổi làm việc; đặt học phí dự kiến. Bộ lọc ở trang chủ dùng khu vực và hệ đào tạo tại đây."
        actions={
          <>
            <ConfirmButton
              size="sm"
              confirmLabel="Bấm lần nữa để khôi phục"
              onConfirm={() => {
                reset()
                toast.info('Đã khôi phục danh sách 18 trường gốc')
              }}
            >
              Khôi phục danh sách gốc
            </ConfirmButton>
            <Button size="sm" onClick={() => openItem(null)}>
              + Thêm trường
            </Button>
          </>
        }
      />

      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên trường, thành phố…" aria-label="Tìm trường" className="input mb-5 max-w-sm" />

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-navy-50/70 text-xs uppercase tracking-wider text-navy-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Trường</th>
                <th className="px-4 py-3 font-semibold">Thành phố / Khu vực</th>
                <th className="px-4 py-3 font-semibold">Hệ đào tạo</th>
                <th className="px-4 py-3 font-semibold">Học phí dự kiến</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {filtered.map((u) => {
                const logo = u.logoKey ? ASSETS.universities.logos[u.logoKey] : undefined
                return (
                  <tr
                    key={u.id}
                    tabIndex={0}
                    onClick={() => openItem(u)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openItem(u)
                      }
                    }}
                    className="cursor-pointer transition-colors duration-150 hover:bg-gold-50/60 focus-visible:bg-gold-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-navy-100 bg-white">
                          {logo ? <img src={logo} alt="" className="max-h-8 max-w-[3rem] object-contain" /> : <span className="text-xs font-bold text-navy-300">—</span>}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-navy-900">
                            {u.nameEn} {u.featured && <span className="ml-1 text-gold-500" title="Nổi bật">★</span>}
                          </p>
                          {u.nameKo && <p className="text-xs text-navy-400">{u.nameKo}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-navy-600">
                      {u.city} · {REGION_LABEL[u.region]}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.d4 && <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[11px] font-semibold text-sky-800">D-4-1</span>}
                        {u.d2 && <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-800">D-2</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-navy-600">{u.tuition || <span className="text-navy-300">Chưa nhập</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="px-4 py-12 text-center text-sm text-navy-400">Không có trường nào khớp.</p>}
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={target ? target.nameEn : 'Thêm trường đối tác'}
        subtitle={target?.nameKo}
      >
        <UniversityForm key={target?.id ?? 'new'} item={target} onDone={() => setOpen(false)} />
      </Drawer>
    </>
  )
}
