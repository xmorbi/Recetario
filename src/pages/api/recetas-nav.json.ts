import { getCollection } from 'astro:content';

// MEJORA 6 (Fase 4): endpoint mínimo para el autocompletado del menú.
// Antes, Layout.astro incrustaba ~26 KB de esta misma lista en las 310 páginas.
// Ahora se pide una sola vez al enfocar el buscador.
export async function GET() {
  const recetas = await getCollection('recetas');
  const nav = recetas.map((r) => ({
    titulo: r.data.titulo,
    slug: r.id,
    categoria: r.data.categoria,
  }));
  return new Response(JSON.stringify(nav), {
    headers: { 'Content-Type': 'application/json' },
  });
}