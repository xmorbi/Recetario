import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import gtm from 'astro-gtm-lite'; // <-- NUEVO: Importación de GTM
import { loadEnv } from 'vite';

// ⚠️ CRÍTICO: Cargar el .env ANTES de leer process.env.
// Astro ejecuta este archivo en Node puro, por lo que las variables de .env
// no están en process.env por defecto. loadEnv las inyecta.
const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
const site = env.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL;

if (!site) {
  throw new Error(
    '[recetario] Falta la variable PUBLIC_SITE_URL. ' +
      'Define el dominio canónico (ej. https://recetariochileno.cl) ' +
      'en .env o en el entorno del CI. El build se aborta a propósito.'
  );
}

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // ⚠️ CAMBIO (perf): el CSS global ahora vive en src/styles/global.css (importado
    // desde Layout.astro). Con 'auto' Astro solo inlinea hojas < 4 KB
    // (vite.build.assetsInlineLimit); global.css pesa ~116 KB, así que 'auto' lo
    // dejaría como archivo externo bloqueante. Con 'always' se inyecta en el <head>
    // de cada página y desaparece la petición render-blocking.
    // Si prefieres caché entre páginas a costa de una petición CSS, vuelve a 'auto'.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap(),
    gtm({ id: 'GTM-KXH425KQ' }) // <-- NUEVO: Integración de GTM
  ],
  adapter: cloudflare({
    // FASE 3: procesar imágenes en build-time (elimina warning de IMAGES en runtime)
    imageService: 'compile',
    platformProxy: {
      enabled: true,
    },
  }),
});