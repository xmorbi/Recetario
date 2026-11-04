// Auditoría de detección de tiempos.
// Compara el detector viejo (suma bruta de horas/minutos, el que tenía
// modo-cocina.js antes de Fase 4) con el nuevo (lista de timers de
// src/lib/tiempos.js) y clasifica cada diferencia.
//
// Criterio de aceptación (Fase 4): solo deben quedar como "(revisar)"
// los pasos que requieran decisión humana. Idealmente, ninguno.
//
// Uso: node scripts/auditar-tiempos.mjs

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectarTiempos } from '../src/lib/tiempos.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const RECETAS_DIR = join(__dirname, '..', 'src', 'content', 'recetas');

function detectarTiempoViejo(texto) {
  if (!texto) return null;
  let totalMin = 0, tiene = false, m;
  const reHoras = /(\d+)\s*(?:h|hrs?|horas?)\b/gi;
  while ((m = reHoras.exec(texto)) !== null) { totalMin += parseInt(m[1], 10) * 60; tiene = true; }
  const reMin = /(\d+)\s*(?:min|mins|minutos?)\b/gi;
  while ((m = reMin.exec(texto)) !== null) { totalMin += parseInt(m[1], 10); tiene = true; }
  if (!tiene || totalMin <= 0) return null;
  return { minutos: totalMin };
}

const RE_CADA = /\bcada\s+\d/i;
const RE_ANTES_DE = /\d+\s*(?:min|mins|minutos?|h|horas?)\s+antes\s+de/i;
const RE_DIAS = /\bd[ií]as?\b/i;
const RE_FRACCION = /\d+\s*\/\s*\d+/;
const RE_MEDIA_UNA_HORA = /\b(media|una)\s+hora\b/i;
const RE_SEGUNDOS = /\d+\s*segundos?/i;
const RE_RANGO = /\d+(?:[.,]\d+)?\s*(?:[-–]|\ba\b|\bal\b)\s*\d+/i;

function clasificar(paso, viejo, nuevo, tieneManual) {
  if (tieneManual) return 'manual (revisado)';
  const v = viejo ? viejo.minutos : null;
  const n = nuevo.length > 0 ? nuevo.reduce((s, t) => s + t.minutos, 0) : null;

  if (v === null && n === null) return 'sin-diff';
  if (nuevo.length > 1) return 'multi-timer (esperado)';

  if (v === null && n !== null) {
    if (RE_FRACCION.test(paso)) return 'fraccion-nueva (esperado)';
    if (RE_MEDIA_UNA_HORA.test(paso)) return 'media-una-hora (esperado)';
    if (RE_SEGUNDOS.test(paso)) return 'segundos (esperado)';
    return 'nuevo-detecta (revisar)';
  }
  if (v !== null && n === null) {
    if (RE_CADA.test(paso)) return 'cada-N (esperado)';
    if (RE_ANTES_DE.test(paso)) return 'antes-de (esperado)';
    if (RE_DIAS.test(paso)) return 'dias (esperado)';
    if (v > 720) return 'mas-12h (esperado)';
    return 'nuevo-ignora (revisar)';
  }
  if (v === n) return 'sin-diff';
  if (RE_CADA.test(paso)) return 'cada-N-suma (esperado)';
  if (RE_FRACCION.test(paso)) return 'fraccion-vieja (esperado)';
  if (RE_MEDIA_UNA_HORA.test(paso)) return 'media-una-hora (esperado)';
  if (RE_RANGO.test(paso)) return 'rango (esperado)';
  return 'total-distinto (revisar)';
}

async function main() {
  const archivos = (await readdir(RECETAS_DIR)).filter(f => f.endsWith('.json')).sort();
  const resumen = {};
  const aRevisar = [];
  for (const archivo of archivos) {
    const raw = await readFile(join(RECETAS_DIR, archivo), 'utf8');
    let receta;
    try { receta = JSON.parse(raw); } catch { continue; }
    const pasos = receta.pasos || [];
    const manuales = new Set((receta.timers || []).map(t => t.paso));
    pasos.forEach((paso, i) => {
      const num = i + 1;
      const tieneManual = manuales.has(num);
      const viejo = detectarTiempoViejo(paso);
      const nuevo = detectarTiempos(paso);
      const cat = clasificar(paso, viejo, nuevo, tieneManual);
      resumen[cat] = (resumen[cat] || 0) + 1;
      if (cat.endsWith('(revisar)')) {
        aRevisar.push({ archivo, paso: num, cat, viejo, nuevo, texto: paso });
      }
    });
  }
  console.log('\nResumen por categoría:');
  Object.keys(resumen).sort().forEach(k => console.log(`  ${k}: ${resumen[k]}`));
  if (aRevisar.length === 0) {
    console.log('\n✅ Ningún paso requiere decisión manual. Criterio de aceptación cumplido.');
  } else {
    console.log(`\n⚠ ${aRevisar.length} pasos requieren decisión:`);
    aRevisar.forEach(r => {
      console.log(`\n${r.archivo} — paso ${r.paso} [${r.cat}]`);
      console.log(`  viejo: ${r.viejo ? r.viejo.minutos + ' min' : '(sin timer)'}`);
      console.log(`  nuevo: ${r.nuevo.length ? r.nuevo.map(t => t.etiqueta + ' (' + t.minutos + ')').join(', ') : '(sin timer)'}`);
      console.log(`  texto: ${r.texto.slice(0, 160)}${r.texto.length > 160 ? '…' : ''}`);
    });
  }
}

main().catch(err => { console.error(err); process.exit(1); });