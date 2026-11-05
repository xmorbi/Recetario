/* =================================================================
   VOZ.JS — Interpretación de comandos de voz (Fase 7)
   Función pura, sin dependencias del DOM.

   Reglas:
   - Normaliza a minúsculas sin tildes (aPlano).
   - Solo acepta frases de 3 palabras o menos.
   - Coincidencia por palabra completa (no substring).
   - Devuelve uno de: 'siguiente', 'atras', 'listo', 'repetir',
     'empezar', 'pausa', 'reanudar', 'tiempo', 'ingredientes' o null.

   El flag enMise filtra los comandos que no aplican a mise en place
   (pausa/reanudar/tiempo/ingredientes). En modo cocina normal están
   todos disponibles.
   ================================================================= */

export function aPlano(s) {
  var out = '';
  for (var i = 0; i < s.length; i++) {
    var c = s.charAt(i).normalize('NFD').charAt(0);
    out += c.toLowerCase();
  }
  return out;
}

export function interpretarComando(texto, enMise) {
  if (typeof texto !== 'string') return null;

  var plano = aPlano(texto).replace(/\s+/g, ' ').trim();
  if (!plano) return null;

  // Solo frases cortas: 3 palabras o menos.
  var palabras = plano.split(' ').filter(function (p) { return p.length > 0; });
  if (palabras.length === 0 || palabras.length > 3) return null;

  // --- Comandos multi-palabra (solo modo cocina normal) ---
  if (!enMise) {
    if (/\bcuanto\s+falta\b/.test(plano)) return 'tiempo';
    if (/\bcuanto\s+tiempo\b/.test(plano)) return 'tiempo';
  }

  // --- Comandos válidos en ambos modos ---
  if (/\bsiguiente\b/.test(plano) || /\bavanzar\b/.test(plano)) return 'siguiente';
  if (/\batras\b/.test(plano) || /\banterior\b/.test(plano)) return 'atras';
  if (/\blisto\b/.test(plano) || /\bhecho\b/.test(plano) || /\bmarcar\b/.test(plano)) return 'listo';
  if (/\brepetir\b/.test(plano) || /\bleer\b/.test(plano)) return 'repetir';

  // --- "empezar" y sinónimos (solo mise en place) ---
  if (enMise) {
    if (/\bempezar\b/.test(plano) || /\bcocinar\b/.test(plano) ||
        /\bcontinuar\b/.test(plano) || /\bvamos\b/.test(plano)) return 'empezar';
  }

  // --- Comandos exclusivos del modo cocina normal ---
  if (!enMise) {
    if (/\bpausa\b/.test(plano) || /\bpausar\b/.test(plano)) return 'pausa';
    if (/\breanudar\b/.test(plano)) return 'reanudar';
    if (/\btiempo\b/.test(plano)) return 'tiempo';
    if (/\bingredientes\b/.test(plano)) return 'ingredientes';
  }

  return null;
}