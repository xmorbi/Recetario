// Uso: node scripts/auditar-aceite.mjs [--apply]
// Lista recetas cuyos pasos sofríen/fríen/saltean pero no listan aceite/grasa; con --apply
// agrega "aceite (para sofreír)" sin cantidad (cantidad:null) para que lo revises a mano.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const dir = 'src/content/recetas', apply = process.argv.includes('--apply');
const grasa = /aceite|mantequilla|manteca|grasa|margarina|oliva/i, usa = /sofr[ií]|fr[ií]e|fre[ií]r|saltea|dora[r]?\b|dora\b/i;
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const txt = readFileSync(`${dir}/${f}`, 'utf8'); const r = JSON.parse(txt);
  const pasos = JSON.stringify(r.pasos_v2 ?? '');
  if (usa.test(pasos) && !(r.ingredientes_v2 ?? []).some((i) => grasa.test(i.nombre))) {
    console.log(`- ${f.replace('.json', '')}`);
    if (apply) { r.ingredientes_v2.push({ cantidad: null, unidad: null, nombre: 'aceite', nota: 'para sofreír', escalable: false }); writeFileSync(`${dir}/${f}`, JSON.stringify(r, null, 2) + '\n'); }
  }
}
