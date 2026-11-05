/* =================================================================
   ESCALADO.JS — Funciones puras de escalado de recetas
   =================================================================
   Movidas desde src/scripts/escalador.js en la Fase 2.

   - extraerPorciones:    detecta porciones base desde un string
   - formatearPorciones:  describe las porciones finales
   - formatearNumero:     convierte un número a texto (fracciones unicode)
   - escalarIngrediente:  multiplica cada cantidad UNA SOLA VEZ
   - pluralizarUnidad:    (Fase 2) pluraliza/singulariza la palabra
                          que sigue a cada número (taza↔tazas, etc.)

   Reglas de pluralización:
   - valor ≥ 2 → pluralizar (si la palabra está en el diccionario)
   - valor ≤ 1 → singularizar (si la palabra está en el diccionario)
   - 1 < valor < 2 (ej. 1½) → no tocar
   - palabras no listadas → no se tocan
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

/* ============================================================
   FASE 2: PLURALIZACIÓN DE UNIDADES
   ------------------------------------------------------------
   Diccionario de unidades/alimentos contables que cambian de
   número. NO se incluyen "kg", "g", "ml", "cm" ni unidades de
   tiempo (minuto, hora, día) porque no se pluralizan o ya están
   excluidas del escalado por UNIDAD_EXCLUIDA.
   Si falta una palabra, se puede agregar aquí sin tocar el resto.
   "malaya" queda fuera a propósito: el test del proyecto espera
   "2 malaya" (singular). Si se quiere pluralizar, actualizar el
   test a la vez.
   ============================================================ */
var SINGULAR_A_PLURAL = {
  // Medidas y unidades de volumen/peso
  'taza': 'tazas',
  'cucharada': 'cucharadas',
  'cucharadita': 'cucharaditas',
  'cucharón': 'cucharones',
  'diente': 'dientes',
  'unidad': 'unidades',
  'sobre': 'sobres',
  'lata': 'latas',
  'tarro': 'tarros',
  'paquete': 'paquetes',
  'ramita': 'ramitas',
  'rama': 'ramas',
  'hoja': 'hojas',
  'tallo': 'tallos',
  'cabeza': 'cabezas',
  'rodaja': 'rodajas',
  'trozo': 'trozos',
  'presa': 'presas',
  'docena': 'docenas',
  'mano': 'manos',
  'puñado': 'puñados',
  'pizca': 'pizcas',
  'gota': 'gotas',
  'gramo': 'gramos',
  'kilo': 'kilos',
  'litro': 'litros',
  'mililitro': 'mililitros',
  'onza': 'onzas',
  'libra': 'libras',
  // Carnes y pescados
  'pechuga': 'pechugas',
  'muslo': 'muslos',
  'alita': 'alitas',
  'chuleta': 'chuletas',
  'filete': 'filetes',
  'lomo': 'lomos',
  'costilla': 'costillas',
  'pollo': 'pollos',
  'pavo': 'pavos',
  'conejo': 'conejos',
  'cordero': 'corderos',
  'pescado': 'pescados',
  'reineta': 'reinetas',
  'merluza': 'merluzas',
  'corvina': 'corvinas',
  'salmón': 'salmones',
  'atún': 'atunes',
  // Embutidos y huevos
  'huevo': 'huevos',
  'chorizo': 'chorizos',
  'salchicha': 'salchichas',
  'vienesa': 'vienesas',
  'longaniza': 'longanizas',
  // Verduras y frutas
  'papa': 'papas',
  'cebolla': 'cebollas',
  'zanahoria': 'zanahorias',
  'tomate': 'tomates',
  'pimiento': 'pimientos',
  'morrón': 'morrones',
  'choclo': 'choclos',
  'ajo': 'ajos',
  'limón': 'limones',
  'naranja': 'naranjas',
  'manzana': 'manzanas',
  'palta': 'paltas',
  'pepino': 'pepinos',
  'poroto': 'porotos',
  'lenteja': 'lentejas',
  'garbanzo': 'garbanzos',
  'arveja': 'arvejas',
  'fideo': 'fideos',
  // Panadería y masas
  'pan': 'panes',
  'marraqueta': 'marraquetas',
  'hallulla': 'hallullas',
  'sopaipilla': 'sopaipillas',
  'empanada': 'empanadas',
  'humita': 'humitas',
  // Porciones y recipientes
  'porción': 'porciones',
  'persona': 'personas',
  'vaso': 'vasos',
  'molde': 'moldes',
  'plato': 'platos',
  'bowl': 'bowls',
  'tazón': 'tazones'
};

// Inverso automático: plural → singular
var PLURAL_A_SINGULAR = {};
Object.keys(SINGULAR_A_PLURAL).forEach(function (s) {
  PLURAL_A_SINGULAR[SINGULAR_A_PLURAL[s]] = s;
});

// Convierte "1", "½", "1½", "2,5", "3", "1/2" a número. null si no aplica.
function parsearNumeroTexto(s) {
  if (s === null || s === undefined) return null;
  s = String(s).trim();

  var fracMap = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3 };

  // Mixto unicode: 1½, 2¼
  var mixto = /^(\d+)([¼½¾⅓⅔])$/.exec(s);
  if (mixto) return parseInt(mixto[1], 10) + fracMap[mixto[2]];

  // Fracción unicode sola
  if (fracMap[s] !== undefined) return fracMap[s];

  // Fracción textual: 1/2, 3/4
  var frac = /^(\d+)\s*\/\s*(\d+)$/.exec(s);
  if (frac) {
    var num = parseInt(frac[1], 10);
    var den = parseInt(frac[2], 10);
    if (den === 0) return null;
    return num / den;
  }

  // Decimal con coma o punto
  var dec = /^(\d+)[.,](\d+)$/.exec(s);
  if (dec) return parseFloat(dec[1] + '.' + dec[2]);

  // Entero
  var ent = /^(\d+)$/.exec(s);
  if (ent) return parseInt(ent[1], 10);

  return null;
}

// Recorre el texto buscando pares "número + palabra" y ajusta la
// palabra según corresponda. No toca el resto del texto.
function pluralizarUnidad(texto) {
  return texto.replace(/(\S+)\s+([a-záéíóúñü]+)/gi, function (match, num, palabra) {
    var valor = parsearNumeroTexto(num);
    if (valor === null) return match;

    var p = palabra.toLowerCase();
    var reemplazo = null;

    if (valor >= 2) {
      reemplazo = SINGULAR_A_PLURAL[p] || null;
    } else if (valor <= 1) {
      reemplazo = PLURAL_A_SINGULAR[p] || null;
    }
    // 1 < valor < 2: no se toca (se deja como esté).

    if (!reemplazo || reemplazo === p) return match;

    // Preservar capitalización inicial si la tenía
    if (
      palabra.charAt(0) === palabra.charAt(0).toUpperCase() &&
      palabra.charAt(0) !== palabra.charAt(0).toLowerCase()
    ) {
      reemplazo = reemplazo.charAt(0).toUpperCase() + reemplazo.slice(1);
    }

    // Reemplazar solo la palabra, manteniendo el número y el espacio
    var espacios = match.slice(num.length, match.length - palabra.length);
    return num + espacios + reemplazo;
  });
}

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

  // 3. Pluralizar/singularizar unidades tras el escalado de números.
  t = pluralizarUnidad(t);

  return t;
}