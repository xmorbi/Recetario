#!/usr/bin/env node
/**
 * scripts/migrar-estructura.mjs
 * Migra recetas crudas al formato _v2 de Recetario Chileno.
 *
 * Uso:
 *   node scripts/migrar-estructura.mjs                    # procesa src/content/recetas
 *   node scripts/migrar-estructura.mjs <dir>              # procesa un directorio específico
 *   node scripts/migrar-estructura.mjs --dry-run          # no escribe, solo simula
 *   node scripts/migrar-estructura.mjs --verbose          # logs detallados
 *   node scripts/migrar-estructura.mjs --forzar           # reprocesa aunque ya tenga _v2
 *   node scripts/migrar-estructura.mjs --dump <path>      # dump de warnings a JSON
 *   node scripts/migrar-estructura.mjs --dump-v2 <dir>    # escribe el _v2 en otro directorio
 *
 * Versión 2.7 — últimos fixes quirúrgicos antes de producción.
 *
 * FIX-1. clasificarTimer: prioriza verbo principal del paso. "Cocinar ... marinadas"
 *        ahora se clasifica como `coccion`, no `reposo`.
 * FIX-2. Strip de `:` / `,` / `;` residual DESPUÉS de quitar modificadores.
 *        Resuelve `": hojas de menta"` → `"hojas de menta"`.
 * FIX-3. Ampliar `esPasoGenerico` para "agitar en cohelera/shaker" y "verter todo".
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// ═══════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const VERBOSE = args.includes('--verbose');
const FORZAR = args.includes('--forzar');

const dumpIdx = args.indexOf('--dump');
const DUMP_PATH_RAW = dumpIdx >= 0 ? args[dumpIdx + 1] : null;
const DUMP_PATH = DUMP_PATH_RAW ? path.resolve(DUMP_PATH_RAW) : null;

const dumpV2Idx = args.indexOf('--dump-v2');
const DUMP_V2_DIR_RAW = dumpV2Idx >= 0 ? args[dumpV2Idx + 1] : null;
const DUMP_V2_DIR = DUMP_V2_DIR_RAW ? path.resolve(DUMP_V2_DIR_RAW) : null;

const consumedRawValues = new Set([DUMP_PATH_RAW, DUMP_V2_DIR_RAW].filter(Boolean));
const dirArg = args.find(a => !a.startsWith('--') && !consumedRawValues.has(a));
const INPUT_DIR = dirArg ? path.resolve(dirArg) : path.join(ROOT, 'src', 'content', 'recetas');

// ═══════════════════════════════════════════════════════════════════
// CATÁLOGOS
// ═══════════════════════════════════════════════════════════════════

const NUNCA_ESCALABLES = [
  /^sal(\s|,|$)/i, /^pimienta(\s|,|$)/i, /^sal y (aceite|pimienta)/i,
  /^sal,? pimienta/i, /^azúcar flor/i, /^canela en polvo$/i,
  /^orégano$/i, /^comino$/i, /^ají de color$/i, /^ají seco$/i,
  /^laurel$/i, /^tomillo$/i, /^perejil$/i, /^cilantro/i,
  /^jugo de limón$/i, /^perlas de azúcar/i,
  /a gusto/i, /al gusto/i, /si es necesario/i, /para decorar/i,
];

const INDIVISIBLES = [
  /\b(pavo|pollo|cordero|lechón)\b.*\b(entero|de \d)/i,
  /^\d+\s+(pavo|pollo|cordero|lechón|torta|queque|pan)/i,
];

const UTENSILIOS = [
  /\b(jeringa|palillo|termómetro|molde|sartén|olla|papel aluminio|cordel|hilo de cocina|batidor|espátula|colador|rallador|fierrito|cuchara de madera|pincho|piedras volcánicas|leña seca|piedras de río)\b/i,
];

const CONDIMENTOS = /^(sal|pimienta|comino|orégano|laurel|tomillo|ají de color|ají seco|merkén|merken|canela|clavo|nuez moscada|jengibre|pimentón|cilantro|perejil|albahaca|romero|azúcar flor|azúcar|aliño completo)/i;

const ACOMPAÑAMIENTO = /(para acompañar|para servir|para decorar|al servir|para el servicio)/i;
const AMBIENTALES = /^(hielo|agua|sal gruesa)/i;
const USO_IMPLICITO = /^(para (fre[ií]r|engrasar|enharinar|espolvorear|pasar|untar|rociar|decorar|pintar|sellar|mojar|aderezar|bañar|acompañar|servir|el molde|la fuente|los moldes|las manos))/i;

const VEGETALES_COMUNES = /^(cebolla|zanahoria|puerro|ajo|apio|pimentón|pimiento|zapallo|papa|choclo|poroto|arveja|espárrago|brócoli|coliflor|repollo|acelga|espinaca|betarraga|tomate|pepino|lechuga|cilantro|perejil|albahaca|palta|alcachofa)/i;
const MARISCOS_COMUNES = /^(almeja|chorito|cholga|picoroco|macha|loco|ostrón|ostion|vieira|calamar|pulpo|mariscos?|camarón|camarones)/i;
const CARNES_COMUNES = /^(pulpa|posta|lomo|costillar|carne|filete|churrasco|trutro|pechuga|muslo|pierna|asado|asiento|vacuno|cerdo|pollo|cordero)/i;

const DESCRIPTORES = [
  'grande', 'grandes', 'mediano', 'medianos', 'mediana', 'medianas',
  'pequeño', 'pequeños', 'pequeña', 'pequeñas', 'chico', 'chicos', 'chica', 'chicas',
  'picado', 'picados', 'picada', 'picadas',
  'pelado', 'pelados', 'pelada', 'peladas',
  'cortado', 'cortados', 'cortada', 'cortadas',
  'corto', 'cortos', 'corta', 'cortas',
  'partido', 'partidos', 'partida', 'partidas',
  'deshuesado', 'deshuesados', 'deshuesada', 'deshuesadas',
  'desmenuzado', 'desmenuzados', 'desmenuzada', 'desmenuzadas',
  'desgranado', 'desgranados', 'desgranada', 'desgranadas',
  'en cubos', 'en tiras', 'en rodajas', 'en pluma', 'en cascos',
  'en juliana', 'en bastones', 'en gajos', 'en cuartos', 'en mitades',
  'en lonjas', 'en hebras', 'en trozos', 'en tajadas', 'en láminas',
  'en láminas delgadas', 'en tiritas', 'en dados', 'en grano', 'en polvo',
  'en mitades', 'en conserva',
  'rallado', 'rallados', 'rallada', 'ralladas',
  'tierno', 'tiernos', 'tierna', 'tiernas',
  'fresco', 'frescos', 'fresca', 'frescas',
  'seco', 'secos', 'seca', 'secas', 'duro', 'duros', 'dura', 'duras',
  'tibio', 'tibia', 'caliente', 'calientes',
  'frío', 'fríos', 'fría', 'frías',
  'helado', 'helados', 'helada', 'heladas',
  'a temperatura ambiente',
  'fino', 'finos', 'fina', 'finas', 'finamente', 'muy fina', 'muy fino',
  'grueso', 'gruesos', 'gruesa', 'gruesas',
  'graneado', 'graneados', 'graneada', 'graneadas',
  'picante', 'picantes',
  'sin piel', 'sin cuesco', 'sin hueso', 'sin tallo',
  'lavado', 'lavados', 'lavada', 'lavadas',
  'limpio', 'limpios', 'limpia', 'limpias',
  'maduro', 'maduros', 'madura', 'maduras',
  'cocido', 'cocidos', 'cocida', 'cocidas',
  'tinto', 'tintos', 'tinta', 'tintas',
  'bien', 'recién', 'recien',
  'palito', 'palitos', 'bastón', 'bastones',
];

const UNIDADES = {
  'cdta.': 'cucharadita', 'cdta': 'cucharadita',
  'cucharadita': 'cucharadita', 'cucharaditas': 'cucharadita',
  'cda.': 'cucharada', 'cda': 'cucharada', 'cdas': 'cucharada', 'cdas.': 'cucharada',
  'cucharada': 'cucharada', 'cucharadas': 'cucharada',
  'taza': 'taza', 'tazas': 'taza',
  'g': 'g', 'gr': 'g', 'grs': 'g', 'kg': 'kg', 'kgs': 'kg', 'ml': 'ml',
  'l': 'L', 'lt': 'L', 'litro': 'L', 'litros': 'L',
  'diente': 'diente', 'dientes': 'diente',
  'hoja': 'hoja', 'hojas': 'hoja',
  'rama': 'rama', 'ramas': 'rama',
  'ramita': 'ramita', 'ramitas': 'ramita',
  'ramito': 'ramito', 'ramitos': 'ramito',
  'manojo': 'manojo', 'manojos': 'manojo',
  'manojito': 'manojo', 'manojitos': 'manojo',
  'trozo': 'trozo', 'trozos': 'trozos',
  'rebanada': 'rebanada', 'rebanadas': 'rebanada',
  'filete': 'filete', 'filetes': 'filete',
  'tableta': 'tableta', 'tabletas': 'tableta',
  'vaso': 'vaso', 'vasos': 'vaso', 'vasito': 'vaso', 'vasitos': 'vaso',
  'botella': 'botella', 'botellas': 'botella', 'botellita': 'botella',
  'pizca': 'pizca', 'pizcas': 'pizca',
  'copa': 'copa', 'copas': 'copa',
  'medida': 'medida', 'medidas': 'medida',
  'parte': 'parte', 'partes': 'parte',
  'tarro': 'tarro', 'tarros': 'tarro',
  'lata': 'lata', 'latas': 'lata',
  'frasco': 'frasco', 'frascos': 'frasco',
  'paquete': 'paquete', 'paquetes': 'paquete',
  'bolsa': 'bolsa', 'bolsas': 'bolsa',
  'bandeja': 'bandeja', 'bandejas': 'bandeja',
  'atado': 'atado', 'atados': 'atado',
  'puñado': 'puñado', 'puñados': 'puñado',
  'tajada': 'tajada', 'tajadas': 'tajada',
  'lonja': 'lonja', 'lonjas': 'lonja',
  'fierrito': 'fierrito', 'fierritos': 'fierrito',
  'presa': 'presa', 'presas': 'presa',
  'trutro': 'trutro', 'trutros': 'trutro',
  'unidad': 'unidad', 'unidades': 'unidad',
  'colmada': 'colmada', 'colmadas': 'colmada',
  'rasa': 'rasa', 'rasas': 'rasa',
  'pellizco': 'pellizco', 'pellizcos': 'pellizco',
};

const SINONIMOS = {
  'pimenton': ['pimiento', 'morron'], 'pimiento': ['pimenton', 'morron'],
  'choclo': ['maiz', 'mazorca'], 'palta': ['aguacate'],
  'zapallo': ['calabaza'], 'poroto': ['frijol', 'judia'],
  'frutilla': ['fresa'], 'durazno': ['melocoton'],
  'aji': ['chile', 'picante'], 'cebollin': ['cebollino'],
  'marraqueta': ['pan', 'hallulla'], 'hallulla': ['pan', 'marraqueta'],
  'posta': ['carne', 'vacuno'], 'trutro': ['presa', 'pollo'],
  'vienesa': ['salchicha'], 'chancaca': ['azucar', 'panela'],
  'manjar': ['dulce de leche'], 'merken': ['aji'], 'merkén': ['aji'],
  'cochayuyo': ['alga'], 'luche': ['alga'],
  'queso': ['parmesano', 'mantecoso', 'chanco'],
  'crema': ['nata'],
  'huevo': ['yema', 'clara'], 'yema': ['huevo'], 'clara': ['huevo'],
  'aceite': ['oliva', 'maravilla', 'vegetal'],
  'harina': ['trigo'],
  'azucar': ['flor', 'granulada', 'rubia'],
  'nuez': ['nueces'],
  'pollo': ['pechuga', 'muslo', 'trutro', 'presa'],
  'pechuga': ['pollo'], 'muslo': ['pollo'],
  'churrasco': ['bistec', 'filete'],
  'bistec': ['churrasco', 'filete'],
  'filete': ['churrasco', 'bistec', 'lomo'],
  'pulpa': ['carne', 'vacuno', 'cerdo'],
  'costillar': ['carne', 'cerdo', 'costilla'],
  'costilla': ['costillar', 'carne'],
};

const FRACCIONES = {
  '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1/3, '⅔': 2/3,
  '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
};

const PREFIJOS_SECCION = /^(Masa|Relleno|Relleno y cubierta|Pino|Caldo|Bizcocho|Cubierta|Chancaca|Merengue|Base|Salsa|Aderezo|Aliño|Pintar|Para el relleno|Para la masa|Para la salsa|Para el armado|Para la carne y el marinado|Para el merengue|Para el aderezo|Para la cubierta)\s*:\s*/i;

const HEADERS_SUELTOS = /^Para\s+.+:\s*$/i;
const UMBRAL_PREVIO_MIN = 480;
const NOMBRES_BASURA = /^(kg|g|gr|grs|ml|l|lt|cm|mm|taza|tazas|cucharadita|cucharaditas|cucharada|cucharadas|cdta|cdta\.|cda|cda\.|y|o|a|de|del)\s*[).]*$/i;

// ═══════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════

const limpiar = s => s.replace(/\s+/g, ' ').trim();

function normalizarTexto(texto) {
  return texto.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[(),.;:]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function singularizar(palabra) {
  const irregulares = {
    'nueces': 'nuez', 'panes': 'pan', 'peces': 'pez',
    'luces': 'luz', 'voces': 'voz', 'raices': 'raiz',
    'lápices': 'lápiz', 'lapices': 'lapiz',
  };
  if (irregulares[palabra]) return irregulares[palabra];
  if (palabra.length >= 4 && palabra.endsWith('ces')) return palabra.slice(0, -3) + 'z';
  if (palabra.length > 3 && palabra.endsWith('es')) return palabra.slice(0, -2);
  if (palabra.length > 3 && palabra.endsWith('s')) return palabra.slice(0, -1);
  return palabra;
}

function normalizarYsingularizar(texto) {
  return normalizarTexto(texto).split(/\s+/).map(singularizar).join(' ');
}

function normalizarFracciones(texto) {
  let r = texto;
  for (const [frac, val] of Object.entries(FRACCIONES)) {
    r = r.replace(new RegExp(`(\\d+)\\s+${frac}`, 'g'), (_, ent) => String(parseFloat(ent) + val));
    r = r.replace(new RegExp(frac, 'g'), String(val));
  }
  r = r.replace(/(\d+)\s*\/\s*(\d+)/g, (_, n, d) => String(parseFloat(n) / parseFloat(d)));
  return r;
}

function normalizarUnidad(u) {
  if (!u) return null;
  const key = u.toLowerCase().replace(/\.$/, '').trim();
  return UNIDADES[u.toLowerCase()] || UNIDADES[key] || null;
}

const matchea = (regexes, texto) => regexes.some(re => re.test(texto));

function variantesDescriptor(d) {
  const vars = new Set([d]);
  if (d.endsWith('s')) {
    if (d.endsWith('es') && d.length > 4) vars.add(d.slice(0, -2));
    else if (d.length > 3) vars.add(d.slice(0, -1));
  } else {
    if (d.endsWith('o') || d.endsWith('a') || d.endsWith('e')) vars.add(d + 's');
    if (d.endsWith('l') || d.endsWith('n') || d.endsWith('r') || d.endsWith('d') || d.endsWith('z')) {
      if (d.endsWith('z')) vars.add(d.slice(0, -1) + 'ces');
      else vars.add(d + 'es');
    }
  }
  return Array.from(vars);
}

function extraerDescriptores(nombre) {
  let limpio = nombre;
  const encontrados = [];
  const ordenados = [...DESCRIPTORES].sort((a, b) => b.length - a.length);

  for (const d of ordenados) {
    const variantes = variantesDescriptor(d);
    for (const v of variantes) {
      const re = new RegExp(`\\b${v}\\b`, 'gi');
      if (re.test(limpio)) {
        encontrados.push(v);
        limpio = limpio.replace(re, ' ').trim();
        break;
      }
    }
  }

  limpio = limpiar(limpio)
    .replace(/^[,\s:;]+|[,\s:;]+$/g, '')
    .replace(/\s+,\s+/g, ' ')
    .replace(/\s+[yo]$/i, '')
    .replace(/^(?:de\s+|del\s+)/i, '')
    .trim();

  return { nombreLimpio: limpio, notas: encontrados };
}

// ═══════════════════════════════════════════════════════════════════
// PARSER DE INGREDIENTES
// ═══════════════════════════════════════════════════════════════════

function parsearLineaIngrediente(linea, seccionExterna = null) {
  let texto = limpiar(linea);
  texto = texto.replace(/^[-–—]\s*/, '');

  let seccion = seccionExterna;
  const mSec = texto.match(PREFIJOS_SECCION);
  if (mSec) {
    seccion = mSec[1];
    texto = texto.replace(mSec[0], '').trim();
  }

  const notasParen = [];
  const reP = /\(([^)]*)\)/g;
  let mP;
  while ((mP = reP.exec(texto)) !== null) {
    const contenido = mP[1].trim();
    if (contenido) notasParen.push(contenido);
  }
  texto = texto.replace(/\([^)]*\)/g, ' ').trim();

  if (/\baprox\.?\b/i.test(texto)) {
    notasParen.push('aprox.');
    texto = texto.replace(/,?\s*\baprox\.?\b/gi, '').trim();
  }

  texto = normalizarFracciones(texto);

  let nota = notasParen.length ? notasParen.join(', ') : null;
  const agregarNota = t => { if (t) nota = nota ? `${nota}, ${t}` : t; };

  if (/\bopcional(es)?\b/i.test(texto)) {
    if (!seccion) seccion = 'Opcional';
    texto = texto.replace(/,?\s*\(?\s*opcional(es)?\s*\)?/gi, '').trim();
  }
  if (/\bal gusto\b/i.test(texto)) {
    agregarNota('al gusto');
    texto = texto.replace(/,?\s*al gusto/gi, '').trim();
  }
  if (/\ba gusto\b/i.test(texto)) {
    agregarNota('a gusto');
    texto = texto.replace(/,?\s*a gusto/gi, '').trim();
  }
  if (/\bsi es necesario\b/i.test(texto)) {
    agregarNota('si es necesario');
    texto = texto.replace(/,?\s*si es necesario/gi, '').trim();
  }
  if (/\bpara decorar\b/i.test(texto)) {
    agregarNota('para decorar');
    texto = texto.replace(/,?\s*para decorar/gi, '').trim();
  }

  // FIX-2: strip residual ":" "," ";" DESPUÉS de quitar modificadores
  texto = texto.replace(/^[:;,]\s*/, '').trim();

  // Descriptor compuesto "en rodajas o tiras"
  texto = texto.replace(/(en\s+(?:rodajas|tiras|cubos|trozos|gajos|cuartos|mitades|láminas|juliana|bastones)\s+o\s+(?:rodajas|tiras|cubos|trozos|gajos|cuartos|mitades|láminas|juliana|bastones))/gi, (m) => {
    agregarNota(m);
    return '';
  });
  texto = limpiar(texto);

  let cantidad = null;
  let unidad = null;
  let nombre = texto;

  const mRango = texto.match(/^(\d+)\s*(?:-|–|a)\s*(\d+)\s+([A-Za-záéíóúñ.]+)?\s*(?:de\s+|del\s+)?(.+)$/);
  if (mRango && mRango[3] && normalizarUnidad(mRango[3])) {
    cantidad = parseInt(mRango[1]);
    unidad = normalizarUnidad(mRango[3]);
    nombre = mRango[4];
    agregarNota(`rango ${mRango[1]}-${mRango[2]}`);
  } else if (mRango && !mRango[3]) {
    cantidad = parseInt(mRango[1]);
    nombre = mRango[4];
    agregarNota(`rango ${mRango[1]}-${mRango[2]}`);
  } else {
    const mNum = texto.match(/^([\d.]+)\s+(.+)$/);
    if (mNum) {
      cantidad = parseFloat(mNum[1]);
      if (isNaN(cantidad)) cantidad = null;
      let resto = mNum[2].trim();
      const mUnidad = resto.match(/^([A-Za-záéíóúñ.]+)\s+(?:de\s+|del\s+)?(.+)$/);
      if (mUnidad && normalizarUnidad(mUnidad[1])) {
        unidad = normalizarUnidad(mUnidad[1]);
        nombre = mUnidad[2];
      } else {
        nombre = resto.replace(/^(?:de\s+|del\s+)/i, '');
      }
    } else {
      const mPalabra = texto.match(/^(una|un|dos|tres|cuatro|cinco|media|medio)\s+(pizca|chorrito|puñado|manojo|poco)\b\s*(?:de\s+)?(.+)?$/i);
      if (mPalabra) {
        cantidad = 1;
        unidad = mPalabra[2];
        nombre = mPalabra[3] || mPalabra[2];
        agregarNota(mPalabra[1]);
      } else {
        if (/^(un|una|unos|unas|el|la|los|las)\s+/i.test(texto)) {
          cantidad = 1;
          nombre = texto.replace(/^(un|una|unos|unas|el|la|los|las)\s+/i, '');
        } else {
          nombre = texto.replace(/^(?:de\s+|del\s+)/i, '');
        }
      }
    }
  }

  nombre = limpiar(nombre).replace(/^(?:de\s+|del\s+)/i, '').replace(/^[:;,]\s*/, '').trim();

  const mDobleCantidad = nombre.match(/^(\d+)\s*(g|gr|grs|kg|ml|l|lt|tarro|tarros|lata|latas|frasco|frascos)\s+(?:de\s+|del\s+)?(.+)$/i);
  if (mDobleCantidad) {
    if (cantidad === null) {
      cantidad = parseFloat(mDobleCantidad[1]);
      unidad = normalizarUnidad(mDobleCantidad[2]);
      nombre = mDobleCantidad[3];
    } else {
      agregarNota(`${mDobleCantidad[1]} ${mDobleCantidad[2]}`);
      nombre = mDobleCantidad[3];
    }
  }

  const mJugo = nombre.match(/^jugo\s+de\s+(\d+)\s+(lim[oó]n(?:es)?|naranja(?:s)?)$/i);
  if (mJugo) {
    agregarNota(`de ${mJugo[1]} ${mJugo[2]}`);
    nombre = `jugo de ${mJugo[2]}`;
  }

  const mParaUso = nombre.match(/^(.+?)\s+(para\s+(?:fre[ií]r|engrasar|enharinar|espolvorear|pasar|untar|rociar|decorar|pintar|sellar|mojar|aderezar|bañar|acompañar|servir|el\s+\w+|la\s+\w+|los\s+\w+|las\s+\w+).*)$/i);
  if (mParaUso) {
    agregarNota(mParaUso[2]);
    nombre = mParaUso[1];
  }

  const { nombreLimpio, notas: notasDesc } = extraerDescriptores(nombre);
  notasDesc.forEach(agregarNota);
  nombre = nombreLimpio;

  if (cantidad === null) {
    cantidad = 1;
    if (!nota) nota = 'a gusto';
  }

  if (!nombre || nombre.length < 2) return null;
  if (NOMBRES_BASURA.test(nombre)) return null;
  if (/^[\W\d]+$/.test(nombre)) return null;

  if (matchea(UTENSILIOS, nombre) && !nota) nota = 'utensilio, no comestible';

  let escalable = true;
  if (matchea(NUNCA_ESCALABLES, nombre) || matchea(INDIVISIBLES, nombre) || matchea(UTENSILIOS, nombre)) {
    escalable = false;
  }

  const ing = { cantidad, unidad, nombre: nombre.toLowerCase() };
  if (nota) ing.nota = nota;
  if (seccion) ing.seccion = seccion;
  ing.escalable = escalable;
  return ing;
}

function parsearLineaIngredienteSeguro(linea) {
  const t = limpiar(linea);
  if (!t) return [];
  if (HEADERS_SUELTOS.test(t)) return [];

  const partes = t.split(/,\s+(?=\d)/);
  if (partes.length > 1) {
    const intentos = partes.map(p => parsearLineaIngrediente(p)).filter(Boolean);
    if (intentos.length === partes.length) return intentos;
  }

  const directo = parsearLineaIngrediente(t);
  return directo ? [directo] : [];
}

function parsearIngredientes(ingredientes) {
  const resultado = [];
  const warnings = [];
  let seccionActiva = null;

  for (const linea of ingredientes || []) {
    const t = limpiar(linea);
    if (!t) continue;

    if (HEADERS_SUELTOS.test(t)) {
      const mSec = t.match(/^Para\s+(?:el|la|los|las)?\s*(.+?):\s*$/i);
      if (mSec) seccionActiva = mSec[1].trim();
      continue;
    }

    const mPrefijo = t.match(PREFIJOS_SECCION);
    if (mPrefijo) {
      seccionActiva = mPrefijo[1];
      const resto = t.replace(PREFIJOS_SECCION, '').trim();
      if (!resto) continue;
      try {
        const parsed = parsearLineaIngredienteSeguro(resto);
        parsed.forEach(p => { if (seccionActiva && !p.seccion) p.seccion = seccionActiva; resultado.push(p); });
      } catch (e) { warnings.push(`No se pudo parsear "${resto}": ${e.message}`); }
      continue;
    }

    try {
      const parsed = parsearLineaIngredienteSeguro(linea);
      parsed.forEach(p => { if (seccionActiva && !p.seccion) p.seccion = seccionActiva; resultado.push(p); });
    } catch (e) { warnings.push(`No se pudo parsear "${linea}": ${e.message}`); }
  }
  return { ingredientes_v2: resultado, warnings };
}

// ═══════════════════════════════════════════════════════════════════
// MATCHER DE INGREDIENTES
// ═══════════════════════════════════════════════════════════════════

const STOPWORDS_MATCH = new Set([
  'del', 'con', 'los', 'las', 'una', 'uno', 'para', 'por', 'que',
  'mas', 'sin', 'unos', 'unas', 'sobre', 'hasta', 'desde',
  'muy', 'bien', 'recien', 'solo', 'sola', 'solas', 'solos',
]);

function palabrasSignificativas(nombre) {
  return normalizarYsingularizar(nombre).split(/\s+/).filter(p => p.length > 2 && !STOPWORDS_MATCH.has(p));
}

function variantesAlternativas(nombre) {
  if (/\s+o\s+/i.test(nombre)) {
    return nombre.split(/\s+o\s+/i).map(s => s.trim()).filter(Boolean);
  }
  return [nombre];
}

function esPasoGenerico(texto) {
  return /(mezcl(?:a|o|ar|ando|amos|en)\s+(todos|todo|bien|hasta)|incorpora\s+(todo|todos)|integra\s+(todo|todos)|combina\s+(todo|todos)|lic[uú]a\s+(todo|todos)|procesa\s+(todo|todos)|revuelve\s+(todo|todos)|agita\s+(todo|todos)|bate\s+(todo|todos)|une\s+(todo|todos)|junta\s+(todo|todos)|agrega\s+(todo|todos)\s+los\s+ingredientes|con\s+todos\s+los\s+ingredientes|los\s+ingredientes\s+(restantes|anteriores)|en\s+(?:la\s+)?coctelera|en\s+(?:el\s+)?shaker|verter\s+(?:todo|todos)|agregar\s+(?:todo|todos)|revolver\s+(?:los\s+ingredientes|todo))/i.test(texto);
}

function detectaUsoImplicito(ingrediente, textoPaso) {
  const nombreNorm = normalizarTexto(ingrediente.nombre);
  const textNorm = normalizarTexto(textoPaso);

  if (nombreNorm.includes('aceite') && !textNorm.includes('aceite')) {
    if (/fre[ií]r|sofr|dor(?:ar|e)|salt(?:ear|e)/i.test(textoPaso)) return true;
  }

  if (!ingrediente.nota) return false;

  if (/^para (fre[ií]r|engrasar|enharinar|espolvorear|pasar|untar|rociar|decorar|pintar|sellar|mojar|aderezar|bañar|acompañar|servir)/i.test(ingrediente.nota)) {
    const verbo = ingrediente.nota.match(/^para\s+(\w+)/i)?.[1];
    if (!verbo) return false;
    const verboNorm = normalizarTexto(verbo);
    const mapa = {
      'freir': ['frie', 'freir', 'frito', 'fríe', 'freír', 'fria'],
      'engrasar': ['engras', 'unt', 'pincele'],
      'enharinar': ['enharin', 'harina', 'pasar por harina'],
      'espolvorear': ['espolvore', 'roci', 'espolvor'],
      'pasar': ['pasa', 'pase'],
      'untar': ['unt', 'untar'],
      'rociar': ['roci', 'rocia'],
      'decorar': ['decor', 'adorn'],
      'pintar': ['pint', 'pincele', 'pincel'],
      'sellar': ['sell', 'dora', 'dore'],
      'mojar': ['moj', 'roci'],
      'aderezar': ['aderez', 'aliñ', 'condiment'],
      'bañar': ['bañ', 'cubr', 'roci'],
      'acompañar': ['acompañ', 'sirv', 'servir'],
      'servir': ['sirv', 'servir', 'acompañ'],
    };
    const candidatos = mapa[verboNorm] || [verboNorm];
    return candidatos.some(c => textNorm.includes(c));
  }

  const mUtensilio = ingrediente.nota.match(/^para (el|la|los|las)\s+(\w+)/i);
  if (mUtensilio) {
    const utensilioNorm = normalizarTexto(mUtensilio[2]);
    return textNorm.includes(utensilioNorm);
  }
  return false;
}

function mapearIngredientesEnPaso(texto, ingredientes) {
  const indices = new Set();
  const tNorm = normalizarYsingularizar(texto);

  const pasoDiceVerduras = /\bverduras?\b/i.test(texto);
  const pasoDiceMariscos = /\bmariscos?\b/i.test(texto);
  const pasoDiceCarnes = /\bcarnes?\b/i.test(texto);

  for (let i = 0; i < ingredientes.length; i++) {
    const ing = ingredientes[i];

    if (detectaUsoImplicito(ing, texto)) { indices.add(i + 1); continue; }
    if (pasoDiceVerduras && VEGETALES_COMUNES.test(ing.nombre)) { indices.add(i + 1); continue; }
    if (pasoDiceMariscos && MARISCOS_COMUNES.test(ing.nombre)) { indices.add(i + 1); continue; }
    if (pasoDiceCarnes && CARNES_COMUNES.test(ing.nombre)) { indices.add(i + 1); continue; }

    const variantes = variantesAlternativas(ing.nombre);

    let matched = false;
    for (const variante of variantes) {
      const palabras = palabrasSignificativas(variante);
      if (palabras.length === 0) continue;

      let coincidencias = 0;
      for (const p of palabras) {
        if (tNorm.includes(p)) { coincidencias++; continue; }
        const sinos = SINONIMOS[p] || [];
        if (sinos.some(s => tNorm.includes(normalizarTexto(s)))) coincidencias++;
      }

      const principalEnPaso = palabras.length > 0 && tNorm.includes(palabras[0]);

      if (coincidencias >= 1 && (palabras.length <= 2 || principalEnPaso)) {
        matched = true;
        break;
      }
    }

    if (matched) indices.add(i + 1);
  }
  return Array.from(indices).sort((a, b) => a - b);
}

// ═══════════════════════════════════════════════════════════════════
// PARSER DE PASOS
// ═══════════════════════════════════════════════════════════════════

function detectarPrevio(texto) {
  if (/de un d[ií]a para otro/i.test(texto)) return true;
  if (/la noche anterior/i.test(texto)) return true;
  if (/toda la noche/i.test(texto)) return true;
  const mHoras = texto.match(/(\d+(?:[.,]\d+)?)\s*h(?:ora)?s?\s+antes/i);
  if (mHoras && parseFloat(mHoras[1].replace(',', '.')) >= 1) return true;
  if (/dejar\s+reposar[^.]*?idealmente\s+\d+\s*h/i.test(texto)) return true;
  return false;
}

function detectarTimers(texto) {
  const timers = [];
  const capturados = new Set();
  const add = (minutos, etiqueta) => {
    if (minutos > 0 && !capturados.has(etiqueta)) {
      timers.push({ minutos, etiqueta });
      capturados.add(etiqueta);
    }
  };

  const esCada = (matchIndex) => {
    const before = texto.slice(Math.max(0, matchIndex - 15), matchIndex);
    return /cada\s+$/i.test(before);
  };

  const rangos = [];
  const reRango = /(\d+)\s*(?:-|–|a)\s*(\d+)\s*(min(?:utos)?|h(?:oras?)?)/gi;
  let m;
  while ((m = reRango.exec(texto)) !== null) {
    if (esCada(m.index)) continue;
    const max = parseInt(m[2]);
    const esHora = /h/i.test(m[3]);
    const minutos = esHora ? max * 60 : max;
    rangos.push({ pos: m.index, len: m[0].length, minutos, etiqueta: limpiar(m[0]) });
  }
  const enRango = (pos) => rangos.some(r => pos >= r.pos && pos < r.pos + r.len);
  for (const r of rangos) add(r.minutos, r.etiqueta);

  if (/hora y media|1\s*h\s*y\s*media/i.test(texto)) add(90, '1 hora y media');
  if (/media hora/i.test(texto)) add(30, 'media hora');

  const reHMin = /(\d+)\s*h(?:ora)?s?\s*(?:y\s*)?(\d+)\s*min(?:utos)?/gi;
  while ((m = reHMin.exec(texto)) !== null) {
    if (enRango(m.index) || esCada(m.index)) continue;
    add(parseInt(m[1]) * 60 + parseInt(m[2]), limpiar(m[0]));
  }

  const reHora = /(\d+(?:[.,]\d+)?)\s*h(?:ora)?s?\b/gi;
  while ((m = reHora.exec(texto)) !== null) {
    if (enRango(m.index) || esCada(m.index)) continue;
    const val = parseFloat(m[1].replace(',', '.'));
    add(Math.round(val * 60), limpiar(m[0]));
  }

  const reMin = /(\d+)\s*min(?:utos?)?\b/gi;
  while ((m = reMin.exec(texto)) !== null) {
    if (enRango(m.index) || esCada(m.index)) continue;
    add(parseInt(m[1]), limpiar(m[0]));
  }

  return timers;
}

function parsearPasos(pasos, ingredientes) {
  const resultado = [];
  const yaUsados = new Set();

  for (const texto of pasos || []) {
    const paso = { texto };

    let ings;
    if (esPasoGenerico(texto)) {
      ings = [];
      for (let i = 0; i < ingredientes.length; i++) {
        if (!yaUsados.has(i + 1)) ings.push(i + 1);
      }
    } else {
      ings = mapearIngredientesEnPaso(texto, ingredientes);
    }

    if (ings.length) {
      paso.ingredientes = ings;
      ings.forEach(i => yaUsados.add(i));
    }

    if (detectarPrevio(texto)) {
      paso.previo = true;
    } else {
      const timers = detectarTimers(texto);
      const validos = timers.filter(t => t.minutos <= UMBRAL_PREVIO_MIN);
      if (validos.length < timers.length) paso.previo = true;
      if (validos.length) paso.timers = validos;
    }
    resultado.push(paso);
  }
  return resultado;
}

// ═══════════════════════════════════════════════════════════════════
// TIEMPO_V2 (FIX-1: clasificarTimer prioriza verbo principal)
// ═══════════════════════════════════════════════════════════════════

function parsearTiempoOriginal(t) {
  if (!t) return null;
  const reHMin = /(\d+)\s*h(?:ora)?s?\s*(?:y\s*)?(\d+)\s*min(?:utos)?/i;
  const mHMin = t.match(reHMin);
  if (mHMin) return parseInt(mHMin[1]) * 60 + parseInt(mHMin[2]);

  let total = 0;
  const reH = /(\d+)\s*h(?:ora)?s?\b/gi;
  let m;
  while ((m = reH.exec(t)) !== null) total += parseInt(m[1]) * 60;
  const reMin = /(\d+)\s*min(?:utos)?\b/gi;
  while ((m = reMin.exec(t)) !== null) total += parseInt(m[1]);
  return total || null;
}

function extraerDuracionDeTexto(texto) {
  const duraciones = [];
  if (/de un d[ií]a para otro/i.test(texto)) duraciones.push(24 * 60);
  if (/toda la noche/i.test(texto)) duraciones.push(8 * 60);
  if (/la noche anterior/i.test(texto)) duraciones.push(8 * 60);

  const mAlMenos = texto.match(/al menos\s+(\d+(?:[.,]\d+)?)\s*(h(?:ora)?s?|min(?:utos)?)/i);
  if (mAlMenos) {
    const cant = parseFloat(mAlMenos[1].replace(',', '.'));
    const esHora = /h/i.test(mAlMenos[2]);
    duraciones.push(esHora ? Math.round(cant * 60) : Math.round(cant));
  }

  const reH = /(\d+(?:[.,]\d+)?)\s*h(?:ora)?s?\b/gi;
  let m;
  while ((m = reH.exec(texto)) !== null) {
    duraciones.push(Math.round(parseFloat(m[1].replace(',', '.')) * 60));
  }
  const reMin = /(\d+)\s*min(?:utos)?\b/gi;
  while ((m = reMin.exec(texto)) !== null) {
    duraciones.push(parseInt(m[1]));
  }
  return duraciones.length === 0 ? 0 : Math.min(...duraciones);
}

/** FIX-1: clasificar por verbo PRINCIPAL del paso (primer verbo de acción) */
function clasificarTimer(paso, timer) {
  const texto = paso.texto;

  // Buscar el primer verbo de acción (cocinar/hornear/reposar/marinar...)
  const mVerbo = texto.match(/\b(cocinar|hornear|asar|cocer|fre[ií]r|hervir|guisar|sofr[eí]ír|saltear|dorar|reposar|marinar|macerar|remojar|enfriar|atemperar|levedar|refrigerar)\b/i);
  const verbo = mVerbo ? normalizarTexto(mVerbo[1]) : '';

  if (/^(cocinar|hornear|asar|cocer|freir|hervir|guisar|sofreir|saltear|dorar)$/.test(verbo)) return 'coccion';
  if (/^(reposar|marinar|macerar|remojar|enfriar|atemperar|levedar|refrigerar)$/.test(verbo)) return 'reposo';

  // Fallback: evaluar contexto completo
  const ctx = `${paso.texto} ${timer.etiqueta}`.toLowerCase();
  if (/cocin|horn|herv|fre[ií]|asar|cocer|guis|sofr|salt|dor/i.test(ctx)) return 'coccion';
  if (/repos|marin|macer|remoj|enfri|atemper|levad/i.test(ctx)) return 'reposo';
  return 'preparacion';
}

function calcularTiempoV2(tiempoOriginal, pasos_v2) {
  const total = { preparacion: 0, reposo: 0, coccion: 0 };

  for (const paso of pasos_v2) {
    if (paso.previo) {
      const dur = extraerDuracionDeTexto(paso.texto);
      if (dur > 0) total.reposo += dur;
      continue;
    }
    if (!paso.timers) continue;

    const tieneAlternativas = /también\s+se\s+puede|alternativ|si\s+prefieres|opcionalmente/i.test(paso.texto);
    if (tieneAlternativas && paso.timers.length > 1) {
      const maxTimer = paso.timers.reduce((max, t) => t.minutos > max.minutos ? t : max, paso.timers[0]);
      total[clasificarTimer(paso, maxTimer)] += maxTimer.minutos;
    } else {
      for (const t of paso.timers) {
        total[clasificarTimer(paso, t)] += t.minutos;
      }
    }
  }

  const out = {};
  if (total.preparacion > 0) out.preparacion = total.preparacion;
  if (total.reposo > 0) out.reposo = total.reposo;
  if (total.coccion > 0) out.coccion = total.coccion;

  if (Object.keys(out).length === 0) {
    const origMin = parsearTiempoOriginal(tiempoOriginal);
    if (origMin) out.coccion = origMin;
  }
  return out;
}

// ═══════════════════════════════════════════════════════════════════
// HUÉRFANOS ACEPTABLES
// ═══════════════════════════════════════════════════════════════════

function esHuerfanoAceptable(ing, pasos_v2) {
  if (CONDIMENTOS.test(ing.nombre)) return true;
  if (matchea(UTENSILIOS, ing.nombre)) return true;
  if (AMBIENTALES.test(ing.nombre)) return true;
  if (ACOMPAÑAMIENTO.test(ing.nombre) || (ing.nota && ACOMPAÑAMIENTO.test(ing.nota))) return true;
  if (USO_IMPLICITO.test(ing.nota || '')) return true;
  if (ing.seccion === 'Opcional') return true;
  if (ing.seccion) {
    const seccionNorm = normalizarTexto(ing.seccion);
    for (const p of pasos_v2) {
      if (normalizarTexto(p.texto).includes(seccionNorm)) return true;
    }
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════════
// PIPELINE
// ═══════════════════════════════════════════════════════════════════

const allWarnings = [];

async function procesarReceta(archivo) {
  const ruta = path.join(INPUT_DIR, archivo);
  const raw = await fs.readFile(ruta, 'utf-8');
  let receta;
  try { receta = JSON.parse(raw); }
  catch (e) { return { archivo, error: `JSON inválido: ${e.message}` }; }

  if (!FORZAR && receta.revisado_v2 === true) return { archivo, saltada: true };

  const warnings = [];

  if (!receta.ingredientes_v2) {
    const r = parsearIngredientes(receta.ingredientes || []);
    receta.ingredientes_v2 = r.ingredientes_v2;
    warnings.push(...r.warnings);
  }

  if (!receta.pasos_v2) {
    receta.pasos_v2 = parsearPasos(receta.pasos || [], receta.ingredientes_v2);
  }

  if (!receta.tiempo_v2) {
    receta.tiempo_v2 = calcularTiempoV2(receta.tiempo, receta.pasos_v2);
  }

  const usados = new Set();
  for (const p of receta.pasos_v2) {
    if (Array.isArray(p.ingredientes)) p.ingredientes.forEach(i => usados.add(i));
  }
  receta.ingredientes_v2.forEach((ing, i) => {
    if (usados.has(i + 1)) return;
    if (esHuerfanoAceptable(ing, receta.pasos_v2)) return;
    warnings.push(`huérfano: "${ing.nombre}" (#${i + 1})`);
  });

  receta.revisado_v2 = false;

  if (DUMP_V2_DIR) {
    await fs.mkdir(DUMP_V2_DIR, { recursive: true });
    await fs.writeFile(path.join(DUMP_V2_DIR, archivo), JSON.stringify(receta, null, 2) + '\n', 'utf-8');
  }

  if (!DRY_RUN && !DUMP_V2_DIR) {
    await fs.writeFile(ruta, JSON.stringify(receta, null, 2) + '\n', 'utf-8');
  }

  return { archivo, warnings };
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

async function main() {
  console.log('🍳 Migrador Recetario Chileno — v2.7');
  console.log(`   Directorio: ${INPUT_DIR}`);
  console.log(`   Modo:       ${DRY_RUN ? 'DRY-RUN (no escribe)' : 'ESCRITURA'}`);
  console.log(`   Forzar:     ${FORZAR ? 'SÍ' : 'no'}`);
  if (DUMP_V2_DIR) console.log(`   Dump-v2:    ${DUMP_V2_DIR}`);
  if (DUMP_PATH) console.log(`   Dump-warn:  ${DUMP_PATH}`);
  console.log('');

  let archivos;
  try { archivos = (await fs.readdir(INPUT_DIR)).filter(f => f.endsWith('.json')); }
  catch (e) { console.error(`❌ No se pudo leer ${INPUT_DIR}: ${e.message}`); process.exit(1); }

  console.log(`📁 Encontrados ${archivos.length} archivos\n`);

  let ok = 0, saltadas = 0, conWarn = 0, errores = 0;

  for (const archivo of archivos) {
    try {
      const res = await procesarReceta(archivo);
      if (res.error) { errores++; console.error(`❌ ${archivo}: ${res.error}`); continue; }
      if (res.saltada) { saltadas++; if (VERBOSE) console.log(`⏭️  ${archivo}`); continue; }
      ok++;
      if (res.warnings.length) {
        conWarn++;
        allWarnings.push({ archivo, warnings: res.warnings });
        console.log(`⚠️  ${archivo}`);
        res.warnings.forEach(w => console.log(`    • ${w}`));
      } else {
        console.log(`✅ ${archivo}`);
      }
    } catch (e) {
      errores++;
      console.error(`❌ ${archivo}: ${e.message}`);
    }
  }

  console.log('\n📊 Resumen');
  console.log(`   ✅ Procesadas:  ${ok}`);
  console.log(`   ⏭️  Saltadas:    ${saltadas}`);
  console.log(`   ⚠️  Con warn:   ${conWarn}`);
  console.log(`   ❌ Errores:     ${errores}`);

  if (DUMP_PATH) {
    await fs.writeFile(DUMP_PATH, JSON.stringify(allWarnings, null, 2) + '\n', 'utf-8');
    console.log(`\n📝 Warnings volcados a: ${DUMP_PATH}`);
  }
  console.log('\n👉 Siguiente: revisar manualmente y pasar `revisado_v2` a `true`.\n');
}

main().catch(e => { console.error('💥 Error fatal:', e); process.exit(1); });