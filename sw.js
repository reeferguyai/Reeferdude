const CACHE_VERSION = 'site-v1.2.0';
const CACHE_NAME = `reeferdude-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/llms.txt',
  '/SEO.md',
  '/Aeo.md'
];

const OFFLINE_HTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#07111a" />
    <title>ReeferDude | Offline</title>
    <style>
      :root {
        --bg: #07111a;
        --bg-2: #0b1723;
        --panel: rgba(16, 29, 43, 0.96);
        --panel-strong: rgba(11, 22, 31, 0.98);
        --primary: #00c853;
        --secondary: #7c3aed;
        --accent: #00f5a0;
        --text: #edfdf5;
        --muted: #9db8b5;
        --glow: rgba(0, 200, 83, 0.22);
        --purple-glow: rgba(124, 58, 237, 0.22);
      }

      * { box-sizing: border-box; }

      html, body {
        margin: 0;
        min-height: 100%;
        height: 100%;
      }

      body {
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at top, rgba(124, 58, 237, 0.18), transparent 30%),
          radial-gradient(circle at bottom right, rgba(0, 200, 83, 0.18), transparent 25%),
          linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 100%);
        color: var(--text);
        font-family: Arial, Helvetica, sans-serif;
        padding: 24px;
        overflow: hidden;
      }

      .card {
        position: relative;
        width: min(620px, 100%);
        background: var(--panel);
        border: 1px solid rgba(0, 200, 83, 0.35);
        border-radius: 22px;
        padding: 38px 30px;
        box-shadow:
          0 0 0 1px rgba(124, 58, 237, 0.12),
          0 18px 40px rgba(5, 10, 18, 0.8),
          0 0 50px rgba(0, 200, 83, 0.08),
          0 0 80px rgba(124, 58, 237, 0.1);
        text-align: center;
        backdrop-filter: blur(10px);
      }

      .card::before {
        content: "";
        position: absolute;
        inset: 12px;
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0.04);
        pointer-events: none;
      }

      .brand {
        margin: 0 0 10px;
        font-size: clamp(2.1rem, 5vw, 3.5rem);
        letter-spacing: 0.06em;
        color: var(--accent);
        text-shadow: 0 0 18px rgba(0, 245, 160, 0.45);
      }

      .status {
        display: inline-block;
        margin: 22px 0 14px;
        padding: 9px 14px;
        border-radius: 999px;
        background: rgba(124, 58, 237, 0.12);
        border: 1px solid rgba(124, 58, 237, 0.46);
        color: #e1d0ff;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 0.78rem;
      }

      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.75;
        font-size: 1.02rem;
      }

      .meta {
        margin-top: 18px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(0, 200, 83, 0.08);
        border: 1px solid rgba(0, 200, 83, 0.22);
        color: #c8fce4;
        font-size: 0.82rem;
        letter-spacing: 0.04em;
      }

      .pill.alt {
        background: rgba(124, 58, 237, 0.08);
        border-color: rgba(124, 58, 237, 0.24);
        color: #dcc7ff;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1 class="brand">🌿 ReeferDude</h1>
      <div class="status">Offline Mode Active</div>
      <p>
        You are currently offline, but the site has been cached and remains available for basic browsing and access to previously loaded content.
      </p>
      <div class="meta">
        <span class="pill">Offline Ready</span>
        <span class="pill alt">Signal Restored</span>
      </div>
    </div>
  </body>
</html>
`;

const isNavigationRequest = (request) =>
  request.mode === 'navigate' || request.destination === 'document';

const isSameOrigin = (url) => {
  try {
    return self.location.origin === new URL(url).origin;
  } catch {
    return false;
  }
};

const shouldCacheResponse = (response) =>
  response &&
  response.status === 200 &&
  response.type !== 'opaque';

const addToCache = async (cacheName, request, response) => {
  if (!shouldCacheResponse(response)) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
};

const getCachedResponse = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  return null;
};

const getOfflineFallback = async (request) => {
  const cachedPage = await caches.match('/index.html');
  if (cachedPage) return cachedPage;

  return new Response(OFFLINE_HTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
};

const staleWhileRevalidate = async (event) => {
  const { request } = event;
  const cached = await getCachedResponse(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (shouldCacheResponse(response)) {
        addToCache(CACHE_NAME, request, response);
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
};

const networkFirstWithFallback = async (event) => {
  const { request } = event;

  try {
    const response = await fetch(request);

    if (shouldCacheResponse(response)) {
      addToCache(CACHE_NAME, request, response);
    }

    return response;
  } catch (error) {
    const cached = await getCachedResponse(request);
    if (cached) return cached;

    if (request.mode === 'navigate') {
      return getOfflineFallback(request);
    }

    return Response.error();
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
            return null;
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;
  if (!request.url.startsWith('http')) return;

  // Navigation requests: prefer fresh network, fallback to cache or offline page
  if (isNavigationRequest(request)) {
    event.respondWith(networkFirstWithFallback(event));
    return;
  }

  // Same-origin assets: stale while revalidate
  if (isSameOrigin(request.url)) {
    event.respondWith(staleWhileRevalidate(event));
    return;
  }

  // Cross-origin/fallback for external requests
  event.respondWith(
    getCachedResponse(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (shouldCacheResponse(response)) {
            addToCache(CACHE_NAME, request, response);
          }
          return response;
        })
        .catch(() => Response.error());
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
