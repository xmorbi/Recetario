/* =================================================================
   SW.JS — Service Worker del Recetario Chileno (Fase 8 + 9 + Bloque 1)
   Sin dependencias.
   - Navegación HTML: red primero (3 s SOLO si hay copia en caché)
     → caché → /offline/
   - Redirecciones (opaqueredirect) se devuelven tal cual al navegador.
   - /_astro/*, /img/*, /fonts/*: caché primero
   - /api/*.json: stale-while-revalidate
   - Mensaje CACHE_RECIPE: guarda página + imagen + recursos enviados
     por la página (performance.getEntriesByType('resource')).
     Responde CACHE_RECIPE_DONE al cliente que lo pidió.
   - FASE 9: notificationclick enfoca la pestaña; TIMER_FIN (opcional)
   No se usa skipWaiting: la actualización espera al siguiente arranque.
   ================================================================= */

const VERSION = 'v2';
const CACHE_CORE = `core-${VERSION}`;
const CACHE_STATIC = `static-${VERSION}`;
const CACHE_RECETAS = `recetas-guardadas-${VERSION}`;

const CORE_ASSETS = ['/', '/offline/', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_CORE).then((cache) => cache.addAll(CORE_ASSETS)));
  // Sin skipWaiting automático.
});

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
  event.waitUntil(self.clients.claim());
});

function esNavegacion(request) {
  return request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html');
}
function esAssetEstatico(url) {
  return url.pathname.startsWith('/_astro/') ||
         url.pathname.startsWith('/img/') ||
         url.pathname.startsWith('/fonts/');
}
function esApiJson(url) {
  return url.pathname.startsWith('/api/') && url.pathname.endsWith('.json');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (esNavegacion(request)) { event.respondWith(navegacionRedPrimero(request)); return; }
  if (esAssetEstatico(url)) { event.respondWith(cachePrimero(request, CACHE_STATIC)); return; }
  if (esApiJson(url)) { event.respondWith(staleWhileRevalidate(request, CACHE_STATIC)); return; }
});

async function navegacionRedPrimero(request) {
  const cache = await caches.open(CACHE_CORE);
  const recetasCache = await caches.open(CACHE_RECETAS);

  // Buscar copia en caché (core primero, luego recetas guardadas).
  const cachedCore = await cache.match(request);
  const cachedReceta = cachedCore ? null : await recetasCache.match(request);
  const cached = cachedCore || cachedReceta;

  const red = fetch(request);

  let response = null;

  if (cached) {
    // Con copia en caché: máximo 3 s esperando la red.
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3000)
      );
      response = await Promise.race([red, timeout]);
    } catch (e) {
      // Timeout: devolver caché ya; refrescar copia cuando llegue la red.
      red.then((r) => { if (r && r.ok) cache.put(request, r.clone()); }).catch(() => {});
      return cached;
    }
  } else {
    // Sin copia en caché: esperar la red sin límite artificial.
    try {
      response = await red;
    } catch (e) {
      response = null;
    }
  }

  // Redirección (las navegaciones usan redirect:'manual'):
  // devolverla tal cual para que el navegador la resuelva.
  if (response && response.type === 'opaqueredirect') {
    return response;
  }

  if (response && response.ok) {
    cache.put(request, response.clone());
    return response;
  }

  if (cached) return cached;

  const offline = await cache.match('/offline/');
  return offline || new Response('Sin conexión', { status: 503 });
}

async function cachePrimero(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (e) { return new Response('', { status: 504 }); }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const red = fetch(request)
    .then((response) => { if (response.ok) cache.put(request, response.clone()); return response; })
    .catch(() => null);
  return cached || red || new Response('{}', { headers: { 'Content-Type': 'application/json' } });
}

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === 'CACHE_RECIPE') {
    const { url, imageUrl, resources } = data;
    if (!url) return;
    const source = event.source;

    event.waitUntil((async () => {
      const cache = await caches.open(CACHE_RECETAS);

      // Construir el conjunto de URLs a cachear.
      const urls = new Set();
      urls.add(url);
      if (imageUrl) urls.add(imageUrl);
      if (Array.isArray(resources)) {
        for (const r of resources) {
          if (typeof r === 'string' && r) urls.add(r);
        }
      }

      let ok = 0;
      let fail = 0;
      for (const u of urls) {
        try {
          const res = await fetch(u, { credentials: 'same-origin' });
          if (res.ok) {
            await cache.put(u, res);
            ok++;
          } else {
            fail++;
          }
        } catch (e) {
          fail++;
        }
      }

      // Confirmar al cliente que pidió el guardado.
      if (source && typeof source.postMessage === 'function') {
        source.postMessage({ type: 'CACHE_RECIPE_DONE', url, ok, fail });
      }
    })());
  }

  // FASE 9: notificación disparada desde la página (opcional).
  if (data.type === 'TIMER_FIN') {
    event.waitUntil(
      self.registration.showNotification(data.title || 'Se acabó el tiempo', {
        body: data.body || '',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: data.tag || 'mc-timer',
        requireInteraction: true
      })
    );
  }
});

// FASE 9: al tocar la notificación, enfocar la pestaña (o abrir una nueva)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});