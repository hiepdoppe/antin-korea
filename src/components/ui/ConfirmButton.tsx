import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from './Button'

interface ConfirmButtonProps {
  onConfirm: () => void
  children: ReactNode
  confirmLabel?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/** Xóa 2 bước: bấm lần đầu đổi nhãn, bấm lần nữa trong 3 giây để xác nhận. Không dùng window.confirm. */
export function ConfirmButton({ onConfirm, children, confirmLabel = 'Bấm lần nữa để xác nhận', size = 'md', className }: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <Button
      variant={armed ? 'danger' : 'outline'}
      size={size}
      className={className}
      onClick={() => {
        if (armed) {
          window.clearTimeout(timer.current)
          setArmed(false)
          onConfirm()
          return
        }
        setArmed(true)
        timer.current = window.setTimeout(() => setArmed(false), 3000)
      }}
    >
      {armed ? confirmLabel : children}
    </Button>
  )
}
