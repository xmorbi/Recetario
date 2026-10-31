import { getCollection } from 'astro:content';

export async function GET() {
  const recetasDB = await getCollection('recetas');
  const recetasLimpio = recetasDB.map(r => ({
    ...r.data,
    slug: r.id,
    imagen: r.data.imagen ? '/' + String(r.data.imagen).replace(/^\/+/, '') : null,
  }));

  return new Response(JSON.stringify(recetasLimpio), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}