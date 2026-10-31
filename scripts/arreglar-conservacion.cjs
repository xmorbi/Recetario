// scripts/arreglar-conservacion.cjs
// Uso:
//   node scripts/arreglar-conservacion.cjs --dry-run    (solo reporte, no escribe)
//   node scripts/arreglar-conservacion.cjs              (aplica los cambios)

const fs = require('fs');
const path = require('path');

const DIR = path.join(process.cwd(), 'src', 'content', 'recetas');
const DRY_RUN = process.argv.includes('--dry-run');
const REPORT_FILE = path.join(process.cwd(), 'conservacion-report.txt');

// ============================================================
// CLASIFICADOR: asigna cada oración a refrigerador/congelador/recalentar
// Prioridad: negación-de-congelar > refrigerador/guardado > congelar > recalentar
// ============================================================

const NEGACION_CONGELAR = /\bno\s+(?:se\s+)?(?:puede[n]?\s+)?congel|no\s+apto\s+para\s+congelar/i;
const REFRI_KEYWORDS   = /\b(refriger\w*|refri\b|heladera|nevera|recipiente\s+herm[ée]tico|papel\s+aluminio|lugar\s+fresco|guardar|conservar|mantener)/i;
const SERVIR_INMEDIATO = /\bservir\s+de\s+inmediato\b/i;
const CONGELA_KEYWORDS = /\b(congel\w*|freezer)/i;
const RECALENTAR_KW    = /\b(recalent\w*|volver\s+a\s+calentar|calentar|calentito|caliente)\b/i;

function clasificar(oracion) {
  if (NEGACION_CONGELAR.test(oracion)) return 'refrigerador';
  if (REFRI_KEYWORDS.test(oracion))    return 'refrigerador';
  if (SERVIR_INMEDIATO.test(oracion))  return 'refrigerador';
  if (CONGELA_KEYWORDS.test(oracion))  return 'congelador';
  if (RECALENTAR_KW.test(oracion))     return 'recalentar';
  return 'refrigerador'; // fallback
}

// ============================================================
// LIMPIADOR: quita prefijos verbales redundantes de forma SEGURA.
// Si al limpiar el resultado queda vacío, muy corto, o empieza con
// conector ("y", "o", "e"...), se revierte y se usa el texto original.
// ============================================================

function limpiar(oracion) {
  const original = oracion.trim();
  let s = original;

  // Quitar "o " inicial si va seguido de verbo de cocina
  s = s.replace(/^o\s+(?=(?:guardar|conservar|mantener|dejar|recalentar|congelar|servir|fre[íi]r|asar)\b)/i, '');

  // A) "Guardar/conservar/mantener [en el] [refrigerador/congelador/recipiente] hasta X" → "X"
  if (s === original || s.length < original.length) {
    const prev = s;
    s = s.replace(
      /^(?:se\s+)?(?:pueden?|deben?)?\s*(?:guardar|conservar|mantener|dejar)\s+(?:en\s+)?(?:el\s+|la\s+|los\s+|las\s+|un\s+|una\s+)?(?:refrigerador|refri|heladera|nevera|congelador|freezer|recipiente\s+herm[ée]tico|papel\s+aluminio|lugar\s+fresco)\s+hasta\s+/i,
      ''
    );
    if (s === prev) s = prev; // no-op, mantenemos
  }

  // B) "Guardar... por/durante X" → "Por X"
  if (s === original) {
    const m = original.match(
      /^(?:se\s+)?(?:pueden?|deben?)?\s*(?:guardar|conservar|mantener|dejar)\s+(?:en\s+)?(?:el\s+|la\s+|los\s+|las\s+|un\s+|una\s+)?(?:refrigerador|refri|heladera|nevera|congelador|freezer|recipiente\s+herm[ée]tico|papel\s+aluminio|lugar\s+fresco)\s+(por|durante)\s+(.+)$/i
    );
    if (m) s = m[1].charAt(0).toUpperCase() + m[1].slice(1) + ' ' + m[2];
  }

  // C) "Mantener refrigerada y ..." → "..."
  if (s === original) {
    s = s.replace(/^(?:mantener|guardar|conservar|dejar)\s+refrigerad[oa]s?\s+y\s+/i, '');
  }

  // D) "Recalentar en/a/con X" → "En/A/Con X"
  if (s === original) {
    const mPre = original.match(/^(?:recalentar|calentar)\s+(en|a|con)\s+(.+)$/i);
    if (mPre) {
      s = mPre[1].charAt(0).toUpperCase() + mPre[1].slice(1) + ' ' + mPre[2];
    } else {
      const mNoPre = original.match(/^(?:recalentar|calentar)\s+(.+)$/i);
      if (mNoPre) s = mNoPre[1].charAt(0).toUpperCase() + mNoPre[1].slice(1);
    }
  }

  // Validaciones finales
  if (s.length < 3) s = original;
  if (/^(?:y|o|e|pero|sino|aunque|también|tambien)\s+/i.test(s)) s = original;
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return s;
}

// ============================================================
// PARSER: split + clasificar + limpiar + unir
// ============================================================

function parseConservacion(text) {
  if (!text || typeof text !== 'string') return null;
  const t = text.trim();
  if (!t) return null;

  const result = {};

  // Split 1: por ";" o salto de línea o "." seguido de espacio + mayúscula.
  //   (no split por "." genérico para no romper "1 h 15 min" ni "2 a 3 días")
  // Split 2: por " y " seguido de verbo de cocina, para separar
  //   "guardar en refri hasta 2 días y recalentar en horno" en dos oraciones.
  const oraciones = t
    .split(/[;\n]|\.(?=\s+[A-ZÁÉÍÓÚÑ])/)
    .flatMap(s => s.split(/\s+y\s+(?=(?:recalentar|congelar|servir|calentar|volver\s+a\s+calentar)\b)/i))
    .map(s => s.trim())
    .filter(Boolean);

  oraciones.forEach(oracion => {
    const key = clasificar(oracion);
    const clean = limpiar(oracion);

    if (!result[key]) {
      result[key] = clean;
    } else {
      // Separador correcto entre oraciones
      const sep = /[.!?]$/.test(result[key]) ? ' ' : '. ';
      result[key] += sep + clean;
    }
  });

  return Object.keys(result).length > 0 ? result : null;
}

// ============================================================
// EJECUCIÓN
// ============================================================

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort();
const report = [];
let fixed = 0, skipped = 0, errors = 0;

files.forEach(f => {
  const filePath = path.join(DIR, f);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    errors++;
    console.error('ERROR (JSON inválido):', f, '-', e.message);
    return;
  }

  if (typeof data.conservacion === 'string') {
    const original = data.conservacion;
    const parsed = parseConservacion(original);
    if (!parsed) { skipped++; return; }
    data.conservacion = parsed;
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    }
    report.push({ file: f, original, parsed });
    fixed++;
  }
});

// ============================================================
// REPORTE
// ============================================================

const lines = [];
lines.push('=== Reporte de conservación ===');
lines.push(`Modo: ${DRY_RUN ? 'DRY-RUN (no se modificó nada)' : 'APLICADO'}`);
lines.push(`Corregidos: ${fixed}   ·   Saltados: ${skipped}   ·   Errores: ${errors}`);
lines.push('');
report.forEach(r => {
  lines.push(`📄 ${r.file}`);
  lines.push(`   ANTES:  ${r.original}`);
  lines.push(`   DESPUÉS:`);
  Object.entries(r.parsed).forEach(([k, v]) => lines.push(`     • ${k}: ${v}`));
  lines.push('');
});
fs.writeFileSync(REPORT_FILE, lines.join('\n'), 'utf8');

console.log('');
console.log(`✅ ${DRY_RUN ? 'DETECTADOS' : 'CORREGIDOS'}: ${fixed} archivos`);
console.log(`   Saltados: ${skipped}   ·   Errores: ${errors}`);
console.log(`   Reporte: ${REPORT_FILE}`);
console.log('');
if (DRY_RUN) {
  console.log('⚠️  Modo DRY-RUN: no se modificó ningún archivo.');
  console.log('   Revisa el reporte y luego corre sin --dry-run para aplicar.');
  console.log('');
}