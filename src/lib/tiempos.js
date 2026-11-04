/**
 * Detección de tiempos en pasos de cocina.
 * Devuelve una lista de { minutos, etiqueta }.
 *
 * Reglas:
 *  - Ignorar tiempos precedidos por "cada" o seguidos de "antes de".
 *  - Fracciones: 1/2 hora = 30, 1 1/2 hora = 90, media hora = 30, una hora = 60, 1,5 horas = 90.
 *  - Rangos ("15-20 minutos"): usar el límite inferior y poner el rango en la etiqueta.
 *  - Segundos: 30 segundos = 0,5 min.
 *  - Días o más de 12 horas: no crear timer.
 */

const NUM = '(?:\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+[.,]\\d+|\\d+)';
const WORD_NUM = '(?:\\bun[ao]?\\b|\\bmedi[ao]?\\b)';
const ANY_NUM = '(?:' + WORD_NUM + '|' + NUM + ')';
const RANGE_SEP = '(?:[-–]|\\ba\\b|\\bal\\b)';
const UNIT = '(?:hrs?|horas?|h|mins?|minutos?|min|segs?|segundos?|s|d[ií]as?)';

const RE = new RegExp(
  '(' + ANY_NUM + ')' +
  '(?:\\s*' + RANGE_SEP + '\\s*(' + ANY_NUM + '))?' +
  '\\s*(' + UNIT + ')\\b',
  'gi'
);

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

function formatNum(n) {
  if (Number.isInteger(n)) return String(n);
  return String(n).replace('.', ',');
}

export function detectarTiempos(texto) {
  if (!texto) return [];
  const t = String(texto);
  const out = [];
  RE.lastIndex = 0;
  let m;
  while ((m = RE.exec(t)) !== null) {
    const antes = t.slice(0, m.index);
    const despues = t.slice(m.index + m[0].length);
    if (/\bcada\s+$/i.test(antes)) continue;
    if (/^\s*antes\s+de(?:l)?\b/i.test(despues)) continue;

    const cat = categoriaUnidad(m[3]);
    if (!cat || cat === 'd') continue;

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

    out.push({ minutos, etiqueta });
  }
  return out;
}