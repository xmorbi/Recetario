// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // FASE 3 (auditoría): URLs limpias (sin .html) + trailing slash siempre
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
});