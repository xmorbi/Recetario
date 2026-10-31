import fs from 'node:fs';
import path from 'node:path';

const carpeta = './src/content/recetas';
const archivos = fs.readdirSync(carpeta).filter(f => f.endsWith('.json'));

// Las categorías oficiales de tu sitio
const categoriasValidas = ['principales', 'sopas', 'panes', 'ensaladas', 'dulces', 'bebidas', 'once', 'sandwiches', 'mar', 'de-olla'];

let reporte = "REPORTE DE CATEGORÍAS - RECETARIO CHILENO\n";
reporte += "========================================\n\n";

let errores = 0;
let grupos = {};

archivos.forEach(archivo => {
  const data = JSON.parse(fs.readFileSync(path.join(carpeta, archivo), 'utf-8'));
  const cat = data.categoria;
  const titulo = data.titulo;

  if (!categoriasValidas.includes(cat)) {
    reporte += `❌ ERROR: "${titulo}" tiene la categoría "${cat}" (no es válida).\n`;
    errores++;
  } else {
    if (!grupos[cat]) grupos[cat] = [];
    grupos[cat].push(titulo);
  }
});

// Agrupar por categoría para revisión visual
reporte += "\n\nRESUMEN POR CATEGORÍA:\n";
reporte += "---------------------\n";
for (const cat in grupos) {
  reporte += `\n📌 ${cat.toUpperCase()} (${grupos[cat].length} recetas):\n`;
  grupos[cat].forEach(t => reporte += `   - ${t}\n`);
}

fs.writeFileSync('reporte-categorias.txt', reporte);
console.log(`\n✅ Revisión terminada.`);
console.log(`Se encontraron ${errores} errores de categoría.`);
console.log(`Revisa el archivo 'reporte-categorias.txt' para ver el detalle.`);