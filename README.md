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
```

`PUBLIC_SITE_URL` es el dominio canónico del sitio, sin barra final. El build y el servidor de desarrollo se abortan a propósito si falta. Para trabajar en local sirve `http://localhost:4321`; en producción, `https://recetario.morbidan.workers.dev`.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo de Astro |
| `npm run build` | Genera el sitio en `dist/` |
| `npm run preview` | Sirve el build local |
| `npm run deploy` | `astro build` y `wrangler deploy` (requiere `wrangler login`) |
| `npm test` | Ejecuta la suite de pruebas con Vitest |

## Pruebas

```bash
npm test
```

Ejecuta la suite con [Vitest](https://vitest.dev/) en modo no interactivo (`vitest run`). Las pruebas cubren funciones puras del proyecto; las que dependen del DOM o del navegador no se ejecutan aquí.

## Estructura del proyecto

```text
src/content/recetas/    Una receta por archivo JSON
src/content.config.ts   Esquema Zod de las recetas
src/pages/              Páginas y endpoints (/recetas/[slug], /api/*.json, herramientas)
src/layouts/Layout.astro
src/styles/global.css
public/                 Scripts del cliente (modo-cocina.js, escalador.js, …) e imágenes (img/)
scripts/                Utilidades de mantenimiento
.github/workflows/      Deploy a Cloudflare Workers
```

No hay backend ni base de datos. El progreso del Modo Cocina, los favoritos, las notas y la lista de compras se guardan en el `localStorage` del navegador de cada persona.

## Agregar una receta

Crea `src/content/recetas/<slug>.json`. El nombre del archivo es la URL (`/recetas/<slug>/`): usa minúsculas, guiones y sin tildes ni `ñ`. Si el JSON no cumple el esquema, el build falla.

Campos obligatorios:

| Campo | Valor |
| --- | --- |
| `titulo` | Texto de al menos 3 caracteres |
| `categoria` | `principales`, `sopas`, `panes`, `ensaladas`, `dulces`, `bebidas`, `once`, `sandwiches` o `mar` |
| `tiempo` | Texto libre, por ejemplo `75 min` |
| `porciones` | Texto libre, por ejemplo `6 personas` |
| `dificultad` | `muy fácil`, `fácil`, `media` o `alta` |
| `ingredientes` | Lista de textos, al menos uno |
| `pasos` | Lista de textos, al menos uno |

Campos opcionales: `tags`, `imagen` (ruta bajo `public/`, por ejemplo `img/Pastel-de-choclo.jpg`, de 1200×675), `tecnica`, `dato`, `advertencia`, `errores` (lista de `{ error, solucion }`) y `conservacion` (`refrigerador`, `congelador`, `recalentar`).

```json
{
  "titulo": "Pastel de choclo",
  "categoria": "principales",
  "tiempo": "75 min",
  "porciones": "6 personas",
  "dificultad": "media",
  "ingredientes": ["6 choclos grandes rallados", "1 taza de leche"],
  "pasos": ["Prepara el pino.", "Cocina el choclo con la leche por 15 minutos."]
}
```

Para que el escalador de porciones y los temporizadores funcionen bien, escribe las cantidades con números (`1 1/2 tazas`, `15 minutos`) y deja las secciones de ingredientes con el formato `Sección: ingrediente`.

## Modo Cocina

Cada receta tiene un botón «Modo cocina» que abre una vista a pantalla completa (`public/modo-cocina.js`) con:

- Pasos grandes, uno a la vez, con progreso guardado por receta.
- Pantalla siempre encendida (Wake Lock), donde el navegador lo permite.
- Temporizadores detectados desde el texto de cada paso, con sonido y vibración.
- Mise en place: las tareas de preparación sacadas de la lista de ingredientes.
- Lectura en voz alta y comandos de voz (siguiente, atrás, listo, repetir), según el navegador.
- Atajos de teclado: `←` y `→` para cambiar de paso, `M` para marcar, `Esc` para cerrar.

El ajuste de porciones vive en `public/escalador.js`.

## Despliegue

Cada push a `main` ejecuta `.github/workflows/deploy.yml`, que instala dependencias, hace el build y despliega con Wrangler. Requiere:

- Variable de repositorio `PUBLIC_SITE_URL` (Settings → Variables).
- Secretos `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`.

Para desplegar a mano: `npm run deploy`.

## Privacidad

Google Tag Manager se carga solo después de que la persona acepta las cookies (ver `src/layouts/Layout.astro`).