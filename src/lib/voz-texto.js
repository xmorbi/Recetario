/* =================================================================
   VOZ-TEXTO.JS — Normalización y troceo de texto para TTS
   Módulo puro, sin dependencias del DOM ni de Web Speech.

   Objetivo: convertir el texto crudo de las recetas en algo que
   suene natural cuando lo lea speechSynthesis:

     "300 g de carne"  → "300 gramos de carne"
     "160 °C"          → "160 grados"
     "20-25 min"       → "20 a 25 minutos"
     "0.5 pimentón"    → "medio pimentón"
     "1/2 cucharadita" → "medio cucharadita"
     "1 L de agua"     → "1 litro de agua"

   Y dividir los pasos largos en frases cortas para que las voces
   de red de Chrome no se corten a medio camino.

   Limitación conocida: "0.5" se normaliza a "medio" (masculino)
   por defecto. En casos como "medio taza" (debería ser "media")
   el género queda mal. Se puede refinar con contexto después.
   ================================================================= */

var UNIDADES = {
  'g': ['gramo', 'gramos'],
  'gr': ['gramo', 'gramos'],
  'kg': ['kilo', 'kilos'],
  'mg': ['miligramo', 'miligramos'],
  'ml': ['mililitro', 'mililitros'],
  'l': ['litro', 'litros'],
  'lt': ['litro', 'litros'],
  'cc': ['centímetro cúbico', 'centímetros cúbicos'],
  'cm': ['centímetro', 'centímetros'],
  'mm': ['milímetro', 'milímetros'],
  'm': ['metro', 'metros'],
  'min': ['minuto', 'minutos'],
  'mins': ['minuto', 'minutos'],
  'h': ['hora', 'horas'],
  'hr': ['hora', 'horas'],
  'hrs': ['hora', 'horas'],
  'seg': ['segundo', 'segundos'],
  'segs': ['segundo', 'segundos'],
  '°c': ['grado', 'grados'],
  'ºc': ['grado', 'grados'],
  '°f': ['grado fahrenheit', 'grados fahrenheit'],
  'ºf': ['grado fahrenheit', 'grados fahrenheit'],
  'cda': ['cucharada', 'cucharadas'],
  'cdas': ['cucharada', 'cucharadas'],
  'cdta': ['cucharadita', 'cucharaditas'],
  'cdtas': ['cucharadita', 'cucharaditas'],
  'tza': ['taza', 'tazas'],
  'tzas': ['taza', 'tazas'],
  'taza': ['taza', 'tazas'],
  'tazas': ['taza', 'tazas']
};

var FRACCIONES_UNICODE = {
  '½': 'medio',
  '¼': 'un cuarto',
  '¾': 'tres cuartos',
  '⅓': 'un tercio',
  '⅔': 'dos tercios',
  '⅛': 'un octavo',
  '⅜': 'tres octavos',
  '⅝': 'cinco octavos',
  '⅞': 'siete octavos'
};

var FRACCIONES_TEXTO = {
  '1/2': 'medio',
  '1/4': 'un cuarto',
  '3/4': 'tres cuartos',
  '1/3': 'un tercio',
  '2/3': 'dos tercios',
  '1/8': 'un octavo',
  '3/8': 'tres octavos',
  '5/8': 'cinco octavos',
  '7/8': 'siete octavos'
};

var DECIMALES_COMUNES = {
  '0.25': 'un cuarto',
  '0,25': 'un cuarto',
  '0.5': 'medio',
  '0,5': 'medio',
  '0.75': 'tres cuartos',
  '0,75': 'tres cuartos',
  '1.5': 'uno y medio',
  '1,5': 'uno y medio',
  '2.5': 'dos y medio',
  '2,5': 'dos y medio'
};

// Rangos "20-25" → "20 a 25"
var RE_RANGO = /\b(\d{1,4})\s*[-–—]\s*(\d{1,4})\b/g;

// Número + unidad: "300g", "300 g", "1,5 kg", "20 °C".
// El lookbehind evita que el "4" de "3/4 taza" se empareje con "taza"
// y que se dupliquen matches cuando el número ya fue procesado.
var RE_CANTIDAD_UNIDAD =
  /(?<![/\d])(\d+(?:[.,]\d+)?)\s*(°c|ºc|°f|ºf|kg|kilos?|gramos?|gr|g|mg|ml|cc|lt|l|cm|mm|mins?|min|hrs?|hr|h|segs?|seg|cdas?|cdtas?|tazas?|tzas?)\b/gi;

// Decimales sueltos: solo los comunes, para no tocar números de pasos
var RE_DECIMAL = /\b(0[.,]25|0[.,]5|0[.,]75|1[.,]5|2[.,]5)\b/g;

function formaUnidad(num, par) {
  var n = parseFloat(String(num).replace(',', '.'));
  // Singular si es 1 exacto o si es menor que 1 ("medio taza",
  // "tres cuartos taza"). Plural para el resto.
  return n <= 1 ? par[0] : par[1];
}

export function normalizarTexto(texto) {
  if (typeof texto !== 'string') return '';
  var t = texto;

  // 1. Fracciones Unicode (½, ¼, etc.)
  t = t.replace(/[½¼¾⅓⅔⅛⅜⅝⅞]/g, function (m) {
    return FRACCIONES_UNICODE[m] ? ' ' + FRACCIONES_UNICODE[m] + ' ' : m;
  });

  // 2. Rangos numéricos
  t = t.replace(RE_RANGO, '$1 a $2');

  // 3. Número + unidad
  t = t.replace(RE_CANTIDAD_UNIDAD, function (m, num, unidad) {
    var par = UNIDADES[unidad.toLowerCase()];
    if (!par) return num + ' ' + unidad;
    return num + ' ' + formaUnidad(num, par);
  });

  // 4. Fracciones textuales (1/2, 3/4)
  t = t.replace(/\b(1|2|3|5|7)\s*\/\s*(2|3|4|8)\b/g, function (m) {
    var clave = m.replace(/\s+/g, '');
    return FRACCIONES_TEXTO[clave] ? ' ' + FRACCIONES_TEXTO[clave] + ' ' : m;
  });

  // 5. Decimales comunes sueltos (0.5, 1.5, etc.)
  t = t.replace(RE_DECIMAL, function (m) {
    return DECIMALES_COMUNES[m] ? ' ' + DECIMALES_COMUNES[m] + ' ' : m;
  });

  // 6. Colapsar espacios
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

export function dividirEnFrases(texto) {
  if (typeof texto !== 'string') return [];
  var t = texto.trim();
  if (!t) return [];

  // Marcamos después de . ! ? ; seguidos de espacio
  var marcado = t.replace(/([.!?;]+)\s+/g, '$1\u0001');
  var frases = marcado
    .split('\u0001')
    .map(function (s) {
      return s.trim();
    })
    .filter(function (s) {
      return s.length > 0;
    });

  // Si una frase supera ~180 caracteres, subdividir por comas
  var resultado = [];
  frases.forEach(function (f) {
    if (f.length <= 180) {
      resultado.push(f);
      return;
    }
    var partes = f.split(/,\s+/);
    var buffer = '';
    partes.forEach(function (p) {
      var posible = buffer ? buffer + ', ' + p : p;
      if (posible.length > 180 && buffer) {
        resultado.push(buffer + ',');
        buffer = p;
      } else {
        buffer = posible;
      }
    });
    if (buffer) resultado.push(buffer);
  });

  return resultado.filter(function (f) {
    return f.length > 0;
  });
}