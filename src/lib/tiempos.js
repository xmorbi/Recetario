/**
 * Detección de tiempos en pasos de cocina.
 * Devuelve una lista de { minutos, etiqueta }.
 *
 * Reglas:
 *  - Ignorar tiempos precedidos por "cada".
 *  - Ignorar tiempos seguidos de "antes de" SOLO cuando el tiempo
 *    ancla una acción posterior:
 *      · "un minuto antes de servir, agrega la salsa" → descartar
 *      · "1 minuto antes de servir agregar la salsa"  → descartar
 *      · "reposar 5 minutos antes de servir"          → mantener
 *      · "refrigerar 4 horas antes de servir"         → mantener
 *    Heurística: tras "antes de [objeto]" hay coma o verbo de acción
 *    → descartar. Si termina en "antes de [objeto]" (o solo puntuación
 *    después) → mantener.
 *  - Duraciones compuestas (Fase 4):
 *      · "1 hora y 30 minutos" → 90 min (un solo timer)
 *      · "1 hora y media"      → 90 min
 *      · "1 hora y cuarto"     → 75 min
 *  - Fracciones: 1/2 hora = 30, 1 1/2 hora = 90, media hora = 30,
 *    una hora = 60, 1,5 horas = 90.
 *  - Rangos ("15-20 minutos"): usar el límite inferior y poner el rango
 *    en la etiqueta.
 *  - Segundos: 30 segundos = 0,5 min.
 *  - Días o más de 12 horas: no crear timer.
 *  - Números en palabra (un/una/uno/medio/media) solo aplican a horas.
 *    Evita falsos positivos como "un sándwich" (1 s) o "un minuto".
 */

const NUM = '(?:\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+[.,]\\d+|\\d+)';
const WORD_NUM = '(?:\\bun[ao]?\\b|\\bmedi[ao]?\\b)';
const ANY_NUM = '(?:' + WORD_NUM + '|' + NUM + ')';
const RANGE_SEP = '(?:[-–]|\\ba\\b|\\bal\\b)';
const UNIT = '(?:hrs?|horas?|h|mins?|minutos?|min|segs?|segundos?|s(?![\\wáéíóúüñÁÉÍÓÚÜÑ])|d[ií]as?)';

const RE = new RegExp(
  '(' + ANY_NUM + ')' +
  '(?:\\s*' + RANGE_SEP + '\\s*(' + ANY_NUM + '))?' +
  '\\s*(' + UNIT + ')\\b',
  'gi'
);

/* Duraciones compuestas:
   "N hora(s) y M minuto(s)" → N*60 + M
   "N hora(s) y media/medio" → N*60 + 30
   "N hora(s) y cuarto"      → N*60 + 15
*/
const RE_HORA_MIN = new RegExp(
  '(' + ANY_NUM + ')\\s*(?:hrs?|horas?|h)\\s+y\\s+' +
  '(' + ANY_NUM + ')\\s*(?:mins?|minutos?|min)\\b',
  'gi'
);

const RE_HORA_MEDIA = new RegExp(
  '(' + ANY_NUM + ')\\s*(?:hrs?|horas?|h)\\s+y\\s+medi[ao]\\b',
  'gi'
);

const RE_HORA_CUARTO = new RegExp(
  '(' + ANY_NUM + ')\\s*(?:hrs?|horas?|h)\\s+y\\s+cuarto\\b',
  'gi'
);

// Verbos que indican que "antes de X" precede a una acción posterior.
// Si la primera palabra tras "antes de [objeto]" coincide, es una
// referencia temporal → descartar el timer.
const RE_VERBO_ACCION = /^(?:agrega|agregar|añade|añadir|pon|pone|poner|saca|sacar|retira|retirar|mezcla|mezclar|revuelve|revolver|bate|batir|tapa|tapar|destapa|destapar|apaga|apagar|enciende|encender|incorpora|incorporar|vierte|verter|baña|bañar|rocía|rociar|espolvorea|espolvorear|sazona|sazonar|deja|dejar|reposa|reposar|refrigera|refrigerar|hornea|hornear|cocina|cocinar|calienta|calentar|sofríe|sofreír|saltea|saltear|sirve|servir|unta|untar|rellena|rellenar|amasa|amasar|estira|estirar|corta|cortar)$/i;

function parseNum(str) {
  str = String(str).trim().toLowerCase();
  if (str === 'un' || str === 'una' || str === 'uno') return 1;
  if (str === 'medio' || str === 'media') return 0.5;
  let m = /^(\d+)\s+(\d+)\/(\d+)$/.exec(str);
  if (m) return parseInt(m[1], 10) + parseInt(m[2], 10) / parseInt(m[3], 10);
  m = /^(\d+)\/(\d+)$/.exec(str);
  if (m) return parseInt(m[1], 10) / parseInt(m[2], 10);
  m = /^(\d+)[.,](\d+)$/.exec(str);
  if (m) return parseFloat(m[1] + '.' + m[2]);
  m = /^(\d+)$/.exec(str);
  if (m) return parseInt(m[1], 10);
  return NaN;
}

function categoriaUnidad(u) {
  u = String(u).toLowerCase();
  if (/^(h|hrs?|horas?)$/.test(u)) return 'h';
  if (/^(min|mins|minutos?)$/.test(u)) return 'min';
  if (/^(s|segs?|segundos?)$/.test(u)) return 's';
  if (/^d[ií]as?$/.test(u)) return 'd';
  return null;
}

function esWordNum(s) {
  return /^(?:un|una|uno|medio|media)$/i.test(String(s).trim());
}

function formatNum(n) {
  if (Number.isInteger(n)) return String(n);
  return String(n).replace('.', ',');
}

// Regla "antes de":
// Antes descartábamos cualquier timer seguido de "antes de X". Eso
// eliminaba esperas reales como "reposar 5 minutos antes de servir".
// Ahora solo descartamos cuando el tiempo ancla una acción posterior:
// "un minuto antes de servir, agrega la salsa".
// Heurística: tras "antes de [objeto]" hay coma o verbo de acción →
// referencia temporal (descartar). Si termina ahí → espera real (mantener).
function esReferenciaTemporal(despues) {
  if (!/^\s*antes\s+de(?:l)?\b/i.test(despues)) return false;
  // Quitar "antes de[l]" + primera palabra (el objeto del "antes de").
  const resto = despues.replace(/^\s*antes\s+de(?:l)?\s+\S*/, '').trim();
  if (!resto) return false;
  if (/^[,;:]/.test(resto)) return true;
  const primera = /^([a-záéíóúñü]+)/i.exec(resto);
  if (primera && RE_VERBO_ACCION.test(primera[1])) return true;
  return false;
}

export function detectarTiempos(texto) {
  if (!texto) return [];
  const t = String(texto);
  const out = []; // { pos, minutos, etiqueta }
  const compositeRanges = []; // [start, end] que el regex simple debe ignorar

  // --- 1) Duraciones compuestas "N hora(s) y M minuto(s)" ---
  RE_HORA_MIN.lastIndex = 0;
  let m;
  while ((m = RE_HORA_MIN.exec(t)) !== null) {
    compositeRanges.push([m.index, m.index + m[0].length]);
    if (/\bcada\s+$/i.test(t.slice(0, m.index))) continue;
    if (esReferenciaTemporal(t.slice(m.index + m[0].length))) continue;
    const horas = parseNum(m[1]);
    const mins = parseNum(m[2]);
    if (isNaN(horas) || isNaN(mins)) continue;
    const total = horas * 60 + mins;
    if (!(total > 0) || total > 720) continue;
    out.push({ pos: m.index, minutos: total, etiqueta: formatNum(total) + ' min' });
  }

  // --- 2) "N hora(s) y media/medio" ---
  RE_HORA_MEDIA.lastIndex = 0;
  while ((m = RE_HORA_MEDIA.exec(t)) !== null) {
    compositeRanges.push([m.index, m.index + m[0].length]);
    if (/\bcada\s+$/i.test(t.slice(0, m.index))) continue;
    if (esReferenciaTemporal(t.slice(m.index + m[0].length))) continue;
    const horas = parseNum(m[1]);
    if (isNaN(horas)) continue;
    const total = horas * 60 + 30;
    if (!(total > 0) || total > 720) continue;
    out.push({ pos: m.index, minutos: total, etiqueta: formatNum(total) + ' min' });
  }

  // --- 3) "N hora(s) y cuarto" ---
  RE_HORA_CUARTO.lastIndex = 0;
  while ((m = RE_HORA_CUARTO.exec(t)) !== null) {
    compositeRanges.push([m.index, m.index + m[0].length]);
    if (/\bcada\s+$/i.test(t.slice(0, m.index))) continue;
    if (esReferenciaTemporal(t.slice(m.index + m[0].length))) continue;
    const horas = parseNum(m[1]);
    if (isNaN(horas)) continue;
    const total = horas * 60 + 15;
    if (!(total > 0) || total > 720) continue;
    out.push({ pos: m.index, minutos: total, etiqueta: formatNum(total) + ' min' });
  }

  // --- 4) Timers simples (rangos, fracciones, etc.) ---
  RE.lastIndex = 0;
  while ((m = RE.exec(t)) !== null) {
    // Si el match cae dentro de una duración compuesta ya detectada,
    // no lo contamos dos veces.
    if (compositeRanges.some(function (r) {
      return m.index < r[1] && (m.index + m[0].length) > r[0];
    })) continue;

    const antes = t.slice(0, m.index);
    const despues = t.slice(m.index + m[0].length);
    if (/\bcada\s+$/i.test(antes)) continue;
    if (esReferenciaTemporal(despues)) continue;

    const cat = categoriaUnidad(m[3]);
    if (!cat || cat === 'd') continue;

    // Word-num (un/una/uno/medio/media) solo para horas.
    if (esWordNum(m[1]) && cat !== 'h') continue;

    const bajo = parseNum(m[1]);
    if (isNaN(bajo)) continue;
    const alto = m[2] ? parseNum(m[2]) : null;

    const factor = cat === 'h' ? 60 : cat === 'min' ? 1 : 1 / 60;
    const minutos = bajo * factor;
    if (!(minutos > 0)) continue;
    if (minutos > 720) continue;

    let etiqueta;
    if (alto !== null && !isNaN(alto)) {
      const u = cat === 'h' ? 'h' : cat === 'min' ? 'min' : 's';
      etiqueta = formatNum(bajo) + '–' + formatNum(alto) + ' ' + u;
    } else if (cat === 's') {
      etiqueta = formatNum(bajo) + ' s';
    } else {
      etiqueta = formatNum(minutos) + ' min';
    }

    out.push({ pos: m.index, minutos, etiqueta });
  }

  // --- 5) Ordenar por posición en el texto y devolver ---
  out.sort(function (a, b) { return a.pos - b.pos; });
  return out.map(function (x) { return { minutos: x.minutos, etiqueta: x.etiqueta }; });
}