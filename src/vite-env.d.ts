//src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GUTENDEX_URL?: string;
  readonly VITE_HAWK_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
