# Recetario Chileno 🇨🇱

Sitio estático de recetas chilenas construido con Astro, enfocado en rendimiento, accesibilidad y buenas prácticas.

- **Producción:** https://recetario.morbidan.workers.dev
- **Stack:** Astro (static) + Content Collections con Zod + TypeScript estricto + Vite
- **Hosting:** Cloudflare Workers
- **Páginas:** ~312 rutas generadas estáticamente

## Requisitos

- Node.js 22 (ver `.nvmrc`)
- npm 11+

## Instalación

```bash
git clone https://github.com/xmorbi/Recetario.git
cd Recetario
npm ci
cp .env.example .env
# Edita .env y define PUBLIC_SITE_URL con la URL de tu entorno local o producción