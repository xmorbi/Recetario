/* =================================================================
   ESCALADO.JS — Funciones puras de escalado de recetas
   =================================================================
   Movidas desde src/scripts/escalador.js en la Fase 2.

   - extraerPorciones:    detecta porciones base desde un string
   - formatearPorciones:  describe las porciones finales
   - formatearNumero:     convierte un número a texto (fracciones unicode)
   - escalarIngrediente:  multiplica cada cantidad UNA SOLA VEZ
   ================================================================= */

export function extraerPorciones(str) {
  if (!str) return null;
  str = String(str).trim();

  // Caso especial: "X (Y porciones)" → usar Y
  var paren = /\((\d+)\s*(porciones?|personas?)\)/i.exec(str);
  if (paren) {
    return {
      min: parseInt(paren[1], 10),
      max: null,
      unidad: paren[2].toLowerCase(),
      texto: str
    };
  }

  // "X a Y unidad"
  var rango = /(\d+)\s+(?:a|al|-)\s+(\d+)\s+(personas?|porciones?|unidades?|vasos?|tazas?)/i.exec(str);
  if (rango) {
    return {
      min: parseInt(rango[1], 10),
      max: parseInt(rango[2], 10),
      unidad: rango[3].toLowerCase(),
      texto: str
    };
  }

  // "X unidad"
  var simple = /(\d+)\s+(personas?|porciones?|unidades?|vasos?|tazas?|molde(?:s)?)/i.exec(str);
  if (simple) {
    return {
      min: parseInt(simple[1], 10),
      max: null,
      unidad: simple[2].toLowerCase(),
      texto: str
    };
  }

  // Fallback: primer número de la cadena
  var fallback = /(\d+)/.exec(str);
  if (fallback) {
    return {
      min: parseInt(fallback[1], 10),
      max: null,
      unidad: '',
      texto: str
    };
  }

  return null;
}

export function formatearPorciones(porciones, factor) {
  var min = Math.round(porciones.min * factor * 10) / 10;
  var max = porciones.max != null ? Math.round(porciones.max * factor * 10) / 10 : null;
  var unidad = porciones.unidad;

  var unidadFinal = unidad;
  if (unidad && (min !== 1 || (max != null && max !== 1))) {
    if (unidad === 'persona') unidadFinal = 'personas';
    else if (unidad === 'porción') unidadFinal = 'porciones';
    else if (unidad === 'unidad') unidadFinal = 'unidades';
    else if (unidad === 'vaso') unidadFinal = 'vasos';
    else if (unidad === 'taza') unidadFinal = 'tazas';
    else if (unidad === 'molde') unidadFinal = 'moldes';
  } else if (unidad && min === 1) {
    if (unidad === 'personas') unidadFinal = 'persona';
    else if (unidad === 'porciones') unidadFinal = 'porción';
    else if (unidad === 'unidades') unidadFinal = 'unidad';
    else if (unidad === 'vasos') unidadFinal = 'vaso';
    else if (unidad === 'tazas') unidadFinal = 'taza';
    else if (unidad === 'moldes') unidadFinal = 'molde';
  }

  if (max != null && max !== min) {
    return min + ' a ' + max + (unidadFinal ? ' ' + unidadFinal : '');
  }
  return min + (unidadFinal ? ' ' + unidadFinal : '');
}

export function formatearNumero(n) {
  if (!isFinite(n) || n < 0) return '0';
  if (n === 0) return '0';

  var ent = Math.floor(n);
  var resto = n - ent;

  // Devolver como fracción unicode cuando sea "bonito"
  var fracciones = [
    [1 / 4, '¼'],
    [1 / 3, '⅓'],
    [1 / 2, '½'],
    [2 / 3, '⅔'],
    [3 / 4, '¾']
  ];
  for (var i = 0; i < fracciones.length; i++) {
    if (Math.abs(resto - fracciones[i][0]) < 0.04) {
      return (ent > 0 ? String(ent) : '') + fracciones[i][1];
    }
  }

  // Entero
  if (Math.abs(n - Math.round(n)) < 0.05) {
    return String(Math.round(n));
  }

  // Un decimal (con coma para español de Chile)
  return String(Math.round(n * 10) / 10).replace('.', ',');
}

/* ============================================================
   ESCALADO DE INGREDIENTES (una sola pasada)
   ============================================================ */

// Alternativa ordenada:
//   1) entero con fracción → "1 1/2"
//   2) fracción            → "1/2"
//   3) decimal             → "1,5" o "1.5"
//   4) entero              → "3"
var NUMERO_REGEX = /(\d+)\s+(\d+)\s*\/\s*(\d+)|(\d+)\s*\/\s*(\d+)|(\d+)[.,](\d+)|\b(\d+)\b/g;

// Unidades que NO deben escalarse cuando siguen al número.
// Se ancla con \b para no confundir "h" con "harina" ni "min" con "mínimo".
var UNIDAD_EXCLUIDA = /^\s*(?:cm|mm|°|º|min\b|minutos?\b|h\b|hrs?\b|horas?\b|d[ií]as?\b)/i;

export function escalarIngrediente(texto, factor) {
  // En 1× devolvemos el original intacto (conserva fracciones unicode)
  if (factor === 1) return texto;

  // 1. Normalizar fracciones unicode → texto "1/2" y colapsar espacios.
  var t = texto
    .replace(/½/g, ' 1/2 ')
    .replace(/¼/g, ' 1/4 ')
    .replace(/¾/g, ' 3/4 ')
    .replace(/⅓/g, ' 1/3 ')
    .replace(/⅔/g, ' 2/3 ')
    .replace(/\s+/g, ' ')
    .trim();

  // 2. Una sola pasada. Cada número se escala UNA ÚNICA VEZ.
  t = t.replace(NUMERO_REGEX, function (match, p1, p2, p3, p4, p5, p6, p7, p8, offset, full) {
    var valor;
    if (p1 !== undefined) {
      valor = parseInt(p1, 10) + parseInt(p2, 10) / parseInt(p3, 10);
    } else if (p4 !== undefined) {
      valor = parseInt(p4, 10) / parseInt(p5, 10);
    } else if (p6 !== undefined) {
      valor = parseFloat(p6 + '.' + p7);
    } else {
      valor = parseInt(p8, 10);
    }

    // ¿Le sigue una unidad que no se debe escalar?
    if (UNIDAD_EXCLUIDA.test(full.slice(offset + match.length))) {
      return match;
    }

    return formatearNumero(valor * factor);
  });

  return t;
}