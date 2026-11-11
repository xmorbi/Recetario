#!/usr/bin/env node
/* Corrige ingredientes_v2 cuyo "nombre" empieza con un decimal, firma
   de la cantidad duplicada: { cantidad: 2, nombre: "0.5 tazas de arroz" }.

   Regla: nuevaCantidad = cantidadOriginal + decimalDelNombre.
   Se re-parsea el resto con parsearIngredienteTexto() para extraer
   unidad/nombre/nota sin inventar.

   Uso:
     node scripts\corregir-duplicados.mjs --dry-run   (default)
     node scripts\corregir-duplicados.mjs --apply
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsearIngredienteTexto } from '../src/lib/escalado.js';

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/content/recetas');
const APPLY = process.argv.includes('--apply');
const RE_DECIMAL_INICIO = /^\s*(\d+[.,]\d+)\s+(.+)$/;

let archivosRevisados = 0;
let archivosModificados = 0;
let aplicables = 0;
let manuales = 0;
const detalles = [];

for (const f of fs.readdirSync(DIR).sort()) {
  if (!f.endsWith('.json')) continue;
  const full = path.join(DIR, f);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (e) {
    console.error(`[!] JSON inválido: ${f} — ${e.message}`);
    continue;
  }
  const ings = data.ingredientes_v2;
  if (!Array.isArray(ings)) continue;
  archivosRevisados++;

  let cambiosArchivo = 0;
  ings.forEach((ing, idx) => {
    if (!ing || typeof ing.nombre !== 'string') return;
    if (!/^\s*\d/.test(ing.nombre)) return;

    const m = RE_DECIMAL_INICIO.exec(ing.nombre);
    if (!m) {
      manuales++;
      detalles.push({
        archivo: f, indice: idx, tipo: 'manual',
        antes: ing, razon: 'el nombre empieza con entero, no con decimal',
      });
      return;
    }

    const decimal = parseFloat(m[1].replace(',', '.'));
    const resto = m[2];
    const parsed = parsearIngredienteTexto(resto);

    const cantOriginal = ing.cantidad == null ? 0 : ing.cantidad;
    const nuevaCantidad = Math.round((cantOriginal + decimal) * 1000) / 1000;

    const nuevo = {
      ...ing,
      cantidad: nuevaCantidad,
      unidad: parsed && parsed.unidad != null ? parsed.unidad : ing.unidad,
      nombre: parsed && parsed.nombre ? parsed.nombre : resto,
      nota: (parsed && parsed.nota) || ing.nota || undefined,
    };

    aplicables++;
    cambiosArchivo++;
    detalles.push({
      archivo: f, indice: idx, tipo: 'aplicable',
      antes: ing, despues: nuevo,
    });

    if (APPLY) {
      ings[idx] = nuevo;
    }
  });

  if (APPLY && cambiosArchivo > 0) {
    archivosModificados++;
    const bak = full + '.bak';
    fs.copyFileSync(full, bak);
    fs.writeFileSync(full, JSON.stringify(data, null, 2) + '\n');
  }
}

console.log(`\n${APPLY ? 'APLICADO' : 'DRY-RUN (nada escrito)'}`);
console.log(`Archivos revisados:  ${archivosRevisados}`);
console.log(`Corregibles:         ${aplicables}`);
console.log(`Revisar a mano:      ${manuales}`);
if (APPLY) console.log(`Archivos modificados: ${archivosModificados}`);

for (const d of detalles) {
  console.log(`\n· ${d.archivo}  #${d.indice}  [${d.tipo}]`);
  console.log(`  antes:  cantidad=${JSON.stringify(d.antes.cantidad)} unidad=${JSON.stringify(d.antes.unidad)} nombre=${JSON.stringify(d.antes.nombre)}`);
  if (d.despues) {
    console.log(`  ahora:  cantidad=${JSON.stringify(d.despues.cantidad)} unidad=${JSON.stringify(d.despues.unidad)} nombre=${JSON.stringify(d.despues.nombre)}`);
  } else {
    console.log(`  razón:  ${d.razon}`);
  }
}

if (!APPLY && aplicables > 0) {
  console.log(`\nPara aplicar: node scripts\\corregir-duplicados.mjs --apply`);
}