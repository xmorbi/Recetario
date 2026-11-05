/* =================================================================
   MIGRAR-ESTRUCTURA.MJS — Fase 10
   =================================================================
   Lee cada JSON de src/content/recetas/, y para las recetas que aún
   no tienen revisado_v2 === true, escribe los campos _v2 en borrador
   (revisado_v2: false). El humano revisa y cambia a true.

   Uso:
     node scripts/migrar-estructura.mjs
     node scripts/migrar-estructura.mjs --solo pan-de-pascua,panqueques-con-manjar
     node scripts/migrar-estructura.mjs --force   (sobrescribe aunque revisado_v2 sea true)

   No toca los campos originales (titulo, ingredientes, pasos, etc.).
   Hace copia .bak.json antes de escribir.
   ================================================================= */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { parsearIngredienteTexto } from '../src/lib/escalado.js';
import { detectarTiempos } from '../src/lib/tiempos.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RECETAS_DIR = join(__dirname, '..', 'src', 'content', 'recetas');

// ---- Helpers de tiempo ----
function parsearTiempoV2(tiempoStr) {
  // "1 h 30 min + reposo" → { preparacion?, coccion?, reposo? }
  // Heurística muy básica. El humano corrige.
  const out = {};
  if (!tiempoStr) return out;
  const s = String(tiempoStr).toLowerCase();

  if (/reposo|reposar|marinar|marinado|macerar|remojo|nunca|nevera|refriger/.test(s)) {
    const mRep = /(\d+)\s*(?:h|hrs?|horas?|min|minutos?)/g;
    let total = 0, mm;
    while ((mm = mRep.exec(s)) !== null) {
      const n = parseInt(mm[1], 10);
      total += /h|hrs?|horas?/.test(mm[0]) ? n * 60 : n;
    }
    if (total > 0) out.reposo = total;
  }

  const mCoccion = /(\d+)\s*(?:h|hrs?|horas?)\s*(?:(\d+)\s*(?:min|minutos?))?/.exec(s);
  if (mCoccion) {
    const h = parseInt(mCoccion[1], 10);
    const min = mCoccion[2] ? parseInt(mCoccion[2], 10) : 0;
    const total = h * 60 + min;
    if (total > 0) out.coccion = total;
  } else {
    const mMin = /(\d+)\s*(?:min|minutos?)/.exec(s);
    if (mMin) out.coccion = parseInt(mMin[1], 10);
  }

  return out;
}

// ---- Migración de una receta ----
function migrarReceta(receta) {
  const copia = JSON.parse(JSON.stringify(receta));

  // Ingredientes v2
  if (Array.isArray(receta.ingredientes)) {
    copia.ingredientes_v2 = receta.ingredientes
      .map((linea) => parsearIngredienteTexto(linea))
      .filter(Boolean);
  }

  // Pasos v2
  if (Array.isArray(receta.pasos)) {
    copia.pasos_v2 = receta.pasos.map((texto, i) => {
      const det = detectarTiempos(texto);
      const paso = { texto: texto };
      // Timers manuales de la receta tienen prioridad sobre detección regex.
      const manuales = Array.isArray(receta.timers)
        ? receta.timers.filter((t) => t.paso === i + 1)
        : [];
      if (manuales.length > 0) {
        paso.timers = manuales.map((t) => ({
          minutos: t.minutos,
          etiqueta: t.etiqueta || `${String(t.minutos).replace('.', ',')} min`
        }));
      } else if (det.length > 0) {
        paso.timers = det.map((t) => ({
          minutos: t.minutos,
          etiqueta: t.etiqueta
        }));
      }
      return paso;
    });
  }

  // tiempo_v2
  const tv = parsearTiempoV2(receta.tiempo);
  if (Object.keys(tv).length > 0) copia.tiempo_v2 = tv;

  copia.revisado_v2 = false;
  return copia;
}

// ---- CLI ----
async function main() {
  const args = process.argv.slice(2);
  const soloArg = args.find((a) => a.startsWith('--solo='));
  const solo = soloArg ? soloArg.replace('--solo=', '').split(',').map((s) => s.trim()) : null;
  const force = args.includes('--force');

  const archivos = (await readdir(RECETAS_DIR)).filter((f) => f.endsWith('.json') && !f.endsWith('.bak.json'));

  let procesadas = 0, saltadas = 0;

  for (const archivo of archivos) {
    const slug = basename(archivo, '.json');
    if (solo && !solo.includes(slug)) continue;

    const ruta = join(RECETAS_DIR, archivo);
    const raw = await readFile(ruta, 'utf8');
    let receta;
    try { receta = JSON.parse(raw); }
    catch (e) { console.warn(`[skip] ${archivo}: JSON inválido`); continue; }

    if (receta.revisado_v2 === true && !force) {
      console.log(`[skip] ${archivo}: ya está revisado_v2=true (usa --force para sobrescribir)`);
      saltadas++;
      continue;
    }

    const migrada = migrarReceta(receta);

    // Backup
    await writeFile(ruta.replace(/\.json$/, '.bak.json'), raw, 'utf8');

    // Escribir
    await writeFile(ruta, JSON.stringify(migrada, null, 2) + '\n', 'utf8');
    console.log(`[ok] ${archivo}: _v2 escrito (revisado_v2: false) — revisa a mano y cambia a true`);
    procesadas++;
  }

  console.log(`\nListo. Procesadas: ${procesadas}. Saltadas: ${saltadas}.`);
  console.log('Recuerda: cada receta migrada necesita revisión humana y luego revisado_v2: true.');
}

main().catch((e) => { console.error(e); process.exit(1); });