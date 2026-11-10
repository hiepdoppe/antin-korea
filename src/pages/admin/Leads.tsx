import { useMemo, useState } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/Button'
import { ConfirmButton } from '@/components/ui/ConfirmButton'
import { Drawer } from '@/components/ui/Drawer'
import { Field, inputClass } from '@/components/ui/Field'
import { Tabs } from '@/components/ui/Tabs'
import { cn } from '@/lib/cn'
import { SPRING, TAP } from '@/lib/motion'
import { formatDate } from '@/lib/utils'
import {
  LEAD_STATUSES,
  PROGRAM_OPTIONS,
  programLabel,
  statusMeta,
  useLeadsStore,
  type Lead,
  type LeadStatus,
} from '@/store/leadsStore'
import { toast } from '@/store/toastStore'
import { useUniversitiesStore } from '@/store/universitiesStore'

type View = 'table' | 'kanban'

function StatusPill({ status }: { status: LeadStatus }) {
  const m = statusMeta(status)
  return <span className={cn('inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold', m.tone)}>{m.label}</span>
}

/* ------------------------------ Form trong drawer ------------------------------ */

function LeadForm({ lead, onDone }: { lead: Lead | null; onDone: () => void }) {
  const add = useLeadsStore((s) => s.add)
  const update = useLeadsStore((s) => s.update)
  const remove = useLeadsStore((s) => s.remove)
  const universities = useUniversitiesStore((s) => s.items)

  const [d, setD] = useState({
    name: lead?.name ?? '',
    phone: lead?.phone ?? '',
    birthYear: lead?.birthYear ?? '',
    gpa: lead?.gpa ?? '',
    targetSchool: lead?.targetSchool ?? '',
    program: lead?.program ?? '',
    note: lead?.note ?? '',
    status: (lead?.status ?? 'new') as LeadStatus,
  })
  const [error, setError] = useState('')
  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => setD((s) => ({ ...s, [k]: v }))

  const save = () => {
    if (d.name.trim().length < 2) {
      setError('Vui lòng nhập họ tên.')
      return
    }
    const clean = { ...d, name: d.name.trim(), phone: d.phone.trim(), note: d.note.trim() }
    if (lead) {
      update(lead.id, clean)
      toast.success('Đã cập nhật học viên', clean.name)
    } else {
      add({ ...clean, source: 'manual' })
      toast.success('Đã thêm học viên', clean.name)
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
      {lead && (
        <p className="rounded-xl bg-navy-50 px-3.5 py-2.5 text-xs text-navy-600">
          Nguồn: <b>{lead.source === 'website' ? 'Đăng ký từ website' : 'Nhập tay'}</b> · Ngày đăng ký: <b>{formatDate(lead.createdAt)}</b>
          {lead.isSample && <span className="ml-2 rounded bg-gold-100 px-1.5 py-0.5 font-bold text-gold-800">Dữ liệu mẫu</span>}
        </p>
      )}
      <Field label="Họ và tên" htmlFor="l-name" required error={error}>
        <input id="l-name" data-autofocus className={inputClass(error)} value={d.name} onChange={(e) => { set('name', e.target.value); setError('') }} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="SĐT / Zalo" htmlFor="l-phone">
          <input id="l-phone" className={inputClass()} inputMode="tel" value={d.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <Field label="Năm sinh" htmlFor="l-birth">
          <input id="l-birth" className={inputClass()} inputMode="numeric" maxLength={4} value={d.birthYear} onChange={(e) => set('birthYear', e.target.value)} />
        </Field>
        <Field label="GPA" htmlFor="l-gpa">
          <input id="l-gpa" className={inputClass()} inputMode="decimal" value={d.gpa} onChange={(e) => set('gpa', e.target.value)} />
        </Field>
        <Field label="Trường mong muốn" htmlFor="l-school">
          <input id="l-school" list="l-school-list" className={inputClass()} value={d.targetSchool} onChange={(e) => set('targetSchool', e.target.value)} />
          <datalist id="l-school-list">
            {universities.map((u) => (
              <option key={u.id} value={u.nameEn} />
            ))}
          </datalist>
        </Field>
      </div>
      <Field label="Chương trình quan tâm" htmlFor="l-program">
        <select id="l-program" className={inputClass()} value={d.program} onChange={(e) => set('program', e.target.value)}>
          <option value="">Chưa chọn</option>
          {PROGRAM_OPTIONS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Trạng thái" htmlFor="l-status">
        <select id="l-status" className={inputClass()} value={d.status} onChange={(e) => set('status', e.target.value as LeadStatus)}>
          {LEAD_STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Ghi chú tư vấn" htmlFor="l-note">
        <textarea id="l-note" rows={4} className={inputClass()} value={d.note} onChange={(e) => set('note', e.target.value)} />
      </Field>

      <div className="sticky bottom-0 -mx-5 -mb-5 flex items-center justify-between gap-2 border-t border-navy-100 bg-white px-5 py-3">
        {lead ? (
          <ConfirmButton
            size="sm"
            confirmLabel="Bấm lần nữa để xóa"
            onConfirm={() => {
              remove(lead.id)
              toast.info('Đã xóa học viên', lead.name)
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
            {lead ? 'Lưu thay đổi' : 'Thêm học viên'}
          </Button>
        </div>
      </div>
    </form>
  )
}

/* ---------------------------------- Kanban ---------------------------------- */

function Kanban({ leads, onOpen }: { leads: Lead[]; onOpen: (l: Lead) => void }) {
  const move = useLeadsStore((s) => s.move)

  const go = (l: Lead, delta: number) => {
    const i = LEAD_STATUSES.findIndex((s) => s.key === l.status)
    const next = LEAD_STATUSES[i + delta]
    if (!next) return
    move(l.id, next.key)
    toast.success(`Đã chuyển sang “${next.label}”`, l.name, { id: `move-${l.id}`, duration: 2200 })
  }

  return (
    <LayoutGroup id="kanban">
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {LEAD_STATUSES.map((col) => {
          const items = leads.filter((l) => l.status === col.key)
          return (
            <section key={col.key} aria-label={col.label} className="w-72 shrink-0 rounded-2xl bg-navy-100/50 p-3">
              <header className="mb-3 flex items-center justify-between gap-2 px-1">
                <h3 className="flex items-center gap-2 text-xs uppercase leading-tight tracking-wide text-navy-700">
                  <span className={cn('h-2 w-2 shrink-0 rounded-full', col.dot)} />
                  {col.label}
                </h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold tabular-nums text-navy-600">{items.length}</span>
              </header>
              <div className="min-h-[4rem] space-y-2.5">
                {items.map((l) => {
                  const idx = LEAD_STATUSES.findIndex((s) => s.key === l.status)
                  return (
                    <motion.article
                      key={l.id}
                      layoutId={`lead-${l.id}`}
                      transition={SPRING}
                      className="rounded-xl border border-navy-100 bg-white p-3.5 shadow-card"
                    >
                      <button type="button" onClick={() => onOpen(l)} className="block w-full text-left">
                        <p className="flex items-center gap-1.5 text-sm font-bold text-navy-900">
                          {l.name}
                          {l.isSample && <span className="rounded bg-gold-100 px-1 text-[10px] font-bold text-gold-800">Mẫu</span>}
                        </p>
                        <p className="mt-0.5 text-xs text-navy-500">{l.phone || 'Chưa có SĐT'}</p>
                        <p className="mt-1.5 line-clamp-1 text-xs text-navy-600">{programLabel(l.program)}</p>
                        {l.targetSchool && <p className="line-clamp-1 text-xs text-navy-400">{l.targetSchool}</p>}
                      </button>
                      <div className="mt-2.5 flex items-center justify-between border-t border-navy-50 pt-2">
                        <span className="text-[11px] text-navy-400">{formatDate(l.createdAt)}</span>
                        <div className="flex gap-1">
                          <motion.button
                            type="button"
                            whileTap={TAP}
                            disabled={idx === 0}
                            aria-label="Chuyển về bước trước"
                            onClick={() => go(l, -1)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-navy-500 transition-colors hover:bg-navy-50 disabled:opacity-30"
                          >
                            ←
                          </motion.button>
                          <motion.button
                            type="button"
                            whileTap={TAP}
                            disabled={idx === LEAD_STATUSES.length - 1}
                            aria-label="Chuyển sang bước sau"
                            onClick={() => go(l, 1)}
                            className="grid h-8 w-8 place-items-center rounded-lg bg-gold-100 text-gold-800 transition-colors hover:bg-gold-200 disabled:opacity-30"
                          >
                            →
                          </motion.button>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
                {items.length === 0 && <p className="px-1 py-3 text-xs text-navy-400">Chưa có học viên.</p>}
              </div>
            </section>
          )
        })}
      </div>
    </LayoutGroup>
  )
}

/* ----------------------------------- Trang ----------------------------------- */

export default function Leads() {
  const leads = useLeadsStore((s) => s.leads)
  const clearSamples = useLeadsStore((s) => s.clearSamples)
  const [view, setView] = useState<View>('table')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'all' | LeadStatus>('all')
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState<Lead | null>(null) // null + open = thêm mới

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return leads.filter((l) => {
      if (view === 'table' && status !== 'all' && l.status !== status) return false
      if (!needle) return true
      return [l.name, l.phone, l.targetSchool, programLabel(l.program)].some((v) => v.toLowerCase().includes(needle))
    })
  }, [leads, q, status, view])

  const hasSamples = leads.some((l) => l.isSample)
  const openLead = (l: Lead | null) => {
    setTarget(l)
    setOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Quản lý Học viên (Leads)"
        description="Theo dõi từng học viên qua 6 bước: từ đăng ký đến khi đỗ visa và xuất cảnh."
        actions={
          <>
            {hasSamples && (
              <ConfirmButton
                size="sm"
                confirmLabel="Bấm lần nữa để xóa dữ liệu mẫu"
                onConfirm={() => {
                  clearSamples()
                  toast.info('Đã xóa dữ liệu mẫu')
                }}
              >
                Xóa dữ liệu mẫu
              </ConfirmButton>
            )}
            <Button size="sm" onClick={() => openLead(null)}>
              + Thêm học viên
            </Button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Tabs
          ariaLabel="Chế độ xem"
          layoutId="lead-view"
          value={view}
          onChange={setView}
          items={[
            { id: 'table', label: 'Bảng' },
            { id: 'kanban', label: 'Kanban' },
          ]}
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm tên, SĐT, trường…"
          aria-label="Tìm học viên"
          className="input max-w-xs flex-1"
        />
        {view === 'table' && (
          <select
            aria-label="Lọc theo trạng thái"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'all' | LeadStatus)}
            className="input w-auto"
          >
            <option value="all">Mọi trạng thái</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {view === 'kanban' ? (
        <Kanban leads={filtered} onOpen={openLead} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="bg-navy-50/70 text-xs uppercase tracking-wider text-navy-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Họ tên</th>
                  <th className="px-4 py-3 font-semibold">SĐT / Zalo</th>
                  <th className="px-4 py-3 font-semibold">Chương trình</th>
                  <th className="px-4 py-3 font-semibold">Trường mong muốn</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold">Ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map((l) => (
                  <tr
                    key={l.id}
                    tabIndex={0}
                    onClick={() => openLead(l)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openLead(l)
                      }
                    }}
                    className="cursor-pointer transition-colors duration-150 hover:bg-gold-50/60 focus-visible:bg-gold-50"
                  >
                    <td className="px-4 py-3 font-semibold text-navy-900">
                      {l.name}
                      {l.isSample && <span className="ml-2 rounded bg-gold-100 px-1.5 py-0.5 text-[10px] font-bold text-gold-800">Mẫu</span>}
                    </td>
                    <td className="px-4 py-3 text-navy-700">{l.phone}</td>
                    <td className="px-4 py-3 text-navy-600">{programLabel(l.program)}</td>
                    <td className="px-4 py-3 text-navy-600">{l.targetSchool || '—'}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={l.status} />
                    </td>
                    <td className="px-4 py-3 text-navy-500">{formatDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="px-4 py-12 text-center text-sm text-navy-400">Không có học viên nào khớp.</p>}
        </div>
      )}

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={target ? target.name : 'Thêm học viên'}
        subtitle={target ? 'Chi tiết học viên' : 'Nhập thông tin học viên mới'}
      >
        <LeadForm key={target?.id ?? 'new'} lead={target} onDone={() => setOpen(false)} />
      </Drawer>
    </>
  )
}
