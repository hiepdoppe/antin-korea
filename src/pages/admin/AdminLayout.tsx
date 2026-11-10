import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ASSETS } from '@/constants/assets'
import { cn } from '@/lib/cn'
import { SPRING } from '@/lib/motion'
import { ADMIN_AUTH_KEY } from '@/constants/admin'

const NAV: { group?: string; items: { to: string; end?: boolean; label: string }[] }[] = [
  {
    items: [
      { to: '/admin', end: true, label: 'Tổng quan' },
      { to: '/admin/leads', label: 'Học viên (Leads)' },
    ],
  },
  {
    group: 'Nội dung từng trang',
    items: [
      { to: '/admin/pages/home', label: 'Trang chủ' },
      { to: '/admin/pages/about', label: 'Giới thiệu' },
      { to: '/admin/pages/team', label: 'Đội ngũ' },
      { to: '/admin/pages/programs', label: 'Chương trình' },
      { to: '/admin/pages/roadmap', label: 'Lộ trình' },
      { to: '/admin/pages/facilities', label: 'Cơ sở vật chất' },
      { to: '/admin/pages/universities', label: 'Trường đối tác' },
      { to: '/admin/pages/contact', label: 'Liên hệ' },
      { to: '/admin/pages/news', label: 'Tin tức (trang)' },
      { to: '/admin/pages/general', label: 'Cài đặt chung & menu' },
    ],
  },
  {
    group: 'Dữ liệu',
    items: [
      { to: '/admin/news', label: 'Bài viết' },
      { to: '/admin/universities', label: 'Danh sách trường' },
      { to: '/admin/gallery', label: 'Thư viện ảnh' },
    ],
  },
  {
    group: 'Hệ thống',
    items: [
      { to: '/admin/translate', label: 'Dịch thuật Việt – Hàn' },
      { to: '/admin/publish', label: 'Xuất bản & sao lưu' },
    ],
  },
]

function logout() {
  try {
    sessionStorage.removeItem(ADMIN_AUTH_KEY)
  } catch {
    /* noop */
  }
  window.location.assign('/admin')
}

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-navy-50/60 lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="border-b border-navy-100 bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:flex-col lg:items-stretch lg:gap-6 lg:px-5 lg:py-6">
          <a href="/admin" className="flex items-center gap-2.5">
            <img src={ASSETS.logo.mark} alt="" className="h-10 w-10 object-contain" />
            <span className="leading-tight">
              <span className="block font-display text-base text-navy-900">AN TÍN KOREA</span>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-gold-700">Quản trị</span>
            </span>
          </a>

          <nav aria-label="Điều hướng quản trị" className="-mx-1 flex gap-4 overflow-x-auto scrollbar-none lg:mx-0 lg:max-h-[calc(100vh-15rem)] lg:flex-col lg:gap-5 lg:overflow-y-auto lg:overflow-x-visible">
            {NAV.map((g, gi) => (
              <div key={g.group ?? gi} className="flex shrink-0 gap-1 lg:flex-col">
                {g.group && <p className="hidden px-3.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-navy-400 lg:block">{g.group}</p>}
                {g.items.map((n) => (
                  <NavLink key={n.to} to={n.to} end={n.end} className="relative shrink-0 rounded-xl">
                    {({ isActive }) => (
                      <span
                        className={cn(
                          'relative block whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors duration-150 ease-out',
                          isActive ? 'text-navy-950' : 'text-navy-500 hover:text-navy-900',
                        )}
                      >
                        {isActive && <motion.span layoutId="admin-nav-pill" transition={SPRING} className="absolute inset-0 rounded-xl bg-gold-100 ring-1 ring-gold-300" />}
                        <span className="relative z-10">{n.label}</span>
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>

          <div className="hidden space-y-1 border-t border-navy-100 pt-4 lg:block">
            <a href="/" target="_blank" rel="noreferrer" className="block rounded-xl px-3.5 py-2 text-sm font-medium text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900">
              Xem trang web ↗
            </a>
            <button type="button" onClick={logout} className="block w-full rounded-xl px-3.5 py-2 text-left text-sm font-medium text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900">
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
        <div className="mt-10 flex gap-4 text-xs text-navy-400 lg:hidden">
          <a href="/" target="_blank" rel="noreferrer">Xem trang web ↗</a>
          <button type="button" onClick={logout}>Đăng xuất</button>
        </div>
      </main>
    </div>
  )
}
