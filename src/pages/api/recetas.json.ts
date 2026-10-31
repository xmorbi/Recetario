import { getCollection } from 'astro:content';

export async function GET() {
  const recetasDB = await getCollection('recetas');
  const recetasLimpio = recetasDB.map(r => ({ ...r.data, slug: r.id }));

  return new Response(JSON.stringify(recetasLimpio), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}