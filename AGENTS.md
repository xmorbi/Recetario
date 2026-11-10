# Guía para Agentes y Desarrolladores — Recetario Chileno

Este proyecto está construido con Astro y sigue una arquitectura estricta para mantener la deuda técnica al mínimo. Antes de modificar código, lee las siguientes reglas:

## Arquitectura y Estructura

- **`src/lib/`**: Solo lógica pura (sin DOM). Aquí viven el escalado, los tiempos y la voz. Todo debe ser testeable con Vitest.
- **`src/scripts/`**: Lógica de cliente que interactúa con el DOM (Modo Cocina, carrito, calculadoras). Todos los scripts DEBEN pasar por Vite (usando `<script> import ... </script>`), NUNCA usar `<script src="/public/...">`.
- **`public/`**: Solo archivos estáticos puros (imágenes, favicon, manifest, `sw.js` y verificación de Google). Cero archivos `.js` de lógica.

## Reglas de Datos (V2)

- Las recetas en `src/content/recetas/` usan exclusivamente la estructura `_v2` (`ingredientes_v2`, `pasos_v2`, `tiempo_v2`).
- Los campos heredados de texto plano fueron eliminados. No los vuelvas a introducir.
- Las cantidades de los ingredientes se escalan dinámicamente en el cliente usando `escalarIngrediente()` de `src/lib/escalado.js`.

## Comandos de Desarrollo

- `npm run dev`: Inicia el servidor local.
- `npm run build`: Compila el sitio estático. Es obligatorio que pase en verde antes de hacer commit.
- `npx vitest`: Ejecuta las pruebas unitarias (lógica pura).
- `npx prettier --write .`: Formatea todo el código.
- `npx eslint .`: Revisa errores de sintaxis y buenas prácticas.

## Despliegue

El sitio se compila a HTML estático. Las redirecciones y el manejo de errores 404 se configuran en `astro.config.mjs` (para el enrutador) y `wrangler.jsonc` (para Cloudflare Workers).