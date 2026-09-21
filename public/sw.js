// public/sw.js
// Minimal service worker — this file needs to exist purely to satisfy
// browsers' PWA installability check (a registered SW with a fetch
// handler is required for the "Install app" prompt to fire). This also
// gives you basic offline caching of visited pages as a side effect.

const CACHE_NAME = 'bill-splitter-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // Cache successful GET responses for offline reuse.
          if (event.request.method === 'GET' && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached); // offline and not cached — nothing to serve
    })
  );
});