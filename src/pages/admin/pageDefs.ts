import type { PageKey, SiteContent } from '@/data/initialContent'
import { stringPaths } from '@/lib/i18n'
import { ROUTES } from '@/constants/routes'

export interface FieldDef {
  path: string
  label: string
  area?: boolean
  rows?: number
  /** giới hạn ký tự khuyến nghị (SEO) */
  limit?: number
}
export interface Group {
  title?: string
  fields: FieldDef[]
}
export interface PageDef {
  id: string
  title: string
  hint: string
  /** đường dẫn công khai để xem trước; null = cài đặt dùng chung */
  publicPath: string
  groups: Group[]
  related?: { to: string; label: string }[]
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i)

/** Sinh trường cho mọi chuỗi trong một nhánh (dùng cho nhãn giao diện "ui.*"). */
function auto(prefix: string, c: SiteContent): FieldDef[] {
  const node = prefix.split('.').reduce<unknown>((n, k) => (n as Record<string, unknown>)?.[k], c)
  return stringPaths(node, prefix).map(([path, value]) => ({
    path,
    label: path.slice(prefix.length + 1) || path,
    area: value.length > 70,
    rows: 2,
  }))
}

const seo = (k: PageKey): Group => ({
  title: 'SEO – hiển thị trên Google',
  fields: [
    { path: `seo.${k}.title`, label: 'Tiêu đề trang (title)', limit: 60 },
    { path: `seo.${k}.description`, label: 'Mô tả (meta description)', area: true, rows: 3, limit: 160 },
  ],
})

const labels = (prefix: string, c: SiteContent): Group => ({ title: 'Nhãn giao diện của trang', fields: auto(prefix, c) })

/** Mỗi trang công khai ↔ một trang quản trị riêng. */
export function buildPages(c: SiteContent): PageDef[] {
  return [
    {
      id: 'general',
      title: 'Cài đặt chung',
      hint: 'Tên công ty, slogan, liên hệ, menu và các nhãn dùng ở mọi trang (thanh menu, chân trang).',
      publicPath: ROUTES.home,
      groups: [
        {
          title: 'Thông tin công ty',
          fields: [
            { path: 'brand.nameVi', label: 'Tên công ty (VI)' },
            { path: 'brand.nameEn', label: 'Tên quốc tế (EN)' },
            { path: 'brand.slogan', label: 'Slogan (dùng " - " để tách phần nhấn màu vàng)' },
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
        { title: 'Menu (thanh điều hướng)', fields: auto('ui.nav', c) },
        { title: 'Nhãn dùng chung (chân trang, 404, ảnh…)', fields: auto('ui.common', c) },
      ],
    },
    {
      id: 'home',
      title: 'Trang chủ',
      hint: 'Phần đầu trang (Hero), các thẻ giới thiệu từng mục, khối tin mới và lời kêu gọi cuối trang.',
      publicPath: ROUTES.home,
      groups: [
        {
          title: 'Hero (đầu trang)',
          fields: [
            { path: 'hero.eyebrow', label: 'Dòng nhỏ phía trên' },
            { path: 'hero.subline', label: 'Mô tả ngắn', area: true, rows: 3 },
            { path: 'hero.ctaPrimary', label: 'Nút chính' },
            { path: 'hero.ctaSecondary', label: 'Nút phụ' },
          ],
        },
        labels('ui.home', c),
        seo('home'),
      ],
      related: [{ to: '/admin/news', label: 'Quản lý bài viết hiển thị ở “Bài viết mới nhất”' }],
    },
    {
      id: 'about',
      title: 'Giới thiệu',
      hint: 'Thư ngỏ Tổng Giám đốc, tầm nhìn, sứ mệnh và 5 giá trị cốt lõi.',
      publicPath: ROUTES.about,
      groups: [
        { title: 'Tiêu đề trang', fields: [{ path: 'sections.about', label: 'Tiêu đề (H1)' }] },
        {
          title: 'Thư ngỏ Tổng Giám đốc',
          fields: [
            { path: 'ceoLetter.ceoName', label: 'Họ tên' },
            { path: 'ceoLetter.ceoTitle', label: 'Chức danh' },
            { path: 'ceoLetter.greeting', label: 'Lời chào', area: true, rows: 2 },
            ...range(c.ceoLetter.paragraphs.length).map((i) => ({ path: `ceoLetter.paragraphs.${i}`, label: `Đoạn ${i + 1}`, area: true, rows: 5 })),
          ],
        },
        {
          title: 'Tầm nhìn – Sứ mệnh – Giá trị',
          fields: [
            { path: 'vision.visionTitle', label: 'Tiêu đề Tầm nhìn' },
            { path: 'vision.vision', label: 'Nội dung Tầm nhìn', area: true, rows: 3 },
            { path: 'vision.missionTitle', label: 'Tiêu đề Sứ mệnh' },
            { path: 'vision.mission', label: 'Nội dung Sứ mệnh', area: true, rows: 3 },
            { path: 'vision.valuesTitle', label: 'Tiêu đề Giá trị cốt lõi' },
            ...range(c.vision.values.length).map((i) => ({ path: `vision.values.${i}`, label: `Giá trị ${i + 1}` })),
          ],
        },
        labels('ui.about', c),
        seo('about'),
      ],
    },
    {
      id: 'team',
      title: 'Đội ngũ',
      hint: 'Thông điệp nhân sự, sơ đồ tổ chức và chuyên viên đối ngoại tại Hàn Quốc.',
      publicPath: ROUTES.team,
      groups: [
        {
          title: 'Thông điệp (H1)',
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
        labels('ui.team', c),
        seo('team'),
      ],
    },
    {
      id: 'programs',
      title: 'Chương trình',
      hint: 'Mô tả chung và các chương trình đào tạo (hiển thị dạng tab).',
      publicPath: ROUTES.programs,
      groups: [
        {
          title: 'Tiêu đề & mô tả chung',
          fields: [
            { path: 'sections.programs', label: 'Tiêu đề trang (H1)' },
            { path: 'programs.intro', label: 'Mô tả chung', area: true, rows: 4 },
          ],
        },
        ...range(c.programs.items.length).map((i) => ({
          title: `Chương trình ${i + 1}`,
          fields: [
            { path: `programs.items.${i}.title`, label: 'Tên chương trình' },
            { path: `programs.items.${i}.badge`, label: 'Nhãn (visa / hình thức)' },
            { path: `programs.items.${i}.description`, label: 'Mô tả', area: true, rows: 3 },
          ],
        })),
        labels('ui.programs', c),
        seo('programs'),
      ],
    },
    {
      id: 'roadmap',
      title: 'Lộ trình',
      hint: 'Tiêu đề và mô tả của từng bước trong lộ trình.',
      publicPath: ROUTES.roadmap,
      groups: [
        { title: 'Tiêu đề trang', fields: [{ path: 'sections.roadmap', label: 'Tiêu đề (H1)' }] },
        ...range(c.roadmap.steps.length).map((i) => ({
          title: `Bước ${c.roadmap.steps[i].no}`,
          fields: [
            { path: `roadmap.steps.${i}.title`, label: 'Tiêu đề' },
            { path: `roadmap.steps.${i}.description`, label: 'Mô tả', area: true, rows: 2 },
          ],
        })),
        labels('ui.roadmap', c),
        seo('roadmap'),
      ],
    },
    {
      id: 'facilities',
      title: 'Cơ sở vật chất',
      hint: 'Văn bản đi kèm ba tab (ký túc xá, lớp học, hình ảnh học viên). Ảnh quản lý ở “Thư viện ảnh”.',
      publicPath: ROUTES.facilities,
      groups: [
        {
          title: 'Nội dung',
          fields: [
            { path: 'sections.facilities', label: 'Tiêu đề trang (H1)' },
            { path: 'facilities.dormTitle', label: 'Ký túc xá – tiêu đề' },
            { path: 'facilities.dormText', label: 'Ký túc xá – mô tả', area: true, rows: 4 },
            { path: 'facilities.studyTitle', label: 'Không gian học tập – tiêu đề' },
            { path: 'facilities.studyText', label: 'Không gian học tập – mô tả', area: true, rows: 3 },
            { path: 'facilities.socialTitle', label: 'Hình ảnh học viên – tiêu đề' },
            { path: 'facilities.socialText', label: 'Hình ảnh học viên – mô tả', area: true, rows: 3 },
            { path: 'facilities.hashtag', label: 'Hashtag (không cần dấu #)' },
          ],
        },
        labels('ui.facilities', c),
        seo('facilities'),
      ],
      related: [{ to: '/admin/gallery', label: 'Quản lý Thư viện ảnh' }],
    },
    {
      id: 'universities',
      title: 'Trường đối tác',
      hint: 'Tiêu đề và nhãn bộ lọc của trang. Danh sách trường quản lý ở mục “Danh sách trường”.',
      publicPath: ROUTES.universities,
      groups: [
        { title: 'Tiêu đề trang', fields: [{ path: 'sections.universities', label: 'Tiêu đề (H1)' }] },
        labels('ui.universities', c),
        seo('universities'),
      ],
      related: [{ to: '/admin/universities', label: 'Quản lý danh sách trường' }],
    },
    {
      id: 'contact',
      title: 'Liên hệ',
      hint: 'Tiêu đề, nhãn và thông báo của form đăng ký tư vấn. Thông tin liên hệ sửa ở “Cài đặt chung”.',
      publicPath: ROUTES.contact,
      groups: [{ title: 'Tiêu đề trang', fields: [{ path: 'sections.contact', label: 'Tiêu đề (H1)' }] }, labels('ui.contact', c), seo('contact')],
      related: [{ to: '/admin/leads', label: 'Xem học viên đã đăng ký' }],
    },
    {
      id: 'news',
      title: 'Tin tức (trang danh sách)',
      hint: 'Tiêu đề và nhãn của trang Tin tức. Bài viết quản lý ở mục “Bài viết”.',
      publicPath: ROUTES.news,
      groups: [{ title: 'Tiêu đề trang', fields: [{ path: 'sections.news', label: 'Tiêu đề (H1)' }] }, labels('ui.news', c), seo('news')],
      related: [{ to: '/admin/news', label: 'Quản lý bài viết' }],
    },
  ]
}
