import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { withBase } from '@/lib/base'
import { motion } from 'framer-motion'
import { ASSETS } from '@/constants/assets'
import { Button } from '@/components/ui/Button'
import { inputClass } from '@/components/ui/Field'

const PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE ?? 'antin2026'
import { ADMIN_AUTH_KEY } from '@/constants/admin'
export { ADMIN_AUTH_KEY }

function readAuth(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Cổng đăng nhập khu quản trị.
 * LƯU Ý: đây chỉ là rào chắn giao diện chạy hoàn toàn trên trình duyệt (mã nằm trong JS công khai),
 * KHÔNG phải xác thực thật. Khi đưa lên production cần backend (đăng nhập + API lưu dữ liệu).
 */
export default function AdminGate({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(readAuth)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shakes, setShakes] = useState(0)

  // Trang quản trị không được lập chỉ mục
  useEffect(() => {
    document.title = 'Quản trị – An Tín Korea'
    let m = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!m) {
      m = document.createElement('meta')
      m.name = 'robots'
      document.head.appendChild(m)
    }
    m.content = 'noindex,nofollow'
  }, [])

  if (ok) return <>{children}</>

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (value === PASSCODE) {
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, '1')
      } catch {
        /* bỏ qua: vẫn cho vào phiên hiện tại */
      }
      setOk(true)
    } else {
      setError(true)
      setShakes((n) => n + 1)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-navy-900 to-navy-950 px-4">
      <motion.form
        key={shakes}
        onSubmit={submit}
        initial={{ opacity: 0, y: 10 }}
        animate={shakes ? { x: [0, -8, 8, -4, 4, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: shakes ? 0.32 : 0.35 }}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lift"
      >
        <img src={ASSETS.logo.mark} alt="" className="mx-auto h-16 w-16 object-contain" />
        <h1 className="mt-3 text-center font-display text-2xl text-navy-900">Quản trị An Tín Korea</h1>
        <p className="mt-1 text-center text-sm text-navy-500">Nhập mã truy cập để tiếp tục.</p>
        <label htmlFor="passcode" className="label mt-6">
          Mã truy cập
        </label>
        <input
          id="passcode"
          type="password"
          autoFocus
          autoComplete="current-password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          className={inputClass(error ? 'x' : undefined)}
        />
        {error && (
          <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
            Mã truy cập không đúng.
          </p>
        )}
        <Button type="submit" size="lg" className="mt-5 w-full">
          Đăng nhập
        </Button>
        <a href={withBase('/')} className="mt-4 block text-center text-xs font-medium text-navy-500 transition-colors hover:text-navy-800">
          ← Về trang chủ
        </a>
      </motion.form>
    </div>
  )
}
