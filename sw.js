/* شبكة ضعيفة: عرض الصفحات المحفوظة بسرعة، وتحديثها من الشبكة عند توفرها.
   يتطلب HTTPS (أو localhost). أول زيارة تحتاج اتصالاً لتحميل الموقع وحفظه. */
const CACHE_NAME = 'manahil-sheikh-jabal-v4';
const APP_SHELL = [
  './', './index.html', './admin.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './logo-mg.jpg',
  './honey-products.png', './honey-products.jpg'
];
const TIMEOUT_MS = 2200;

async function cacheResponse(cache, key, response) {
  if (response && response.ok && response.type !== 'opaque') {
    try { await cache.put(key, response.clone()); } catch (_) {}
  }
}
async function networkWithTimeout(request, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try { return await fetch(request, { signal: controller.signal }); }
  finally { clearTimeout(timer); }
}
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(async path => {
      try {
        const response = await fetch(path, { cache: 'reload' });
        await cacheResponse(cache, path, response);
      } catch (_) {}
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
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // HTML: لا تنتظر الشبكة الضعيفة طويلاً؛ اعرض النسخة المحفوظة فور انتهاء المهلة.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await caches.match(request) || await caches.match('./index.html');
      try {
        const response = await networkWithTimeout(request);
        if (response && response.ok) {
          cacheResponse(cache, request, response).catch(() => {});
          return response;
        }
      } catch (_) {}
      if (cached) return cached;
      // محاولة أخيرة بدون مهلة إن لم تكن هناك نسخة مخزنة.
      try { return await fetch(request); }
      catch (_) { return new Response('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>مناحل شيخ الجبل</title><body style="font-family:Tahoma,Arial;text-align:center;padding:24px"><h2>🐝 مناحل شيخ الجبل</h2><p>الاتصال ضعيف ولا توجد نسخة محفوظة بعد.</p><p>افتح الموقع مرة واحدة عند توفر الإنترنت ثم أعد المحاولة.</p><button onclick="location.reload()">إعادة المحاولة</button></body></html>', {headers:{'Content-Type':'text/html; charset=utf-8'}});
      }
    })());
    return;
  }
  // الملفات الثابتة: الكاش أولاً لتحميل أسرع، ثم الشبكة عند عدم وجودها.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) {
      fetch(request).then(async response => {
        const cache = await caches.open(CACHE_NAME);
        await cacheResponse(cache, request, response);
      }).catch(() => {});
      return cached;
    }
    try {
      const response = await networkWithTimeout(request, 4000);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cacheResponse(cache, request, response).catch(() => {});
      }
      return response;
    } catch (_) {
      return new Response('', {status:504, statusText:'Offline'});
    }
  })());
});
