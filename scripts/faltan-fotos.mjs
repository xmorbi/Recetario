#!/usr/bin/env node
/**
 * scripts/faltan-fotos.mjs
 * Lista las recetas que NO tienen foto asignada o cuya foto no existe en disco.
 *
 * Uso:
 *   node scripts\faltan-fotos.mjs                   # solo lista
 *   node scripts\faltan-fotos.mjs --excel           # exporta CSV
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const DIR_RECETAS = path.join(ROOT, 'src', 'content', 'recetas');
const DIR_PUBLIC = path.join(ROOT, 'public');

const exportarCSV = process.argv.includes('--excel');

const archivos = (await fs.readdir(DIR_RECETAS)).filter(f => f.endsWith('.json'));

const sinImagen = [];        // JSON con imagen: null o ""
const imagenRota = [];       // JSON tiene imagen pero el archivo no existe
const conImagen = [];

for (const archivo of archivos) {
  const ruta = path.join(DIR_RECETAS, archivo);
  const receta = JSON.parse(await fs.readFile(ruta, 'utf-8'));
  const img = receta.imagen;

  if (!img) {
    sinImagen.push({ archivo, titulo: receta.titulo, imagen: null });
    continue;
  }

  const rutaFoto = path.join(DIR_PUBLIC, img);
  try {
    await fs.access(rutaFoto);
    conImagen.push({ archivo, titulo: receta.titulo, imagen: img });
  } catch {
    imagenRota.push({ archivo, titulo: receta.titulo, imagen: img });
  }
}

console.log(`\n📸 Estado de fotos del recetario\n`);
console.log(`   Total recetas:        ${archivos.length}`);
console.log(`   ✅ Con foto OK:       ${conImagen.length}`);
console.log(`   ❌ Sin foto (null):   ${sinImagen.length}`);
console.log(`   ⚠️  Foto rota:         ${imagenRota.length}`);
console.log('');

if (sinImagen.length > 0) {
  console.log(`📋 Recetas SIN foto (${sinImagen.length}):`);
  sinImagen.forEach(r => console.log(`   • ${r.archivo}`));
  console.log('');
}

if (imagenRota.length > 0) {
  console.log(`⚠️  Recetas con FOTO ROTA (${imagenRota.length}):`);
  imagenRota.forEach(r => console.log(`   • ${r.archivo} → "${r.imagen}" no existe en public/`));
  console.log('');
}

if (exportarCSV) {
  const csv = [
    'archivo,titulo,imagen,estado',
    ...sinImagen.map(r => `"${r.archivo}","${r.titulo}","","SIN_FOTO"`),
    ...imagenRota.map(r => `"${r.archivo}","${r.titulo}","${r.imagen}","FOTO_ROTA"`),
  ].join('\n');
  const salida = path.join(ROOT, 'faltan-fotos.csv');
  await fs.writeFile(salida, csv, 'utf-8');
  console.log(`📝 CSV exportado a: ${salida}`);
}