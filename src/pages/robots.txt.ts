// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://recetariochileno.netlify.app');
  // Astro Sitemap v3+ genera un índice principal llamado sitemap-index.xml
  const sitemapURL = new URL('/sitemap-index.xml', base).toString();

  const body = `# ==========================================
# ROBOTS.TXT - Recetario Chileno
# ==========================================

# 1. Reglas generales para todos los motores de búsqueda
User-agent: *
Allow: /

# 2. Ubicación del mapa del sitio
Sitemap: ${sitemapURL}

# 3. Permisos explícitos para rastreadores de Inteligencia Artificial
# Esto permite que ChatGPT, Claude y Perplexity citen tu sitio

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
