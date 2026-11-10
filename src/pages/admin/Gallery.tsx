import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/Button'
import { ConfirmButton } from '@/components/ui/ConfirmButton'
import { inputClass } from '@/components/ui/Field'
import { Switch } from '@/components/ui/Switch'
import { Tabs } from '@/components/ui/Tabs'
import { SPRING } from '@/lib/motion'
import { compressImage } from '@/lib/utils'
import { GROUP_LABEL, useGalleryStore, type GalleryGroup, type GalleryItem } from '@/store/galleryStore'
import { toast } from '@/store/toastStore'

type Filter = 'all' | GalleryGroup

function Card({ item }: { item: GalleryItem }) {
  const update = useGalleryStore((s) => s.update)
  const remove = useGalleryStore((s) => s.remove)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.14 } }}
      transition={SPRING}
      className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card"
    >
      <div className="relative bg-navy-50" style={{ aspectRatio: '4 / 3' }}>
        <img
          src={item.src}
          alt={item.caption}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover transition-opacity duration-200 ${item.visible ? '' : 'opacity-40'}`}
        />
        {item.featured && <span className="absolute left-2 top-2 rounded-full bg-gold-400 px-2 py-0.5 text-[11px] font-bold text-navy-950">★ Nổi bật</span>}
        {!item.visible && <span className="absolute right-2 top-2 rounded-full bg-navy-900/80 px-2 py-0.5 text-[11px] font-semibold text-white">Đang ẩn</span>}
      </div>
      <div className="space-y-3 p-3.5">
        <input
          aria-label="Chú thích ảnh"
          value={item.caption}
          onChange={(e) => update(item.id, { caption: e.target.value })}
          className={inputClass(undefined, 'py-2 text-sm')}
        />
        <input
          aria-label="Chú thích tiếng Hàn"
          lang="ko"
          placeholder="한국어 캡션 (trống = dùng tiếng Việt)"
          value={item.captionKo ?? ''}
          onChange={(e) => update(item.id, { captionKo: e.target.value })}
          className={inputClass(undefined, 'py-2 text-sm')}
        />
        <select
          aria-label="Nhóm hiển thị"
          value={item.group}
          onChange={(e) => update(item.id, { group: e.target.value as GalleryGroup })}
          className={inputClass(undefined, 'py-2 text-sm')}
        >
          {(Object.keys(GROUP_LABEL) as GalleryGroup[]).map((g) => (
            <option key={g} value={g}>
              {GROUP_LABEL[g]}
            </option>
          ))}
        </select>
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-navy-600">
          <label className="flex items-center gap-2">
            <Switch checked={item.featured} onChange={(v) => update(item.id, { featured: v })} label="Ảnh nổi bật" />
            Nổi bật
          </label>
          <label className="flex items-center gap-2">
            <Switch checked={item.visible} onChange={(v) => update(item.id, { visible: v })} label="Hiển thị ảnh" />
            Hiển thị
          </label>
        </div>
        {item.uploaded && (
          <ConfirmButton
            size="sm"
            className="w-full"
            confirmLabel="Bấm lần nữa để xóa"
            onConfirm={() => {
              remove(item.id)
              toast.info('Đã xóa ảnh')
            }}
          >
            Xóa ảnh đã tải lên
          </ConfirmButton>
        )}
      </div>
    </motion.article>
  )
}

export default function Gallery() {
  const items = useGalleryStore((s) => s.items)
  const add = useGalleryStore((s) => s.add)
  const reset = useGalleryStore((s) => s.reset)
  const [filter, setFilter] = useState<Filter>('all')
  const [uploadGroup, setUploadGroup] = useState<GalleryGroup>('social')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const shown = useMemo(() => (filter === 'all' ? items : items.filter((i) => i.group === filter)), [items, filter])
  const count = (g: Filter) => (g === 'all' ? items.length : items.filter((i) => i.group === g).length)

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setBusy(true)
    let ok = 0
    for (const f of Array.from(files)) {
      if (!f.type.startsWith('image/')) continue
      try {
        const { src, ar } = await compressImage(f)
        add({ src, ar, group: uploadGroup, caption: f.name.replace(/\.[^.]+$/, ''), featured: false, visible: true, uploaded: true })
        ok += 1
      } catch {
        toast.error('Không thêm được ảnh', f.name)
      }
    }
    setBusy(false)
    if (fileRef.current) fileRef.current.value = ''
    if (ok > 0) toast.success(`Đã thêm ${ok} ảnh`, `Nhóm: ${GROUP_LABEL[uploadGroup]}`)
  }

  return (
    <>
      <PageHeader
        title="Thư viện Ảnh"
        description="Bật/tắt ảnh nổi bật và hiển thị cho mục Cơ sở vật chất & Hình ảnh học viên. Ảnh nổi bật luôn được xếp trước."
        actions={
          <ConfirmButton
            size="sm"
            confirmLabel="Bấm lần nữa để khôi phục"
            onConfirm={() => {
              reset()
              toast.info('Đã khôi phục thư viện ảnh gốc')
            }}
          >
            Khôi phục thư viện gốc
          </ConfirmButton>
        }
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <Tabs
          ariaLabel="Lọc nhóm ảnh"
          layoutId="gallery-filter"
          value={filter}
          onChange={setFilter}
          items={[
            { id: 'all', label: `Tất cả (${count('all')})` },
            { id: 'dorm', label: `${GROUP_LABEL.dorm} (${count('dorm')})` },
            { id: 'study', label: `${GROUP_LABEL.study} (${count('study')})` },
            { id: 'social', label: `${GROUP_LABEL.social} (${count('social')})` },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Nhóm cho ảnh tải lên" value={uploadGroup} onChange={(e) => setUploadGroup(e.target.value as GalleryGroup)} className="input w-auto py-2 text-sm">
            {(Object.keys(GROUP_LABEL) as GalleryGroup[]).map((g) => (
              <option key={g} value={g}>
                {GROUP_LABEL[g]}
              </option>
            ))}
          </select>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => void onFiles(e.target.files)} />
          <Button size="sm" disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? 'Đang xử lý…' : '+ Tải ảnh lên'}
          </Button>
        </div>
      </div>
      <p className="mb-5 text-xs text-navy-400">
        Ảnh tải lên được nén và lưu ngay trong trình duyệt này (phù hợp vài chục ảnh). Muốn dùng ảnh mới lâu dài, hãy chép file vào
        <code className="mx-1 rounded bg-navy-50 px-1">public/assets/</code>và khai báo trong <code className="rounded bg-navy-50 px-1">src/data/gallery.ts</code>.
      </p>

      <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((i) => (
            <Card key={i.id} item={i} />
          ))}
        </AnimatePresence>
      </div>
      {shown.length === 0 && <p className="py-16 text-center text-sm text-navy-400">Chưa có ảnh trong nhóm này.</p>}
    </>
  )
}
