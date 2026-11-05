# Recetario Chileno

Sitio estático de recetas chilenas construido con Astro y desplegado en Cloudflare Workers.

- **Producción:** https://recetario.morbidan.workers.dev
- **Stack:** Astro (static) + content collections con Zod + TypeScript estricto
- **Hosting:** Cloudflare Workers (assets + worker)
- **Páginas:** ~311

## Requisitos

- Node.js 22 (ver `.nvmrc`)
- npm 11+

## Instalación

```bash
git clone https://github.com/xmorbi/Recetario.git
cd Recetario
npm ci
cp .env.example .env
# edita .env y define PUBLIC_SITE_URL