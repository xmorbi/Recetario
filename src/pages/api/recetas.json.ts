import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const recetas = await getCollection('recetas');
  
  const data = recetas.map((r) => {
    // Renombramos con _ para que ESLint sepa que las ignoramos a propósito
    const { pasos: _pasos, errores: _errores, conservacion: _conservacion, ...rest } = r.data;
    return { 
      slug: r.id, 
      ...rest 
    };
  });

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};