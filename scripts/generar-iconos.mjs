/* Genera public/icons/icon-192.png, icon-512.png y icon-512-maskable.png
   a partir de public/favicon.svg.
   Uso: node scripts/generar-iconos.mjs
   Requiere: npm install --save-dev sharp
*/

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const RUTA_SVG = resolve('public/favicon.svg');
const DIR_SALIDA = resolve('public/icons');

const TAMANOS = [
  { nombre: 'icon-192.png', size: 192 },
  { nombre: 'icon-512.png', size: 512 },
  { nombre: 'icon-512-maskable.png', size: 512, maskable: true }
];

async function main() {
  await mkdir(DIR_SALIDA, { recursive: true });

  for (const { nombre, size, maskable } of TAMANOS) {
    const destino = resolve(DIR_SALIDA, nombre);
    let pipeline = sharp(RUTA_SVG).resize(size, size, { fit: 'contain', background: { r: 253, g: 248, b: 240, alpha: 1 } });

    if (maskable) {
      // Deja un margen de seguridad del 10 % para la zona maskable.
      const inner = Math.round(size * 0.8);
      const borde = Math.round((size - inner) / 2);
      pipeline = sharp(RUTA_SVG)
        .resize(inner, inner, { fit: 'contain', background: { r: 253, g: 248, b: 240, alpha: 1 } })
        .extend({
          top: borde,
          bottom: borde,
          left: borde,
          right: borde,
          background: { r: 253, g: 248, b: 240, alpha: 1 }
        })
        .resize(size, size);
    }

    await pipeline.png().toFile(destino);
    console.log(`✔ ${nombre}`);
  }
}

main().catch((err) => {
  console.error('Error generando iconos:', err);
  process.exit(1);
});