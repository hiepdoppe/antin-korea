/** Đường dẫn công khai (tiếng Việt, thân thiện SEO). Bản tiếng Hàn dùng tiền tố /ko. */
export const ROUTES = {
  home: '/',
  about: '/gioi-thieu',
  team: '/doi-ngu',
  programs: '/chuong-trinh',
  roadmap: '/lo-trinh',
  facilities: '/co-so-vat-chat',
  universities: '/truong-doi-tac',
  news: '/tin-tuc',
  contact: '/lien-he',
} as const

export type RouteKey = keyof typeof ROUTES

export const NAV_KEYS: RouteKey[] = ['about', 'team', 'programs', 'roadmap', 'facilities', 'universities', 'news', 'contact']
