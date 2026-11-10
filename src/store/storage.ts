import { createJSONStorage } from 'zustand/middleware'
import { ADMIN_AUTH_KEY } from '@/constants/admin'

/**
 * Chỉ GHI localStorage khi đang đăng nhập admin trong tab này.
 * Khách truy cập chỉ ĐỌC → luôn thấy bản đã xuất bản (src/data/published.json), không bị kẹt dữ liệu cũ
 * mỗi lần bạn cập nhật và deploy lại.
 */
export const adminWriteStorage = createJSONStorage(() => ({
  getItem: (k: string) => {
    try {
      return localStorage.getItem(k)
    } catch {
      return null
    }
  },
  setItem: (k: string, v: string) => {
    try {
      if (sessionStorage.getItem(ADMIN_AUTH_KEY) === '1') localStorage.setItem(k, v)
    } catch {
      /* noop */
    }
  },
  removeItem: (k: string) => {
    try {
      localStorage.removeItem(k)
    } catch {
      /* noop */
    }
  },
}))
