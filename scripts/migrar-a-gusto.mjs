// Uso: node scripts/migrar-a-gusto.mjs [--apply]
// Convierte los "1 <ingrediente> (a gusto)" restantes a cantidad:null (sin tocar el resto).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const dir = 'src/content/recetas', apply = process.argv.includes('--apply');
let n = 0;
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const txt = readFileSync(`${dir}/${f}`, 'utf8'); const r = JSON.parse(txt); let cambio = false;
  for (const i of r.ingredientes_v2 ?? []) {
    if (i.cantidad === 1 && !i.unidad && /a gusto|al gusto/i.test(i.nota ?? '')) { i.cantidad = null; i.escalable = false; cambio = true; n++; console.log(`${f}: ${i.nombre}`); }
  }
  if (cambio && apply) writeFileSync(`${dir}/${f}`, JSON.stringify(r, null, 2) + (txt.endsWith('\n') ? '\n' : ''));
}
console.log(`${n} ingredientes ${apply ? 'migrados' : 'por migrar (usa --apply)'}`);
