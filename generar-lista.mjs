import fs from 'node:fs';
import path from 'node:path';

const carpeta = './src/content/recetas';
const archivos = fs.readdirSync(carpeta).filter(f => f.endsWith('.json'));

let texto = "LISTADO DE RECETAS - RECETARIO CHILENO\n";
texto += "=======================================\n\n";

// Ordenamos alfabéticamente por nombre de archivo
archivos.sort();

archivos.forEach(archivo => {
  const data = JSON.parse(fs.readFileSync(path.join(carpeta, archivo), 'utf-8'));
  texto += `- ${data.titulo} [Categoría: ${data.categoria}]\n`;
});

fs.writeFileSync('lista-recetas.txt', texto);
console.log(`¡Listo! Se creó el archivo lista-recetas.txt con ${archivos.length} recetas.`);