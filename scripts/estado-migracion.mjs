#!/usr/bin/env node
/**
 * scripts/estado-migracion.mjs
 * Reporta el estado de la migración y opcionalmente aprueba los archivos limpios.
 *
 * Uso:
 *   node scripts/estado-migracion.mjs                              # solo conteo
 *   node scripts/estado-migracion.mjs --warnings warnings.json     # conteo + lista
 *   node scripts/estado-migracion.mjs --aprobar-limpios            # aprobar los sin warnings
 *   node scripts/estado-migracion.mjs --aprobar-limpios --warnings warnings.json
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'src', 'content', 'recetas');

const args = process.argv.slice(2);
const APROBAR = args.includes('--aprobar-limpios');
const warnIdx = args.indexOf('--warnings');
const WARNINGS_PATH = warnIdx >= 0 ? path.resolve(args[warnIdx + 1]) : null;

let conWarn = new Set();
if (WARNINGS_PATH) {
  const data = JSON.parse(await fs.readFile(WARNINGS_PATH, 'utf-8'));
  conWarn = new Set(data.map(w => w.archivo));
}

const archivos = (await fs.readdir(DIR)).filter(f => f.endsWith('.json'));

let total = 0, revisados = 0, pendientes = 0, aprobados = 0, saltados = 0;
const pendientesList = [];

for (const archivo of archivos) {
  total++;
  const ruta = path.join(DIR, archivo);
  const raw = await fs.readFile(ruta, 'utf-8');
  const receta = JSON.parse(raw);

  if (receta.revisado_v2 === true) {
    revisados++;
    continue;
  }

  pendientes++;

  // Aprobar si NO tiene warnings (y no está en la lista de conWarn)
  if (APROBAR && WARNINGS_PATH && !conWarn.has(archivo)) {
    receta.revisado_v2 = true;
    await fs.writeFile(ruta, JSON.stringify(receta, null, 2) + '\n', 'utf-8');
    aprobados++;
    pendientes--;  // ya no está pendiente
  } else {
    pendientesList.push({
      archivo,
      motivo: conWarn.has(archivo) ? 'tiene warnings' : 'sin warnings (pendiente de aprobar)',
      warnings: (WARNINGS_PATH && conWarn.has(archivo)) ? 'ver dump' : null,
    });
  }
}

console.log(`\n📊 Estado de la migración`);
console.log(`   Total archivos:      ${total}`);
console.log(`   ✅ Revisados (true):  ${revisados + aprobados}`);
console.log(`   ⏳ Pendientes:        ${pendientes}`);
if (APROBAR) console.log(`   🆕 Aprobados ahora:   ${aprobados}`);
console.log('');

if (pendientesList.length > 0) {
  console.log(`📋 Pendientes de revisión (${pendientesList.length}):`);
  for (const p of pendientesList) {
    console.log(`   • ${p.archivo} (${p.motivo})`);
  }
  console.log('');
}

if (!APROBAR && WARNINGS_PATH) {
  console.log(`💡 Tip: agrega --aprobar-limpios para marcar true en los archivos sin warnings.`);
}