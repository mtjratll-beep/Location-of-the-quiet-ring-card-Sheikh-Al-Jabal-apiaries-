/* Offline shell for Manahil Sheikh Al-Jabal. Service workers require HTTPS (or localhost). */
const CACHE_NAME = 'manahil-sheikh-jabal-v2';
const APP_SHELL = [
  './', './index.html', './admin.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './logo-mg.jpg',
  './honey-products.png', './honey-products.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache assets individually so one optional missing file does not block installation.
    await Promise.all(APP_SHELL.map(async url => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) await cache.put(url, response);
      } catch (_) { /* an unavailable optional file will be fetched later */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('manahil-sheikh-jabal-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // For pages: use the network when possible, but fall back to the saved page offline.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      } catch (_) {
        return (await caches.match(request)) || (await caches.match('./index.html')) || new Response('التطبيق غير متاح دون اتصال. افتح الموقع مرة واحدة مع الإنترنت ثم أعد المحاولة.', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
    })());
    return;
  }

  // Static files are cache-first for faster loading on weak connections.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (_) {
      return new Response('', { status: 504, statusText: 'Offline' });
    }
  })());
});
