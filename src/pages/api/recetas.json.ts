import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { formatearIngredienteEstructurado } from '../../lib/escalado.js';

export const GET: APIRoute = async () => {
  const recetas = await getCollection('recetas');

  const data = recetas.map((r) => {
    const { data } = r;
    
    // 🌟 Solo extraemos lo esencial para los listados, búsqueda y planificador.
    // Omitimos pasos_v2, pasos, errores, conservacion, tiempo_v2, etc.
    return {
      slug: r.id,
      titulo: data.titulo,
      categoria: data.categoria,
      tags: data.tags || [],
      imagen: data.imagen || null,
      tiempo: data.tiempo || null,
      porciones: data.porciones || null,
      dificultad: data.dificultad || null,
      tecnica: data.tecnica || null,
      dato: data.dato || null,
      
      // Mantenemos `ingredientes` (texto plano) para el buscador,
      // la despensa y el planificador.
      ingredientes: (data.ingredientes_v2 || []).map(formatearIngredienteEstructurado),
    };
  });

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};