// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// Centralización de dominio:
// - En local, Netlify y CI sin env var → fallback al dominio actual.
// - El día que exista el dominio final, se setea SITE_URL en Netlify
//   env vars → deploy → cero cambios de código.
const SITE_URL = process.env.SITE_URL || 'https://recetariochileno.netlify.app';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,

  // FASE 3 (auditoría): URLs limpias (sin .html) + trailing slash siempre
  trailingSlash: 'always',

  build: {
    format: 'directory'
  },

  integrations: [
    sitemap({
      // Mejora 4: Excluir páginas noindex del sitemap
      filter: (page) => !page.includes('/gracias/') && !page.includes('/mis-recetas/'),
    }),
  ]
});