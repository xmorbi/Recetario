#!/usr/bin/env node
/* Migra ingredientes_v2 con { cantidad: 1, unidad vacía, nota "a gusto" }
   a { cantidad: null } para que no se muestre "1 sal y pimienta (a gusto)".

   Uso:
     node scripts\migrar-a-gusto.mjs --dry-run    # solo muestra
     node scripts\migrar-a-gusto.mjs              # aplica + deja .bak
     node scripts\migrar-a-gusto.mjs --no-backup  # aplica sin .bak
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/content/recetas');
const DRY = process.argv.includes('--dry-run');
const SIN_BACKUP = process.argv.includes('--no-backup');
const RE_A_GUSTO = /\ba\s+gusto\b/i;

function esCasoAGusto(ing) {
  if (!ing || typeof ing !== 'object') return false;
  if (ing.cantidad !== 1) return false;
  if (ing.cantidadMax != null && ing.cantidadMax !== 1) return false;
  const u = ing.unidad;
  if (u != null && String(u).trim() !== '') return false;
  if (typeof ing.nota !== 'string') return false;
  return RE_A_GUSTO.test(ing.nota);
}

let archivosRevisados = 0;
let archivosModificados = 0;
let ingredientesCambiados = 0;
const cambios = [];

for (const f of fs.readdirSync(DIR).sort()) {
  if (!f.endsWith('.json')) continue;
  const full = path.join(DIR, f);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (e) {
    console.error(`[!] JSON inválido: ${f} — ${e.message}`);
    continue;
  }
  const ings = data.ingredientes_v2;
  if (!Array.isArray(ings)) continue;
  archivosRevisados++;

  let cambiosArchivo = 0;
  ings.forEach((ing, idx) => {
    if (!esCasoAGusto(ing)) return;
    cambios.push({ archivo: f, indice: idx, nombre: ing.nombre, nota: ing.nota });
    ing.cantidad = null;
    if (ing.cantidadMax != null) ing.cantidadMax = null;
    cambiosArchivo++;
  });

  if (cambiosArchivo > 0) {
    archivosModificados++;
    ingredientesCambiados += cambiosArchivo;
    if (!DRY) {
      if (!SIN_BACKUP) fs.copyFileSync(full, full + '.bak');
      fs.writeFileSync(full, JSON.stringify(data, null, 2) + '\n');
    }
  }
}

const etiqueta = DRY ? 'DRY-RUN (nada escrito)' : 'MIGRACIÓN APLICADA';
console.log(`\n${etiqueta}`);
console.log(`Archivos revisados:      ${archivosRevisados}`);
console.log(`Archivos modificados:    ${archivosModificados}`);
console.log(`Ingredientes migrados:   ${ingredientesCambiados}`);

if (DRY && cambios.length) {
  console.log('\nPrimeros 20 cambios:');
  for (const c of cambios.slice(0, 20)) {
    console.log(`  · ${c.archivo} #${c.indice}: "${c.nombre}" (nota: ${JSON.stringify(c.nota)})`);
  }
  if (cambios.length > 20) console.log(`  … y ${cambios.length - 20} más.`);
}

if (!DRY && ingredientesCambiados > 0) {
  console.log(`\nListo. Revisa con: git diff --stat`);
  if (!SIN_BACKUP) {
    console.log('Se dejaron copias .bak junto a cada archivo.');
    console.log('Bórralas con: del /s src\\content\\recetas\\*.json.bak');
  }
}