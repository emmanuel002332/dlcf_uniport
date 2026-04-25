const CACHE_NAME = 'U2025-v2';

const ASSETS = [
  './',
  './index.html',
  './offline.html',
  './style.css',
  './manifest.json',
  './1st.html',
  './2nd.html',
  './3rd.html',
  './4th.html',
  './5th.html',
  './6th.html',       // ✅ comma added
  './quiz.html',
  './study_resources.html',
  './bible_study.html',
  './contact.html',
  './course_outline.html',
  // ✅ Add your icon paths here
  // './icons/icon-192.png',
  // './icons/icon-512.png',
];

// Install: cache all critical assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

// Fetch: network-first for HTML, cache-first for everything else
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // HTML pages — try network first, fall back to cache, then offline.html
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(async (networkResponse) => {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          return caches.match('./offline.html'); // last resort
        })
    );
  } else {
    // CSS, JS, images — serve from cache, fetch if not cached
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => cachedResponse || fetch(request))
        .catch(() => {
          // ✅ Return empty response instead of offline.html for assets
          return new Response('', { status: 408, statusText: 'Offline' });
        })
    );
  }
});