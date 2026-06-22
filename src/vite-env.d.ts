interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_ENABLE_ESEWA_SIMULATOR?: string;
  readonly VITE_ENABLE_KHALTI_SIMULATOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.css";
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}
