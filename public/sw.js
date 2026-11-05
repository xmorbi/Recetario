/* =================================================================
   SW.JS — Service Worker del Recetario Chileno (Fase 8)
   Sin dependencias. Estrategias según el plan:
   - Navegación HTML: red primero (3 s) → caché → /offline/
   - /_astro/*, /img/*, /fonts/*: caché primero
   - /api/*.json: stale-while-revalidate
   - Mensaje CACHE_RECIPE: guarda página + imagen en recetas-guardadas-v1
   No se usa skipWaiting: la actualización espera al siguiente arranque.
   ================================================================= */

const VERSION = 'v1';
const CACHE_CORE = `core-${VERSION}`;
const CACHE_STATIC = `static-${VERSION}`;
const CACHE_RECETAS = `recetas-guardadas-${VERSION}`;

const CORE_ASSETS = [
  '/',
  '/offline/',
  '/manifest.webmanifest'
];

// ---------- Instalación ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_CORE).then((cache) => cache.addAll(CORE_ASSETS))
  );
  // Sin skipWaiting automático: la nueva versión espera.
});

// ---------- Activación ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![CACHE_CORE, CACHE_STATIC, CACHE_RECETAS].includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  // Toma el control de las pestañas abiertas solo en la activación.
  event.waitUntil(self.clients.claim());
});

// ---------- Helpers ----------
function esNavegacion(request) {
  return request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html');
}

function esAssetEstatico(url) {
  return (
    url.pathname.startsWith('/_astro/') ||
    url.pathname.startsWith('/img/') ||
    url.pathname.startsWith('/fonts/')
  );
}

function esApiJson(url) {
  return url.pathname.startsWith('/api/') && url.pathname.endsWith('.json');
}

// ---------- Fetch ----------
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo same-origin
  if (url.origin !== self.location.origin) return;

  // 1. Navegación HTML: red primero con timeout de 3 s
  if (esNavegacion(request)) {
    event.respondWith(navegacionRedPrimero(request));
    return;
  }

  // 2. Assets estáticos con hash o inmutables: caché primero
  if (esAssetEstatico(url)) {
    event.respondWith(cachePrimero(request, CACHE_STATIC));
    return;
  }

  // 3. API JSON: stale-while-revalidate
  if (esApiJson(url)) {
    event.respondWith(staleWhileRevalidate(request, CACHE_STATIC));
    return;
  }
});

async function navegacionRedPrimero(request) {
  const cache = await caches.open(CACHE_CORE);

  try {
    const red = fetch(request);
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 3000)
    );
    const response = await Promise.race([red, timeout]);

    if (response && response.ok) {
      const copia = response.clone();
      cache.put(request, copia);
      return response;
    }
  } catch (e) {
    // Red falló o timeout
  }

  const cached = await cache.match(request);
  if (cached) return cached;

  // Si es una receta guardada, buscarla en su caché específica
  const recetasCache = await caches.open(CACHE_RECETAS);
  const recetaGuardada = await recetasCache.match(request);
  if (recetaGuardada) return recetaGuardada;

  // Fallback final: página offline
  const offline = await cache.match('/offline/');
  return offline || new Response('Sin conexión', { status: 503 });
}

async function cachePrimero(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const copia = response.clone();
      cache.put(request, copia);
    }
    return response;
  } catch (e) {
    return new Response('', { status: 504 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const red = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || red || new Response('{}', { headers: { 'Content-Type': 'application/json' } });
}

// ---------- Mensajes desde la página ----------
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'CACHE_RECIPE') return;

  const { url, imageUrl } = data;
  if (!url) return;

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_RECETAS);
      try {
        const pageRes = await fetch(url);
        if (pageRes.ok) await cache.put(url, pageRes);

        if (imageUrl) {
          const imgRes = await fetch(imageUrl);
          if (imgRes.ok) await cache.put(imageUrl, imgRes);
        }
      } catch (e) {
        // Sin red en este momento; se puede reintentar luego.
      }
    })()
  );
});