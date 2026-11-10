import { create } from 'zustand'

export type ToastKind = 'success' | 'error' | 'info'

export interface ToastData {
  id: string
  kind: ToastKind
  title: string
  description?: string
  duration?: number
}

interface ToastState {
  toasts: ToastData[]
  push: (t: Omit<ToastData, 'id'> & { id?: string }) => string
  dismiss: (id: string) => void
}

let seq = 0

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => {
    const id = t.id ?? `toast_${++seq}`
    // Cùng id → thay thế tại chỗ (không tạo toast mới) – dùng cho "Đã lưu" khi gõ liên tục.
    set((s) => {
      const exists = s.toasts.some((x) => x.id === id)
      const next = { ...t, id }
      return {
        toasts: exists ? s.toasts.map((x) => (x.id === id ? next : x)) : [...s.toasts, next].slice(-5),
      }
    })
    return id
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}))

type Opts = { id?: string; duration?: number }
const make =
  (kind: ToastKind) =>
  (title: string, description?: string, opts?: Opts) =>
    useToastStore.getState().push({ kind, title, description, ...opts })

/** Gọi từ bất kỳ đâu, không cần hook: toast.success('Đã lưu') */
export const toast = {
  success: make('success'),
  error: make('error'),
  info: make('info'),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
}
