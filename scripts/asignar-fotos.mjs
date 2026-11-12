// Uso: node scripts/asignar-fotos.mjs [--apply]
// Si existe public/img/<slug>.(jpg|jpeg|png|webp) y la receta tiene imagen:null, rellena el campo.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const dir = 'src/content/recetas', apply = process.argv.includes('--apply');
const fotos = new Map(readdirSync('public/img').map((f) => [f.replace(/\.[^.]+$/, '').toLowerCase(), f]));
let n = 0;
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const slug = f.replace('.json', ''), txt = readFileSync(`${dir}/${f}`, 'utf8'), r = JSON.parse(txt);
  if (!r.imagen && fotos.has(slug)) { r.imagen = `img/${fotos.get(slug)}`; n++; console.log(`${slug} → ${r.imagen}`); if (apply) writeFileSync(`${dir}/${f}`, JSON.stringify(r, null, 2) + '\n'); }
}
console.log(`${n} asignaciones`);
