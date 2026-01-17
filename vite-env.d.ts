// Manually define ImportMetaEnv and ImportMeta to resolve type errors
// when vite/client types are missing.

interface ImportMetaEnv {
  readonly VITE_GOOGLE_SHEET_URL: string;
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
