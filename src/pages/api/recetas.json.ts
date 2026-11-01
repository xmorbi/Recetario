import { getCollection } from 'astro:content';

export async function GET() {
  const recetasDB = await getCollection('recetas');
  // MEJORA 6 (Fase 4): se eliminan pasos, errores y conservacion del JSON.
  // Ningún script cliente (app.js, nav.js, favoritos.js, planificador.astro)
  // los lee desde /api/recetas.json; modo-cocina.js y escalador.js los leen
  // de #receta-data incrustado en cada receta, no de aquí.
  // Peso estimado: 511 KB → ≈ 217 KB.
  const recetasLimpio = recetasDB.map(({ id, data }) => {
    const { pasos, errores, conservacion, ...liviano } = data;
    return {
      ...liviano,
      slug: id,
      imagen: data.imagen ? '/' + String(data.imagen).replace(/^\/+/, '') : null,
    };
  });

  return new Response(JSON.stringify(recetasLimpio), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}