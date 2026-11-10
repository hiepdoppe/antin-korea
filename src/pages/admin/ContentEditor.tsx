import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/Button'
import { ConfirmButton } from '@/components/ui/ConfirmButton'
import { Field, inputClass } from '@/components/ui/Field'
import { cn } from '@/lib/cn'
import { SPRING, TAP } from '@/lib/motion'
import { initialContent, type SiteContent } from '@/data/initialContent'
import { getIn } from '@/lib/utils'
import { useContentStore } from '@/store/contentStore'
import { toast } from '@/store/toastStore'

interface FieldDef {
  path: string
  label: string
  area?: boolean
  rows?: number
}
interface Group {
  title?: string
  fields: FieldDef[]
}
interface SectionDef {
  id: string
  title: string
  hint: string
  anchor: string // đoạn #hash của trang chủ để xem trước
  resetKeys: (keyof SiteContent)[]
  groups: Group[]
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i)

/** Cấu hình form sinh từ initialContent → thêm trường mới vào dữ liệu là form tự có. */
function buildSections(c: SiteContent): SectionDef[] {
  return [
    {
      id: 'brand',
      title: 'Thương hiệu & Liên hệ',
      hint: 'Tên pháp lý, slogan, địa chỉ, hotline, email – hiện ở đầu trang, mục Liên hệ và chân trang.',
      anchor: '#contact',
      resetKeys: ['brand', 'contact'],
      groups: [
        {
          title: 'Thông tin công ty',
          fields: [
            { path: 'brand.nameVi', label: 'Tên công ty (VI)' },
            { path: 'brand.nameEn', label: 'Tên quốc tế (EN)' },
            { path: 'brand.slogan', label: 'Slogan (dùng dấu “ - ” để tách phần nhấn màu vàng)' },
            { path: 'brand.taxCode', label: 'Mã số thuế' },
            { path: 'brand.legalRep', label: 'Đại diện pháp luật' },
            { path: 'brand.legalRepTitle', label: 'Chức danh đại diện' },
          ],
        },
        {
          title: 'Liên hệ',
          fields: [
            { path: 'contact.address', label: 'Trụ sở chính (Việt Nam)', area: true, rows: 2 },
            { path: 'contact.koreaBranch', label: 'Chi nhánh tại Hàn Quốc', area: true, rows: 2 },
            { path: 'contact.hotline', label: 'Hotline' },
            { path: 'contact.email', label: 'Email' },
          ],
        },
      ],
    },
    {
      id: 'hero',
      title: 'Hero (đầu trang)',
      hint: 'Dòng nhỏ phía trên, mô tả ngắn và hai nút bấm. Tiêu đề lớn chính là Slogan ở mục Thương hiệu.',
      anchor: '#top',
      resetKeys: ['hero'],
      groups: [
        {
          fields: [
            { path: 'hero.eyebrow', label: 'Dòng nhỏ phía trên' },
            { path: 'hero.subline', label: 'Mô tả ngắn', area: true, rows: 3 },
            { path: 'hero.ctaPrimary', label: 'Nút chính' },
            { path: 'hero.ctaSecondary', label: 'Nút phụ' },
          ],
        },
      ],
    },
    {
      id: 'ceo',
      title: 'Thư ngỏ Tổng Giám đốc',
      hint: 'Lời chào và 4 đoạn thư.',
      anchor: '#about',
      resetKeys: ['ceoLetter'],
      groups: [
        {
          fields: [
            { path: 'ceoLetter.ceoName', label: 'Họ tên' },
            { path: 'ceoLetter.ceoTitle', label: 'Chức danh' },
            { path: 'ceoLetter.greeting', label: 'Lời chào', area: true, rows: 2 },
            ...range(c.ceoLetter.paragraphs.length).map((i) => ({
              path: `ceoLetter.paragraphs.${i}`,
              label: `Đoạn ${i + 1}`,
              area: true,
              rows: 5,
            })),
          ],
        },
      ],
    },
    {
      id: 'vision',
      title: 'Tầm nhìn – Sứ mệnh – Giá trị',
      hint: '5 giá trị cốt lõi hiển thị dạng thẻ.',
      anchor: '#about',
      resetKeys: ['vision'],
      groups: [
        {
          fields: [
            { path: 'vision.visionTitle', label: 'Tiêu đề Tầm nhìn' },
            { path: 'vision.vision', label: 'Nội dung Tầm nhìn', area: true, rows: 3 },
            { path: 'vision.missionTitle', label: 'Tiêu đề Sứ mệnh' },
            { path: 'vision.mission', label: 'Nội dung Sứ mệnh', area: true, rows: 3 },
            { path: 'vision.valuesTitle', label: 'Tiêu đề Giá trị cốt lõi' },
            ...range(c.vision.values.length).map((i) => ({ path: `vision.values.${i}`, label: `Giá trị ${i + 1}` })),
          ],
        },
      ],
    },
    {
      id: 'team',
      title: 'Sơ đồ tổ chức & Nhân sự',
      hint: 'Thông điệp nhân sự, bộ máy lãnh đạo và chuyên viên đối ngoại tại Hàn Quốc.',
      anchor: '#team',
      resetKeys: ['team'],
      groups: [
        {
          title: 'Thông điệp',
          fields: [
            { path: 'team.headline', label: 'Tiêu đề' },
            { path: 'team.tagline', label: 'Dòng phụ' },
          ],
        },
        {
          title: 'Tổng Giám đốc',
          fields: [
            { path: 'team.ceoTitle', label: 'Chức danh' },
            { path: 'team.ceoName', label: 'Họ tên' },
          ],
        },
        ...(['deputy1', 'deputy2'] as const).map((k) => ({
          title: k === 'deputy1' ? 'Phó Tổng Giám đốc 1' : 'Phó Tổng Giám đốc 2',
          fields: [
            { path: `team.${k}.title`, label: 'Chức danh' },
            { path: `team.${k}.block`, label: 'Khối phụ trách' },
            ...range(c.team[k].units.length).map((i) => ({ path: `team.${k}.units.${i}`, label: `Phòng / bộ phận ${i + 1}` })),
          ],
        })),
        {
          title: 'Chuyên viên đối ngoại tại Hàn Quốc',
          fields: [
            { path: 'team.koreaTitle', label: 'Tiêu đề mục' },
            { path: 'team.koreaIntro', label: 'Giới thiệu', area: true, rows: 2 },
            ...range(c.team.koreaStaff.length).flatMap((i) => [
              { path: `team.koreaStaff.${i}.name`, label: `Chuyên viên ${i + 1} – họ tên` },
              { path: `team.koreaStaff.${i}.role`, label: `Chuyên viên ${i + 1} – chức danh` },
            ]),
          ],
        },
      ],
    },
    {
      id: 'programs',
      title: 'Chương trình đào tạo',
      hint: 'Mô tả chung và 4 chương trình trọng tâm (hiển thị dạng tab).',
      anchor: '#programs',
      resetKeys: ['programs'],
      groups: [
        { fields: [{ path: 'programs.intro', label: 'Mô tả chung', area: true, rows: 4 }] },
        ...range(c.programs.items.length).map((i) => ({
          title: `Chương trình ${i + 1}`,
          fields: [
            { path: `programs.items.${i}.title`, label: 'Tên chương trình' },
            { path: `programs.items.${i}.badge`, label: 'Nhãn (visa / hình thức)' },
            { path: `programs.items.${i}.description`, label: 'Mô tả', area: true, rows: 3 },
          ],
        })),
      ],
    },
    {
      id: 'roadmap',
      title: 'Lộ trình 6 bước',
      hint: 'Tiêu đề và mô tả của từng bước.',
      anchor: '#roadmap',
      resetKeys: ['roadmap'],
      groups: range(c.roadmap.steps.length).map((i) => ({
        title: `Bước ${c.roadmap.steps[i].no}`,
        fields: [
          { path: `roadmap.steps.${i}.title`, label: 'Tiêu đề' },
          { path: `roadmap.steps.${i}.description`, label: 'Mô tả', area: true, rows: 2 },
        ],
      })),
    },
    {
      id: 'facilities',
      title: 'Cơ sở vật chất & Học viên',
      hint: 'Văn bản đi kèm ba tab. Ảnh quản lý ở “Thư viện ảnh”.',
      anchor: '#facilities',
      resetKeys: ['facilities'],
      groups: [
        {
          fields: [
            { path: 'facilities.dormTitle', label: 'Ký túc xá – tiêu đề' },
            { path: 'facilities.dormText', label: 'Ký túc xá – mô tả', area: true, rows: 4 },
            { path: 'facilities.studyTitle', label: 'Không gian học tập – tiêu đề' },
            { path: 'facilities.studyText', label: 'Không gian học tập – mô tả', area: true, rows: 3 },
            { path: 'facilities.socialTitle', label: 'Hình ảnh học viên – tiêu đề' },
            { path: 'facilities.socialText', label: 'Hình ảnh học viên – mô tả', area: true, rows: 3 },
            { path: 'facilities.hashtag', label: 'Hashtag (không cần dấu #)' },
          ],
        },
      ],
    },
    {
      id: 'sections',
      title: 'Tiêu đề các mục',
      hint: 'Tiêu đề lớn của từng mục trên trang chủ.',
      anchor: '#about',
      resetKeys: ['sections'],
      groups: [
        {
          fields: [
            { path: 'sections.about', label: 'Về chúng tôi' },
            { path: 'sections.programs', label: 'Chương trình' },
            { path: 'sections.roadmap', label: 'Lộ trình' },
            { path: 'sections.facilities', label: 'Cơ sở vật chất' },
            { path: 'sections.universities', label: 'Trường đối tác' },
            { path: 'sections.contact', label: 'Đăng ký tư vấn' },
          ],
        },
      ],
    },
  ]
}

// Toast "Đã lưu" gộp: gõ liên tục chỉ hiện một toast (cùng id, thay tại chỗ).
let saveTimer: number | undefined
function notifySaved() {
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    toast.success('Đã lưu thay đổi', 'Trang chủ được cập nhật ngay.', { id: 'content-saved', duration: 2200 })
  }, 700)
}

function EditableField({ def }: { def: FieldDef }) {
  const value = useContentStore((s) => getIn(s.content, def.path)) as string | undefined
  const setField = useContentStore((s) => s.setField)
  const id = `cms-${def.path}`
  const common = {
    id,
    value: value ?? '',
    onChange: (e: { target: { value: string } }) => {
      setField(def.path, e.target.value)
      notifySaved()
    },
  }
  return (
    <Field label={def.label} htmlFor={id}>
      {def.area ? <textarea rows={def.rows ?? 3} className={inputClass()} {...common} /> : <input className={inputClass()} {...common} />}
    </Field>
  )
}

export default function ContentEditor() {
  const resetSection = useContentStore((s) => s.resetSection)
  const resetAll = useContentStore((s) => s.resetAll)
  const sections = useMemo(() => buildSections(initialContent), [])
  const [activeId, setActiveId] = useState(sections[0].id)
  const [preview, setPreview] = useState(false)
  const active = sections.find((s) => s.id === activeId) ?? sections[0]

  return (
    <>
      <PageHeader
        title="Quản lý Nội dung Trang"
        description="Sửa chữ trực tiếp, tự động lưu và hiện ngay trên trang chủ – không cần mở code."
        actions={
          <>
            <Button size="sm" variant={preview ? 'secondary' : 'outline'} onClick={() => setPreview((v) => !v)}>
              {preview ? 'Ẩn xem trước' : 'Xem trước trực tiếp'}
            </Button>
            <a href="/" target="_blank" rel="noreferrer" className="text-sm font-semibold text-gold-700 hover:text-gold-800">
              Mở trang chủ ↗
            </a>
          </>
        }
      />

      <div className={cn('grid gap-6', preview ? 'xl:grid-cols-[13rem_minmax(0,1fr)_26rem]' : 'lg:grid-cols-[14rem_minmax(0,1fr)]')}>
        <nav aria-label="Các mục nội dung" className="-mx-4 flex gap-1 overflow-x-auto px-4 scrollbar-none lg:sticky lg:top-6 lg:mx-0 lg:h-fit lg:flex-col lg:overflow-visible lg:px-0">
          {sections.map((s) => {
            const isActive = s.id === activeId
            return (
              <motion.button
                key={s.id}
                type="button"
                whileTap={TAP}
                transition={SPRING}
                onClick={() => setActiveId(s.id)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'relative shrink-0 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors duration-150',
                  isActive ? 'text-navy-950' : 'text-navy-500 hover:text-navy-900',
                )}
              >
                {isActive && <motion.span layoutId="content-section" transition={SPRING} className="absolute inset-0 rounded-xl bg-gold-100 ring-1 ring-gold-300" />}
                <span className="relative z-10 whitespace-nowrap lg:whitespace-normal">{s.title}</span>
              </motion.button>
            )
          })}
        </nav>

        <section className="min-w-0 rounded-2xl border border-navy-100 bg-white p-5 shadow-card sm:p-7">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-navy-50 pb-5">
            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">{active.title}</h2>
              <p className="mt-1 max-w-xl text-sm text-navy-500">{active.hint}</p>
            </div>
            <ConfirmButton
              size="sm"
              confirmLabel="Bấm lần nữa để khôi phục"
              onConfirm={() => {
                active.resetKeys.forEach((k) => resetSection(k))
                toast.info('Đã khôi phục nội dung gốc', active.title)
              }}
            >
              Khôi phục mục này
            </ConfirmButton>
          </div>

          <div className="space-y-8">
            {active.groups.map((g, gi) => (
              <fieldset key={`${active.id}-${gi}`} className="min-w-0">
                {g.title && <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-gold-700">{g.title}</legend>}
                <div className="grid gap-4">
                  {g.fields.map((f) => (
                    <EditableField key={f.path} def={f} />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-10 border-t border-navy-50 pt-5">
            <ConfirmButton
              size="sm"
              confirmLabel="Bấm lần nữa để khôi phục TẤT CẢ"
              onConfirm={() => {
                resetAll()
                toast.info('Đã khôi phục toàn bộ nội dung gốc')
              }}
            >
              Khôi phục toàn bộ nội dung
            </ConfirmButton>
          </div>
        </section>

        {preview && (
          <aside className="hidden xl:block">
            <div className="sticky top-6 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-navy-50 px-4 py-2.5 text-xs font-semibold text-navy-500">
                <span>Xem trước trang chủ</span>
                <span className="text-emerald-600">● Trực tiếp</span>
              </div>
              {/* Cùng origin → nhận sự kiện storage và tự cập nhật khi bạn gõ */}
              <iframe key={active.anchor} title="Xem trước trang chủ" src={`/${active.anchor}`} className="h-[78vh] w-full bg-white" />
            </div>
          </aside>
        )}
      </div>
    </>
  )
}
