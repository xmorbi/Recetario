// Auditoría de detección de tiempos.
// Compara la detección vieja (suma de horas/minutos, la que tenía modo-cocina.js)
// con la nueva (lista de timers de src/lib/tiempos.js) e imprime los pasos donde difieren.
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
  let totalMin = 0;
  let tiene = false;
  let m;
  const reHoras = /(\d+)\s*(?:h|hrs?|horas?)\b/gi;
  while ((m = reHoras.exec(texto)) !== null) { totalMin += parseInt(m[1], 10) * 60; tiene = true; }
  const reMin = /(\d+)\s*(?:min|mins|minutos?)\b/gi;
  while ((m = reMin.exec(texto)) !== null) { totalMin += parseInt(m[1], 10); tiene = true; }
  if (!tiene || totalMin <= 0) return null;
  return { minutos: totalMin };
}

function totalNuevo(tiempos) {
  return tiempos.reduce((s, t) => s + t.minutos, 0);
}

async function main() {
  const archivos = (await readdir(RECETAS_DIR)).filter(f => f.endsWith('.json')).sort();
  let totalDif = 0;
  for (const archivo of archivos) {
    const raw = await readFile(join(RECETAS_DIR, archivo), 'utf8');
    let receta;
    try { receta = JSON.parse(raw); } catch { continue; }
    const pasos = receta.pasos || [];
    pasos.forEach((paso, i) => {
      const viejo = detectarTiempoViejo(paso);
      const nuevo = detectarTiempos(paso);
      const presenciaDistinta = (viejo === null) !== (nuevo.length === 0);
      const minutosDistintos = viejo !== null && nuevo.length > 0 && viejo.minutos !== totalNuevo(nuevo);
      const multiTimer = viejo !== null && nuevo.length > 1;
      if (!presenciaDistinta && !minutosDistintos && !multiTimer) return;
      totalDif++;
      console.log(`\n${archivo} — paso ${i + 1}`);
      console.log(`  viejo: ${viejo ? viejo.minutos + ' min' : '(sin timer)'}`);
      console.log(`  nuevo: ${nuevo.length ? nuevo.map(t => t.etiqueta + ' (' + t.minutos + ')').join(', ') : '(sin timer)'}`);
      console.log(`  texto: ${paso.slice(0, 140)}${paso.length > 140 ? '…' : ''}`);
    });
  }
  console.log(`\nTotal de pasos con diferencias: ${totalDif}`);
}

main().catch(err => { console.error(err); process.exit(1); });