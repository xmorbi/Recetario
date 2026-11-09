import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// ⚠️ CRÍTICO: Cargar el .env ANTES de leer process.env.
const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
const site = env.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL;

if (!site) {
  throw new Error(
    '[recetario] Falta la variable PUBLIC_SITE_URL. ' +
      'Define el dominio canónico (ej. https://recetario.morbidan.workers.dev) ' +
      'en .env o en el entorno del CI. El build se aborta a propósito.'
  );
}

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  integrations: [
    // Forzamos la generación del índice de sitemap
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
    // GTM se carga desde Layout.astro (cargarGTM) solo tras el consentimiento de cookies.
  ],
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true,
    },
  }),
});
