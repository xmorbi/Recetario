// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://recetario.morbidan.workers.dev/sitemap-index.xml');
  // Astro Sitemap v3+ genera un índice principal llamado sitemap-index.xml
  const sitemapURL = new URL('/sitemap-index.xml', base).toString();

  const body = `# ==========================================
# ROBOTS.TXT - Recetario Chileno
# ==========================================

# 1. Reglas generales para los motores de búsqueda clásicos (Google, Bing, etc.)
User-agent: *
Allow: /

# 2. Ubicación del mapa del sitio
Sitemap: ${sitemapURL}

# ==========================================
# 3. PERMITIR a los Buscadores de IA (Citación y Tráfico)
# ==========================================
# Estos bots leen tu sitio para responder en tiempo real y Citan la fuente.
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

# ==========================================
# 4. BLOQUEAR a los Entrenadores de IA (Protección de contenido)
# ==========================================
# Estos bots absorben tu contenido para entrenar sus modelos sin dar tráfico.
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: Applebot-Extended
Disallow: /
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};