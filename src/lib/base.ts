/** Đường dẫn gốc của site (Vite `base`): "/" khi chạy riêng, "/antin-korea/" khi đặt trên GitHub Pages dạng user.github.io/antin-korea. */
export const BASE: string = import.meta.env.BASE_URL

/** Thêm tiền tố base vào đường dẫn tuyệt đối nội bộ ("/assets/x.jpg"). Không đụng tới URL ngoài; gọi lại nhiều lần vẫn an toàn. */
export function withBase(p: string): string {
  if (!p || !p.startsWith('/') || p.startsWith('//')) return p
  if (BASE === '/') return p
  const root = BASE.replace(/\/$/, '')
  return p === root || p.startsWith(`${BASE}`) ? p : root + p
}
