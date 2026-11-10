import { useEffect, useState } from 'react'

/** Scroll-spy: trả về id của section đang nằm ở giữa màn hình. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState('')
  const key = ids.join('|')

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return active
}
