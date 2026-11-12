// Uso: node scripts/fotos-faltantes.mjs > fotos-faltantes.csv
// Lista las recetas sin foto, priorizadas (categorías más pobladas primero) con el nombre de archivo
// sugerido: public/img/<slug>.jpg. Al subir las fotos, ejecuta optimizar-imagenes.mjs y rellena "imagen".
import { readdirSync, readFileSync } from 'node:fs';
const dir = 'src/content/recetas', filas = [], porCat = {};
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const r = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')); porCat[r.categoria] = (porCat[r.categoria] ?? 0) + 1;
  if (!r.imagen) filas.push({ slug: f.replace('.json', ''), titulo: r.titulo, categoria: r.categoria });
}
filas.sort((a, b) => porCat[b.categoria] - porCat[a.categoria] || a.slug.localeCompare(b.slug));
console.log('prioridad,slug,titulo,categoria,archivo_sugerido');
filas.forEach((x, i) => console.log(`${i + 1},${x.slug},"${x.titulo}",${x.categoria},img/${x.slug}.jpg`));
