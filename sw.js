/* مناحل شيخ الجبل: تخزين مؤقت محسّن للشبكات الضعيفة. يتطلب HTTPS. */
const CACHE_NAME = 'manahil-sheikh-jabal-v5';
const APP_SHELL = ['./','./index.html','./admin.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./logo-mg.jpg','./honey-products.webp','./honey-products.jpg'];
async function fetchWithTimeout(url, ms=5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try { return await fetch(url, {signal: controller.signal, cache:'reload'}); }
  finally { clearTimeout(timer); }
}
async function save(cache, key, response) {
  if (response && response.ok && response.type === 'basic') {
    try { await cache.put(key, response.clone()); } catch (_) {}
  }
}
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(async path => {
      try { await save(cache, path, await fetchWithTimeout(path, 7000)); } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('manahil-sheikh-jabal-') && k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await caches.match(req) || await caches.match('./index.html') || await caches.match('./');
      try {
        const response = await fetchWithTimeout(req, 2500);
        if (response && response.ok) { save(cache, req, response).catch(()=>{}); return response; }
      } catch (_) {}
      if (cached) return cached;
      return new Response('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>مناحل شيخ الجبل</title><body style="font-family:Tahoma,Arial;text-align:center;padding:24px"><h2>🐝 مناحل شيخ الجبل</h2><p>الشبكة ضعيفة ولم تُحفظ نسخة من الموقع بعد.</p><p>افتح الموقع مرة واحدة عند توفر الإنترنت ثم أعد المحاولة.</p><button onclick="location.reload()">إعادة المحاولة</button></body></html>', {headers:{'Content-Type':'text/html; charset=utf-8'}});
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const response = await fetchWithTimeout(req, 5000);
      if (response && response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE_NAME); save(cache, req, response).catch(()=>{});
      }
      return response;
    } catch (_) { return new Response('', {status:504, statusText:'Offline'}); }
  })());
});
