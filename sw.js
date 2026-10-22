const CACHE_NAME = 'site-v1.0.0';
const ASSETS = ['/', '/index.html', '/style.css', '/script.js', '/manifest.json', '/llms.txt', '/SEO.md', '/Aeo.md'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => { if (k !== CACHE_NAME) return caches.delete(k); }))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request).then((nRes) => {
    if (nRes && nRes.status === 200) { const clone = nRes.clone(); caches.open(CACHE_NAME).then((c) => c.put(e.request, clone)); }
    return nRes;
  })));
});
