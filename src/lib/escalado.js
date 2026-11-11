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
   - FASE 10:
     · parsearIngredienteTexto:  "500 g de harina" → objeto estructurado
     · escalarEstructurado:      multiplica cantidad/cantidadMax sin regex
     · formatearIngredienteEstructurado: objeto → texto legible
     · reemplazarMarcasIngredientes: sustituye {ing:N} en un texto
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
      texto: str,
    };
  }

  // "X a Y unidad"
  var rango = /(\d+)\s+(?:a|al|-)\s+(\d+)\s+(personas?|porciones?|unidades?|vasos?|tazas?)/i.exec(
    str
  );
  if (rango) {
    return {
      min: parseInt(rango[1], 10),
      max: parseInt(rango[2], 10),
      unidad: rango[3].toLowerCase(),
      texto: str,
    };
  }

  // "X unidad"
  var simple = /(\d+)\s+(personas?|porciones?|unidades?|vasos?|tazas?|molde(?:s)?)/i.exec(str);
  if (simple) {
    return {
      min: parseInt(simple[1], 10),
      max: null,
      unidad: simple[2].toLowerCase(),
      texto: str,
    };
  }

  // Fallback: primer número de la cadena
  var fallback = /(\d+)/.exec(str);
  if (fallback) {
    return {
      min: parseInt(fallback[1], 10),
      max: null,
      unidad: '',
      texto: str,
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

  // 1. Números grandes (gramos, ml): redondear al entero.
  // Evita cosas como "541⅓ g de harina".
  if (n > 20) {
    return String(Math.round(n));
  }

  var ent = Math.floor(n);
  var resto = n - ent;

  // 2. Si el decimal está muy cerca de un entero (ej: 1.08 o 1.95), redondear.
  // Evita el "1,1 huevo" o "2,2 cebollas".
  if (resto < 0.2 || resto > 0.8) {
    return String(Math.round(n));
  }

  // 3. Devolver como fracción unicode cuando sea "bonito"
  var fracciones = [
    [1 / 4, '¼'],
    [1 / 3, '⅓'],
    [1 / 2, '½'],
    [2 / 3, '⅔'],
    [3 / 4, '¾'],
  ];
  for (var i = 0; i < fracciones.length; i++) {
    if (Math.abs(resto - fracciones[i][0]) < 0.04) {
      return (ent > 0 ? String(ent) : '') + fracciones[i][1];
    }
  }

  // 4. Un decimal (con coma para español de Chile) para casos raros (ej: 1,4 tazas)
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
  taza: 'tazas',
  cucharada: 'cucharadas',
  cucharadita: 'cucharaditas',
  cucharón: 'cucharones',
  diente: 'dientes',
  unidad: 'unidades',
  sobre: 'sobres',
  lata: 'latas',
  tarro: 'tarros',
  paquete: 'paquetes',
  ramita: 'ramitas',
  rama: 'ramas',
  hoja: 'hojas',
  tallo: 'tallos',
  cabeza: 'cabezas',
  rodaja: 'rodajas',
  trozo: 'trozos',
  presa: 'presas',
  docena: 'docenas',
  mano: 'manos',
  puñado: 'puñados',
  pizca: 'pizcas',
  gota: 'gotas',
  gramo: 'gramos',
  kilo: 'kilos',
  litro: 'litros',
  mililitro: 'mililitros',
  onza: 'onzas',
  libra: 'libras',
  // Carnes y pescados
  pechuga: 'pechugas',
  muslo: 'muslos',
  alita: 'alitas',
  chuleta: 'chuletas',
  filete: 'filetes',
  lomo: 'lomos',
  costilla: 'costillas',
  pollo: 'pollos',
  pavo: 'pavos',
  conejo: 'conejos',
  cordero: 'corderos',
  pescado: 'pescados',
  reineta: 'reinetas',
  merluza: 'merluzas',
  corvina: 'corvinas',
  salmón: 'salmones',
  atún: 'atunes',
  // Embutidos y huevos
  huevo: 'huevos',
  chorizo: 'chorizos',
  salchicha: 'salchichas',
  vienesa: 'vienesas',
  longaniza: 'longanizas',
  // Verduras y frutas
  papa: 'papas',
  cebolla: 'cebollas',
  zanahoria: 'zanahorias',
  tomate: 'tomates',
  pimiento: 'pimientos',
  morrón: 'morrones',
  choclo: 'choclos',
  ajo: 'ajos',
  limón: 'limones',
  naranja: 'naranjas',
  manzana: 'manzanas',
  palta: 'paltas',
  pepino: 'pepinos',
  poroto: 'porotos',
  lenteja: 'lentejas',
  garbanzo: 'garbanzos',
  arveja: 'arvejas',
  fideo: 'fideos',
  // Panadería y masas
  pan: 'panes',
  marraqueta: 'marraquetas',
  hallulla: 'hallullas',
  sopaipilla: 'sopaipillas',
  empanada: 'empanadas',
  humita: 'humitas',
  // Porciones y recipientes
  porción: 'porciones',
  persona: 'personas',
  vaso: 'vasos',
  molde: 'moldes',
  plato: 'platos',
  bowl: 'bowls',
  tazón: 'tazones',
};

// Inverso automático: plural → singular
var PLURAL_A_SINGULAR = {};
Object.keys(SINGULAR_A_PLURAL).forEach(function (s) {
  PLURAL_A_SINGULAR[SINGULAR_A_PLURAL[s]] = s;
});

// Convierte "1", "½", "1½", "2,5", "3", "1/2" a número. null si no aplica.
export function parsearNumeroTexto(s) {
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

/* =================================================================
   FASE 10 — DATOS ESTRUCTURADOS
   ================================================================= */

// Unidades reconocidas al parsear una línea de ingrediente.
var UNIDADES_CONOCIDAS = {
  g: 1, kg: 1, mg: 1, ml: 1, l: 1, cl: 1, dl: 1, cc: 1,
  taza: 1, tazas: 1,
  cucharada: 1, cucharadas: 1,
  cucharadita: 1, cucharaditas: 1,
  cdta: 1, cdtas: 1, cda: 1, cdas: 1,
  cucharón: 1, cucharones: 1,
  diente: 1, dientes: 1,
  unidad: 1, unidades: 1,
  sobre: 1, sobres: 1,
  lata: 1, latas: 1,
  tarro: 1, tarros: 1,
  paquete: 1, paquetes: 1,
  ramita: 1, ramitas: 1,
  rama: 1, ramas: 1,
  hoja: 1, hojas: 1,
  tallo: 1, tallos: 1,
  cabeza: 1, cabezas: 1,
  rodaja: 1, rodajas: 1,
  trozo: 1, trozos: 1,
  presa: 1, presas: 1,
  docena: 1, docenas: 1,
  mano: 1, manos: 1,
  puñado: 1, puñados: 1,
  pizca: 1, pizcas: 1,
  gota: 1, gotas: 1,
  gramo: 1, gramos: 1,
  kilo: 1, kilos: 1,
  litro: 1, litros: 1,
  mililitro: 1, mililitros: 1,
  onza: 1, onzas: 1,
  libra: 1, libras: 1,
  molde: 1, moldes: 1,
  vaso: 1, vasos: 1,
  plato: 1, platos: 1,
  bowl: 1, bowls: 1,
  tazón: 1, tazones: 1,
  porción: 1, porciones: 1,
  persona: 1, personas: 1,
};

/**
 * Parsea una línea de ingrediente en texto libre a un objeto estructurado.
 * Heurística: no es perfecta, el humano la revisa después.
 */
export function parsearIngredienteTexto(linea) {
  var original = String(linea);
  var txt = original.trim();
  if (!txt) return null;

  // Sección (mayúsculas antes de ":")
  var seccion = '';
  var sm = /^([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚáéíóúñÑ ]{1,24}):\s+/.exec(txt);
  if (sm) {
    seccion = sm[1].trim();
    txt = txt.slice(sm[0].length);
  }

  // Opcional
  var opcional = /\(\s*opcional\b[^)]*\)/i.test(original) || /^opcional\b/i.test(txt);
  if (opcional) {
    txt = txt
      .replace(/\(\s*opcional\b[^)]*\)/gi, '')
      .replace(/\bopcional\b/gi, '')
      .trim();
  }

  // Nota entre paréntesis
  var nota = '';
  var nm = /\(([^)]+)\)/.exec(txt);
  if (nm) {
    nota = nm[1].trim();
    txt = txt.replace(nm[0], '').trim();
  }

  // Cantidad / cantidadMax
  var cantidad = null,
    cantidadMax = null,
    resto = txt;
  var reCant =
    /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+[.,]\d+|\d+|½|¼|¾|⅓|⅔|\d[½¼¾⅓⅔])\s*(?:(?:a|al|-|–)\s*(\d+\s+\d+\/\d+|\d+\/\d+|\d+[.,]\d+|\d+|½|¼|¾|⅓|⅔|\d[½¼¾⅓⅔]))?\s*/i;
  var mc = reCant.exec(resto);
  if (mc) {
    cantidad = parsearNumeroTexto(mc[1]);
    if (mc[2]) cantidadMax = parsearNumeroTexto(mc[2]);
    resto = resto.slice(mc[0].length).trim();
  }

  // Unidad
  var unidad = null;
  var palabras = resto.split(/\s+/);
  if (palabras.length > 1 && UNIDADES_CONOCIDAS[palabras[0].toLowerCase()]) {
    unidad = palabras[0];
    resto = palabras.slice(1).join(' ').trim();
  }

  // Quitar "de" inicial del nombre
  resto = resto.replace(/^de\s+/i, '').trim();

  var nombre = resto || txt;

  return {
    cantidad: cantidad,
    cantidadMax: cantidadMax == null ? undefined : cantidadMax,
    unidad: unidad,
    nombre: nombre,
    nota: nota || undefined,
    seccion: seccion || undefined,
    opcional: opcional || undefined,
    escalable: true,
    preparacion: undefined,
  };
}

/**
 * Multiplica cantidad y cantidadMax de cada ingrediente sin tocar
 * los ítems con escalable: false ni los que tienen cantidad null.
 */
export function escalarEstructurado(ingredientes, factor) {
  if (!Array.isArray(ingredientes)) return [];
  if (factor === 1)
    return ingredientes.map(function (x) {
      return Object.assign({}, x);
    });

  return ingredientes.map(function (ing) {
    if (ing.escalable === false) return Object.assign({}, ing);
    if (ing.cantidad == null) return Object.assign({}, ing);
    var out = Object.assign({}, ing);
    out.cantidad = Math.round(ing.cantidad * factor * 1000) / 1000;
    if (ing.cantidadMax != null) {
      out.cantidadMax = Math.round(ing.cantidadMax * factor * 1000) / 1000;
    }
    return out;
  });
}

/**
 * Devuelve el texto legible de un ingrediente estructurado.
 * Ej: { cantidad: 500, unidad: 'g', nombre: 'harina' } → "500 g de harina"
 *
 * Regla "a gusto" (Fase 12): cuando no hay cantidad y la nota contiene
 * "a gusto", la nota se une con coma para que se lea natural:
 *   { cantidad: null, nombre: 'sal y pimienta', nota: 'a gusto' }
 *     → "sal y pimienta, a gusto"
 * En el resto de los casos, la nota va entre paréntesis.
 */
export function formatearIngredienteEstructurado(ing) {
  if (!ing) return '';
  var partes = [];

  if (ing.cantidad != null) {
    var numTxt = formatearNumero(ing.cantidad);
    if (ing.cantidadMax != null && ing.cantidadMax !== ing.cantidad) {
      numTxt += ' a ' + formatearNumero(ing.cantidadMax);
    }
    partes.push(numTxt);
  }

  if (ing.unidad) {
    var unidad = ing.unidad;
    if (ing.cantidad != null) {
      var val = ing.cantidad;
      var valMax = ing.cantidadMax != null ? ing.cantidadMax : val;
      if (val >= 2 || valMax >= 2) {
        if (SINGULAR_A_PLURAL[unidad]) unidad = SINGULAR_A_PLURAL[unidad];
      } else if (val <= 1 && valMax <= 1) {
        if (PLURAL_A_SINGULAR[unidad]) unidad = PLURAL_A_SINGULAR[unidad];
      }
    }
    partes.push(unidad);
  }

  if (ing.nombre) {
    if (ing.unidad && ing.cantidad != null) partes.push('de ' + ing.nombre);
    else partes.push(ing.nombre);
  }

  var txt = partes.join(' ');
  if (ing.nota) {
    var esAGusto = /a\s+gusto/i.test(ing.nota);
    if (esAGusto && ing.cantidad == null) {
      txt += ', ' + ing.nota;
    } else {
      txt += ' (' + ing.nota + ')';
    }
  }
  if (ing.opcional && !/opcional/i.test(txt)) txt += ' (opcional)';
  return txt;
}

/**
 * Sustituye las marcas {ing:N} de un texto por el ingrediente N
 * (1-based) ya formateado. El ingrediente puede venir escalado.
 */
export function reemplazarMarcasIngredientes(texto, ingredientes) {
  return String(texto).replace(/\{ing:(\d+)\}/g, function (_, n) {
    var idx = parseInt(n, 10) - 1;
    var ing = ingredientes && ingredientes[idx];
    if (!ing) return _;
    return formatearIngredienteEstructurado(ing);
  });
}