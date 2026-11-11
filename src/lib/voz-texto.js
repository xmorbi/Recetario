/* =================================================================
   VOZ-TEXTO.JS — Normalización y troceo de texto para TTS
   Módulo puro, sin dependencias del DOM ni de Web Speech.

   Objetivo: convertir el texto crudo de las recetas en algo que
   suene natural cuando lo lea speechSynthesis:

     "300 g de carne"  → "300 gramos de carne"
     "160 °C"          → "160 grados"
     "20-25 min"       → "20 a 25 minutos"
     "0.5 taza"        → "media taza"
     "1/2 cucharadita" → "media cucharadita"
     "1½ taza"         → "una taza y media"
     "1 1/2 tazas"     → "una taza y media"

   Y dividir los pasos largos en frases cortas para que las voces
   de red de Chrome no se corten a medio camino.
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
  'tazas': ['taza', 'tazas'],
  'unidad': ['unidad', 'unidades'],
  'unidades': ['unidad', 'unidades'],
  'kilo': ['kilo', 'kilos'],
  'kilos': ['kilo', 'kilos'],
  'gramo': ['gramo', 'gramos'],
  'gramos': ['gramo', 'gramos'],
  'litro': ['litro', 'litros'],
  'litros': ['litro', 'litros'],
  'hora': ['hora', 'horas'],
  'horas': ['hora', 'horas']
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
var RE_CANTIDAD_UNIDAD =
  /(?<![/\d])(\d+(?:[.,]\d+)?)\s*(°c|ºc|°f|ºf|kg|kilos?|gramos?|gr|g|mg|ml|cc|lt|l|cm|mm|mins?|min|hrs?|hr|h|segs?|seg|cdas?|cdtas?|tazas?|tzas?|unidades?|horas?)\b/gi;

// Decimales sueltos: solo los comunes, para no tocar números de pasos
var RE_DECIMAL = /\b(0[.,]25|0[.,]5|0[.,]75|1[.,]5|2[.,]5)\b/g;

/* --- REGLAS DE GÉNERO Y FRACCIONES MIXTAS --- */

var UNIDADES_FEMENINAS = [
  'taza', 'cucharada', 'cucharadita', 'unidad', 'porción', 'lata', 'libra', 'onza', 
  'cabeza', 'rama', 'hoja', 'pizca', 'gota', 'rebanada', 'hora'
];

function esFemenina(palabra) {
  const p = palabra.toLowerCase();
  return UNIDADES_FEMENINAS.some(u => p.startsWith(u));
}

function singularizar(palabra) {
  const p = palabra.toLowerCase();
  if (p === 'tazas') return 'taza';
  if (p === 'cucharadas') return 'cucharada';
  if (p === 'cucharaditas') return 'cucharadita';
  if (p === 'unidades') return 'unidad';
  if (p === 'porciones') return 'porción';
  if (p === 'libras') return 'libra';
  if (p === 'onzas') return 'onza';
  if (p === 'latas') return 'lata';
  if (p === 'pizcas') return 'pizca';
  if (p === 'gotas') return 'gota';
  if (p === 'kilos') return 'kilo';
  if (p === 'gramos') return 'gramo';
  if (p === 'litros') return 'litro';
  if (p === 'mililitros') return 'mililitro';
  if (p === 'horas') return 'hora';
  return palabra;
}

function formaUnidad(num, par) {
  var n = parseFloat(String(num).replace(',', '.'));
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

  // 3. Número + unidad (convierte 1 kg -> 1 kilo)
  t = t.replace(RE_CANTIDAD_UNIDAD, function (m, num, unidad) {
    var par = UNIDADES[unidad.toLowerCase()];
    if (!par) return num + ' ' + unidad;
    return num + ' ' + formaUnidad(num, par);
  });

  // 4. Fracciones textuales (1/2, 3/4, 1/8, etc.)
  t = t.replace(/\b(1|2|3|5|7)\s*\/\s*(2|3|4|8)\b/g, function (m) {
    var clave = m.replace(/\s+/g, '');
    return FRACCIONES_TEXTO[clave] ? ' ' + FRACCIONES_TEXTO[clave] + ' ' : m;
  });

  // 5. Decimales comunes sueltos (0.5, 1.5, etc.)
  t = t.replace(RE_DECIMAL, function (m) {
    return DECIMALES_COMUNES[m] ? ' ' + DECIMALES_COMUNES[m] + ' ' : m;
  });

  // 6. Ajuste de género y fracciones mixtas
  // 6.1. Un entero + medio/a (ej: 1 medio taza, 2 medio tazas)
  t = t.replace(/\b(\d+|uno)\s+(medio|media)\s+([a-zA-Záéíóúñ]+)/gi, (match, entero, medio, palabra) => {
    const esFem = esFemenina(palabra);
    const par = UNIDADES[palabra.toLowerCase()];
    const sing = par ? par[0] : singularizar(palabra);
    const plur = par ? par[1] : palabra;

    if (entero === '1' || entero === 'uno') {
      return esFem ? `una ${sing} y media` : `un ${sing} y medio`;
    } else if (entero === '2' || entero === 'dos') {
      return esFem ? `dos ${plur} y media` : `dos ${plur} y medio`;
    } else {
      return esFem ? `${entero} ${plur} y media` : `${entero} ${plur} y medio`;
    }
  });

  // 6.2. Uno y medio / Dos y medio
  t = t.replace(/\b(uno y medio|uno y media)\s+([a-zA-Záéíóúñ]+)/gi, (match, num, palabra) => {
    const esFem = esFemenina(palabra);
    const par = UNIDADES[palabra.toLowerCase()];
    const sing = par ? par[0] : singularizar(palabra);
    return esFem ? `una ${sing} y media` : `un ${sing} y medio`;
  });
  
  t = t.replace(/\b(dos y medio|dos y media)\s+([a-zA-Záéíóúñ]+)/gi, (match, num, palabra) => {
    const esFem = esFemenina(palabra);
    const par = UNIDADES[palabra.toLowerCase()];
    const plur = par ? par[1] : palabra;
    return esFem ? `dos ${plur} y media` : `dos ${plur} y medio`;
  });

  // 6.2.5. Mixtas con fracciones textuales (1 un cuarto tazas)
  t = t.replace(/\b(\d+|uno)\s+(un cuarto|tres cuartos|un tercio|dos tercios|un octavo)\s+(?!de\b)([a-zA-Záéíóúñ]+)/gi, (match, entero, fraccion, palabra) => {
    const esFem = esFemenina(palabra);
    const par = UNIDADES[palabra.toLowerCase()];
    const sing = par ? par[0] : singularizar(palabra);
    const plur = par ? par[1] : palabra;

    if (entero === '1' || entero === 'uno') {
      return esFem ? `una ${sing} y ${fraccion}` : `un ${sing} y ${fraccion}`;
    }
    return `${entero} ${plur} y ${fraccion}`;
  });

  // 6.3. Medio/a simple
  t = t.replace(/\b(medio|media)\s+(?!de\b)([a-zA-Záéíóúñ]+)/gi, (match, num, palabra) => {
    const esFem = esFemenina(palabra);
    return esFem ? `media ${palabra}` : `medio ${palabra}`;
  });

  // 6.4. Un cuarto / Tres cuartos / Tercios / Octavos
  t = t.replace(/\b(un cuarto|tres cuartos|un tercio|dos tercios|un octavo|tres octavos)\s+(?!de\b)([a-zA-Záéíóúñ]+)/gi, (match, num, palabra) => {
    return `${num} de ${palabra}`;
  });

  // 7. Colapsar espacios
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