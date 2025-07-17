/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SHORT_URL_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
