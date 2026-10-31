import fs from 'node:fs';
import path from 'node:path';

const carpeta = './src/content/recetas';
const archivos = fs.readdirSync(carpeta).filter(f => f.endsWith('.json'));

// Diccionario ampliado con las categorías que fallaron
const equivalencias = {
  'principales': ['principal', 'plato principal', 'platos de fondo', 'fondo', 'carnes', 'carne', 'pollo', 'aves', 'vacuno', 'cerdo', 'guisos', 'guiso', 'legumbres', 'pastas', 'hamburguesas', 'arroces', 'arroz'],
  'sopas': ['sopa', 'caldos', 'caldo'],
  'panes': ['pan', 'masas', 'masa', 'horneados', 'horneado', 'panaderia', 'panadería'],
  'ensaladas': ['ensalada', 'picoteo', 'salsas', 'salsa', 'acompañamientos', 'entradas', 'bocadillos', 'snacks'],
  'dulces': ['dulce', 'postres', 'postre', 'reposteria', 'repostería', 'tortas', 'galletas'],
  'bebidas': ['bebida', 'jugos', 'jugo', 'tragos', 'trago', 'alcohol', 'cocteles', 'cócteles'],
  'once': ['merienda', 'te', 'té', 'desayuno', 'huevos'],
  'sandwiches': ['sandwich', 'sándwich', 'sándwiches', 'completos'],
  'mar': ['marisco', 'mariscos', 'pescado', 'pescados', 'ceviche', 'cebiches'],
  'de-olla': ['de olla', 'deolla']
};

let corregidos = 0;
let noReconocidos = 0;

archivos.forEach(archivo => {
  const ruta = path.join(carpeta, archivo);
  const data = JSON.parse(fs.readFileSync(ruta, 'utf-8'));
  
  if (data.categoria) {
    let cat = data.categoria.toLowerCase().trim();
    const categoriasOficiales = ['principales', 'sopas', 'panes', 'ensaladas', 'dulces', 'bebidas', 'once', 'sandwiches', 'mar', 'de-olla'];
    
    if (!categoriasOficiales.includes(cat)) {
      let encontrado = false;
      
      for (const oficial in equivalencias) {
        if (equivalencias[oficial].includes(cat)) {
          data.categoria = oficial;
          encontrado = true;
          break;
        }
      }
      
      if (encontrado) {
        fs.writeFileSync(ruta, JSON.stringify(data, null, 2), 'utf-8');
        corregidos++;
      } else {
        console.log(`🤔 Sigue sin reconocer la categoría "${cat}" de: "${data.titulo}".`);
        noReconocidos++;
      }
    }
  }
});

console.log(`\n✅ ¡Proceso terminado!`);
console.log(`Se corrigieron automáticamente ${corregidos} recetas más.`);
if (noReconocidos > 0) {
  console.log(`Quedaron ${noReconocidos} recetas que debes revisar a mano.`);
} else {
  console.log(`¡Todas las recetas quedaron perfectamente etiquetadas!`);
}