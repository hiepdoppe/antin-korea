import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { PageHeader } from '@/components/admin/PageHeader'
import { cn } from '@/lib/cn'
import { EASE_OUT, SPRING } from '@/lib/motion'
import { formatDate } from '@/lib/utils'
import { useGalleryStore } from '@/store/galleryStore'
import { LEAD_STATUSES, programLabel, statusMeta, useLeadsStore } from '@/store/leadsStore'
import { useUniversitiesStore } from '@/store/universitiesStore'

function Count({ value, suffix = '' }: { value: number; suffix?: string }) {
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => `${Math.round(v)}${suffix}`)
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.7, ease: EASE_OUT })
    return () => controls.stop()
  }, [value, mv])
  return <motion.span>{text}</motion.span>
}

function Stat({ label, value, suffix, hint, accent }: { label: string; value: number; suffix?: string; hint: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <span className={cn('mb-3 block h-1 w-10 rounded-full', accent)} />
      <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">{label}</p>
      <p className="mt-1.5 font-display text-4xl tabular-nums text-navy-900">
        <Count value={value} suffix={suffix} />
      </p>
      <p className="mt-1 text-xs text-navy-400">{hint}</p>
    </div>
  )
}

export default function Dashboard() {
  const leads = useLeadsStore((s) => s.leads)
  const universities = useUniversitiesStore((s) => s.items)
  const gallery = useGalleryStore((s) => s.items)

  const stats = useMemo(() => {
    const total = leads.length
    const online = leads.filter((l) => l.program === 'korean-class').length
    const pending = leads.filter((l) => l.status === 'processing').length
    const visa = leads.filter((l) => l.status === 'visa').length
    const rate = total === 0 ? 0 : Math.round((visa / total) * 100)
    const byStatus = LEAD_STATUSES.map((s) => ({ ...s, count: leads.filter((l) => l.status === s.key).length }))
    return { total, online, pending, visa, rate, byStatus }
  }, [leads])

  const max = Math.max(1, ...stats.byStatus.map((s) => s.count))
  const recent = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6)

  return (
    <>
      <PageHeader title="Tổng quan" description="Số liệu cập nhật trực tiếp từ danh sách học viên (kể cả đăng ký mới từ trang web)." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Tổng học viên (Leads)" value={stats.total} hint="Tất cả đăng ký tư vấn" accent="bg-navy-700" />
        <Stat label="Đăng ký lớp tiếng Hàn" value={stats.online} hint="Lớp Online / Offline" accent="bg-violet-500" />
        <Stat label="Hồ sơ đang xử lý" value={stats.pending} hint="Đang xử lý hồ sơ & chọn trường" accent="bg-amber-500" />
        <Stat label="Tỷ lệ đỗ Visa" value={stats.rate} suffix="%" hint={`${stats.visa} / ${stats.total} học viên đã đỗ visa`} accent="bg-emerald-500" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card sm:p-6">
          <h2 className="font-display text-lg text-navy-900">Tiến trình học viên</h2>
          <ul className="mt-5 space-y-4">
            {stats.byStatus.map((s) => (
              <li key={s.key}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-navy-700">{s.label}</span>
                  <span className="font-bold tabular-nums text-navy-900">{s.count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-navy-50">
                  <motion.div
                    className={cn('h-full origin-left rounded-full', s.dot)}
                    style={{ width: '100%' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: s.count / max }}
                    transition={SPRING}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-navy-900">Đăng ký gần đây</h2>
            <Link to="/admin/leads" className="text-xs font-semibold text-gold-700 hover:text-gold-800">
              Xem tất cả →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-navy-400">Chưa có đăng ký nào.</p>
          ) : (
            <ul className="mt-4 divide-y divide-navy-50">
              {recent.map((l) => {
                const meta = statusMeta(l.status)
                return (
                  <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-navy-900">{l.name}</p>
                      <p className="truncate text-xs text-navy-400">
                        {programLabel(l.program)} · {formatDate(l.createdAt)}
                      </p>
                    </div>
                    <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold', meta.tone)}>{meta.label}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link to="/admin/pages/home" className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition-shadow hover:shadow-lift">
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">Nội dung trang</p>
          <p className="mt-1 font-semibold text-navy-900">Sửa tiêu đề, thư ngỏ, lộ trình, liên hệ →</p>
        </Link>
        <Link to="/admin/universities" className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition-shadow hover:shadow-lift">
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">Trường đối tác</p>
          <p className="mt-1 font-semibold text-navy-900">{universities.length} trường đang hiển thị →</p>
        </Link>
        <Link to="/admin/gallery" className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition-shadow hover:shadow-lift">
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">Thư viện ảnh</p>
          <p className="mt-1 font-semibold text-navy-900">
            {gallery.filter((g) => g.visible).length} / {gallery.length} ảnh đang hiển thị →
          </p>
        </Link>
      </div>
    </>
  )
}
