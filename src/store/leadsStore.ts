import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '@/lib/utils'

export type LeadStatus = 'new' | 'consulting' | 'learning' | 'processing' | 'interview' | 'visa'

export const LEAD_STATUSES: { key: LeadStatus; label: string; tone: string; dot: string }[] = [
  { key: 'new', label: 'Mới đăng ký', tone: 'bg-sky-100 text-sky-800', dot: 'bg-sky-500' },
  { key: 'consulting', label: 'Đang tư vấn lộ trình', tone: 'bg-indigo-100 text-indigo-800', dot: 'bg-indigo-500' },
  { key: 'learning', label: 'Đang học tiếng Hàn Online/Offline', tone: 'bg-violet-100 text-violet-800', dot: 'bg-violet-500' },
  { key: 'processing', label: 'Đang xử lý hồ sơ & Chọn trường', tone: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  { key: 'interview', label: 'Luyện phỏng vấn ĐSQ', tone: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  { key: 'visa', label: 'Đã đỗ Visa / Xuất cảnh', tone: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
]

export const statusMeta = (key: LeadStatus) => LEAD_STATUSES.find((s) => s.key === key) ?? LEAD_STATUSES[0]

export const PROGRAM_OPTIONS: { id: string; label: string }[] = [
  { id: 'd4-1', label: 'Du học Tiếng Hàn (Visa D-4-1)' },
  { id: 'd2-1', label: 'Du học Chuyên ngành ĐH / CĐ (Visa D-2-1 / D-2-2)' },
  { id: 'd2-3', label: 'Du học Sau đại học / Thạc sĩ (Visa D-2-3)' },
  { id: 'korean-class', label: 'Lớp tiếng Hàn Online / Offline' },
]

export const programLabel = (id: string) => PROGRAM_OPTIONS.find((p) => p.id === id)?.label ?? 'Chưa chọn'

export interface Lead {
  id: string
  name: string
  phone: string
  birthYear: string
  gpa: string
  targetSchool: string
  program: string
  note: string
  status: LeadStatus
  source: 'website' | 'manual'
  createdAt: string
  /** Dữ liệu mẫu để xem giao diện – xóa được bằng một nút ở /admin/leads */
  isSample?: boolean
}

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString()

const sample = (
  i: number,
  name: string,
  status: LeadStatus,
  program: string,
  school: string,
  gpa: string,
  birth: string,
  days: number,
): Lead => ({
  id: `sample_${i}`,
  name,
  phone: `0900 000 00${i}`,
  birthYear: birth,
  gpa,
  targetSchool: school,
  program,
  note: 'Dữ liệu mẫu – có thể xóa.',
  status,
  source: 'manual',
  createdAt: daysAgo(days),
  isSample: true,
})

const sampleLeads: Lead[] = [
  sample(1, 'Nguyễn Minh Anh', 'new', 'd4-1', 'Chưa chọn', '7.5', '2006', 0),
  sample(2, 'Trần Quốc Bảo', 'consulting', 'd2-1', 'Hanyang University', '8.0', '2005', 2),
  sample(3, 'Lê Thu Hà', 'learning', 'korean-class', '', '', '2004', 5),
  sample(4, 'Phạm Gia Huy', 'processing', 'd4-1', 'Daelim University', '7.2', '2006', 8),
  sample(5, 'Đỗ Khánh Linh', 'interview', 'd2-1', 'Sejong University', '8.4', '2005', 14),
  sample(6, 'Vũ Hoàng Nam', 'visa', 'd4-1', 'Hansei University', '7.0', '2006', 30),
]

interface LeadsState {
  leads: Lead[]
  add: (data: Omit<Lead, 'id' | 'createdAt' | 'status' | 'source'> & Partial<Pick<Lead, 'status' | 'source'>>) => string
  update: (id: string, patch: Partial<Lead>) => void
  move: (id: string, status: LeadStatus) => void
  remove: (id: string) => void
  clearSamples: () => void
}

export const useLeadsStore = create<LeadsState>()(
  persist(
    (set) => ({
      leads: sampleLeads,
      add: (data) => {
        const id = uid('lead')
        const lead: Lead = {
          ...data,
          id,
          status: data.status ?? 'new',
          source: data.source ?? 'website',
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ leads: [lead, ...s.leads] }))
        return id
      },
      update: (id, patch) => set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),
      move: (id, status) => set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, status } : l)) })),
      remove: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
      clearSamples: () => set((s) => ({ leads: s.leads.filter((l) => !l.isSample) })),
    }),
    { name: 'antin.leads.v1', version: 1 },
  ),
)
