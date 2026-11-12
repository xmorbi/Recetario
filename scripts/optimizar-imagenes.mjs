// Uso: node scripts/optimizar-imagenes.mjs [--dry]
// Genera public/img/opt/<nombre>-<ancho>.{avif,webp} (480/800/1200) + src/data/imagenes.json
// con ancho/alto reales. Requiere: sharp (ya viene con Astro). Idempotente: salta lo ya generado.
import sharp from 'sharp';
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SRC = 'public/img', OUT = 'public/img/opt', MANIFEST = 'src/data/imagenes.json';
const ANCHOS = [480, 800, 1200];
const dry = process.argv.includes('--dry');
const slug = (f) => path.parse(f).name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const archivos = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const manifest = {};
let antes = 0, despues = 0;
if (!dry) await mkdir(OUT, { recursive: true });

for (const f of archivos) {
  const ruta = path.join(SRC, f);
  const meta = await sharp(ruta).metadata();
  antes += (await stat(ruta)).size;
  const base = slug(f);
  const variantes = [];
  for (const w of ANCHOS.filter((x) => x <= meta.width) .concat(meta.width < ANCHOS[0] ? [meta.width] : [])) {
    for (const fmt of ['avif', 'webp']) {
      const salida = path.join(OUT, `${base}-${w}.${fmt}`);
      if (!dry && !existsSync(salida)) {
        await sharp(ruta).rotate().resize({ width: w, withoutEnlargement: true })[fmt](fmt === 'avif' ? { quality: 50, effort: 4 } : { quality: 76 }).toFile(salida);
      }
      if (!dry && existsSync(salida)) despues += (await stat(salida)).size;
      variantes.push({ w, fmt, url: `/img/opt/${base}-${w}.${fmt}` });
    }
  }
  const h = Math.round((meta.height / meta.width) * Math.min(meta.width, 1200));
  manifest[`img/${f}`] = { ancho: Math.min(meta.width, 1200), alto: h, variantes };
}
if (!dry) { await mkdir('src/data', { recursive: true }); await writeFile(MANIFEST, JSON.stringify(manifest, null, 1)); }
console.log(`${archivos.length} originales: ${(antes / 1e6).toFixed(1)} MB → ${dry ? '(dry)' : (despues / 1e6).toFixed(1) + ' MB entre todas las variantes'}`);
