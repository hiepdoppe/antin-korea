/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_PASSCODE?: string
  readonly VITE_SITE_URL?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
