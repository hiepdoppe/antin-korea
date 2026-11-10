# An Tín Korea – Website tư vấn du học Hàn Quốc

React 18 + TypeScript + Tailwind + Framer Motion + Zustand + React Router. Song ngữ Việt (gốc) – Hàn.

## Chạy thử

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # kiểm tra kiểu + build + prerender SEO vào dist/
npm run typecheck
```

Sao chép `.env.example` thành `.env` rồi điền `VITE_ADMIN_PASSCODE` và `VITE_SITE_URL` (tên miền thật, dùng cho canonical, hreflang, sitemap).

## Các trang công khai

| Trang | Tiếng Việt | Tiếng Hàn |
| --- | --- | --- |
| Trang chủ | `/` | `/ko` |
| Giới thiệu | `/gioi-thieu` | `/ko/gioi-thieu` |
| Đội ngũ | `/doi-ngu` | `/ko/doi-ngu` |
| Chương trình | `/chuong-trinh` | `/ko/chuong-trinh` |
| Lộ trình | `/lo-trinh` | `/ko/lo-trinh` |
| Cơ sở vật chất | `/co-so-vat-chat` | `/ko/co-so-vat-chat` |
| Trường đối tác | `/truong-doi-tac` | `/ko/truong-doi-tac` |
| Tin tức | `/tin-tuc` | `/ko/tin-tuc` |
| Bài viết | `/tin-tuc/<slug>` | `/ko/tin-tuc/<slug>` |
| Liên hệ | `/lien-he` | `/ko/lien-he` |

Nút VI / 한국어 trên thanh menu giữ nguyên trang đang xem.

## Quản trị (`/admin`)

Mỗi trang công khai có một trang quản trị riêng (menu “Nội dung từng trang”). Tại mỗi trang có hai tab:
**Tiếng Việt (gốc)** và **한국어 – dịch tay** (hiện câu tiếng Việt bên trên ô dịch). Ô tiếng Hàn để trống thì trang `/ko` hiển thị tiếng Việt.

- **Bài viết**: viết bài chuẩn SEO (slug, meta title/description, ảnh bìa, chuyên mục, thẻ, hẹn giờ đăng, bản nháp) + bản dịch tiếng Hàn.
- **Danh sách trường**, **Thư viện ảnh**: có thêm ô dịch tiếng Hàn cho thành phố, ghi chú, chú thích ảnh.
- **Dịch thuật Việt – Hàn**: tiến độ dịch từng trang.
- **Xuất bản & sao lưu**: xem bên dưới.

Mật khẩu mặc định `antin2026` (đổi bằng `VITE_ADMIN_PASSCODE`). Đây chỉ là cổng phía trình duyệt, **không phải bảo mật thật**.

## Cách đưa nội dung lên website (quan trọng)

Website chưa có máy chủ nên chỉnh sửa ở `/admin` được lưu trong trình duyệt của người quản trị. Để khách và Google thấy:

1. `/admin/publish` → **Tải published.json**.
2. Chép vào `src/data/published.json` (ghi đè).
3. `npm run build` → đưa thư mục `dist/` lên hosting.
4. Quay lại `/admin/publish` → **Xóa bản nháp** để trình duyệt hiển thị đúng bản vừa deploy.

Khách truy cập không bao giờ ghi vào `localStorage` nội dung, nên luôn thấy bản đã xuất bản.

## SEO

- Mỗi trang có `<title>`, mô tả, canonical, `hreflang` vi/ko, Open Graph, JSON-LD (Organization, Article).
- `npm run build` chạy `scripts/prerender.mjs`: sinh HTML tĩnh cho từng trang và bài viết (có sẵn chữ để Google đọc), `sitemap.xml`, `robots.txt` (chặn `/admin`).
- Bản `/ko` của bài viết chỉ được lập chỉ mục khi đã dịch tiêu đề và nội dung.
- Hosting cần rewrite mọi đường dẫn không có file tĩnh về `index.html` (đã kèm `public/_redirects` cho Netlify và `vercel.json`).
- Ảnh bìa bài viết: chép ảnh vào `public/assets/news/` rồi chọn/nhập đường dẫn `/assets/news/ten-anh.jpg`.

## Cần kiểm tra trước khi chạy thật

- **Bản dịch tiếng Hàn nháp** (menu, nút, form, SEO) trong `src/data/koDefaults.ts` do AI soạn – nhờ người bản ngữ rà soát. Nội dung dài (thư ngỏ, chương trình, bài viết) chưa dịch.
- **3 bài viết mẫu** (nhãn “Mẫu”): đọc lại hoặc xóa trước khi công bố.
- **Trường đối tác**: khu vực, thành phố, cờ D-4-1 / D-2 là giá trị tạm; học phí để trống.
- **Form đăng ký tư vấn** hiện chỉ lưu vào trình duyệt người điền (chưa có máy chủ) → công ty chưa nhận được dữ liệu. Cần backend/email/Zalo webhook trước khi chạy thật.
