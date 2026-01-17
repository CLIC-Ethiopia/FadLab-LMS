// Removed reference to missing vite/client type definitions

interface ImportMetaEnv {
  readonly VITE_GOOGLE_SHEET_API_URL: string
  readonly API_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}