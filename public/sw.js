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

   FASE 8 (8.6):
   - VERSION v3 → v4 (forzar refresco del CSS de 8.1–8.5).
   - CACHE_RECETAS ahora es estable entre versiones (sin sufijo -vN),
     con migración desde recetas-guardadas-v3 arrastrando los assets
     referenciados (_astro/*, /img/*, /fonts/*) desde static-v3.
   - Al instalar se precachean los _astro/* referenciados por la home
     para que la app abra offline con estilos.
   - CORE_ASSETS incluye /favicon.svg.
   ================================================================= */

const VERSION = 'v7';
const CACHE_CORE = `core-${VERSION}`;
const CACHE_STATIC = `static-${VERSION}`;
const CACHE_RECETAS = 'recetas-guardadas';
const CACHE_RECETAS_LEGACY = ['recetas-guardadas-v3'];

const CORE_ASSETS = ['/', '/offline/', '/manifest.webmanifest', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_CORE);
      await cache.addAll(CORE_ASSETS);
      await precachearAssetsHome();
    })()
  );
  // Sin skipWaiting automático.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await migrarRecetasLegacy();

      const keys = await caches.keys();
      const validas = [CACHE_CORE, CACHE_STATIC, CACHE_RECETAS];
      await Promise.all(keys.filter((k) => !validas.includes(k)).map((k) => caches.delete(k)));

      await self.clients.claim();
    })()
  );
});

/* Migra las recetas guardadas en versiones anteriores a CACHE_RECETAS
   (nombre estable). Arrastra los assets referenciados (_astro/*, /img/*,
   /fonts/*) desde el static-<versionLegacy> al static actual, para que
   la receta migrada siga teniendo estilos offline. */
async function migrarRecetasLegacy() {
  const target = await caches.open(CACHE_RECETAS);

  for (const legacyName of CACHE_RECETAS_LEGACY) {
    if (!(await caches.has(legacyName))) continue;

    const legacy = await caches.open(legacyName);

    // Intentar abrir el cache estático de la misma versión legacy
    // (ej. 'recetas-guardadas-v3' → 'static-v3').
    const versionMatch = legacyName.match(/-([^-]+)$/);
    const legacyVersion = versionMatch ? versionMatch[1] : null;
    const statLegacy =
      legacyVersion && (await caches.has(`static-${legacyVersion}`))
        ? await caches.open(`static-${legacyVersion}`)
        : null;
    const statTarget = await caches.open(CACHE_STATIC);

    const keys = await legacy.keys();
    for (const req of keys) {
      const res = await legacy.match(req);
      if (!res) continue;

      // Copia el HTML (o asset) al cache estable.
      await target.put(req, res.clone());

      if (!statLegacy) continue;

      // Extrae los assets referenciados en el HTML y los migra.
      try {
        const html = await res.text();
        const re = /(?:href|src)="(\/(?:_astro|img|fonts)\/[^"]+)"/g;
        const assets = new Set();
        let m;
        while ((m = re.exec(html)) !== null) assets.add(m[1]);

        for (const a of assets) {
          if (await statTarget.match(a)) continue;
          const assetRes = await statLegacy.match(a);
          if (assetRes) await statTarget.put(a, assetRes);
        }
      } catch (e) {
        /* HTML no parseable: seguimos con la siguiente */
      }
    }

    await caches.delete(legacyName);
  }
}

/* Precachea los assets _astro/* referenciados por la home al instalar.
   Sin esto, la primera apertura offline de la PWA vería la home sin CSS. */
async function precachearAssetsHome() {
  try {
    const core = await caches.open(CACHE_CORE);
    const resp = await core.match('/');
    if (!resp) return;
    const html = await resp.text();

    const re = /(?:href|src)="(\/_astro\/[^"]+)"/g;
    const urls = new Set();
    let m;
    while ((m = re.exec(html)) !== null) urls.add(m[1]);
    if (urls.size === 0) return;

    const stat = await caches.open(CACHE_STATIC);
    await Promise.all(
      [...urls].map((u) =>
        stat.match(u).then((c) =>
          c
            ? null
            : fetch(u)
                .then((r) => (r.ok ? stat.put(u, r) : null))
                .catch(() => null)
        )
      )
    );
  } catch (e) {
    /* si algo falla, seguimos: se cacheará por navegación */
  }
}

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

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (esNavegacion(request)) {
    event.respondWith(navegacionRedPrimero(request));
    return;
  }
  if (esAssetEstatico(url)) {
    event.respondWith(cachePrimero(request, CACHE_STATIC));
    return;
  }
  if (esApiJson(url)) {
    event.respondWith(staleWhileRevalidate(request, CACHE_STATIC));
    return;
  }
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
      red
        .then((r) => {
          if (r && r.ok) cache.put(request, r.clone());
        })
        .catch(() => {});
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
  } catch (e) {
    return new Response('', { status: 504 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const red = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
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

    event.waitUntil(
      (async () => {
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
      })()
    );
  }

  // FASE 9: notificación disparada desde la página (opcional).
  if (data.type === 'TIMER_FIN') {
    event.waitUntil(
      self.registration.showNotification(data.title || 'Se acabó el tiempo', {
        body: data.body || '',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: data.tag || 'mc-timer',
        requireInteraction: true,
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
