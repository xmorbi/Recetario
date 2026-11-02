import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// `site` es obligatorio. Sin dominio canónico no se pueden generar
// canonical, sitemap ni JSON-LD correctamente. Netlify está descartado:
// no hay fallback hardcodeado.
const site =
  import.meta.env?.PUBLIC_SITE_URL ||
  process.env.PUBLIC_SITE_URL;

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
  },
  adapter: cloudflare({
    // FASE 3: procesar imágenes en build-time (elimina warning de IMAGES en runtime)
    imageService: 'compile',
    platformProxy: {
      enabled: true,
    },
  }),
});