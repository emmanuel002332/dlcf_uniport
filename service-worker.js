const CACHE_NAME = 'U2025-v1';  // ← Increment version to force update
const ASSETS = [
  './',
  './index.html',
  './contact.html',      // ← new offline fallback
  './style.css',
  './manifest.json',
  './bible_study.html',
  './study_resources.html',
  './quiz.html',
  './offline.html',
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
  self.clients.claim(); // Take control of all open pages immediately
});

// Fetch: network-first for HTML, cache-first for everything else
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // For HTML pages (including navigations) – try network, fallback to cache, then offline.html
  if (request.mode === 'navigate' || (request.destination === 'document')) {
    event.respondWith(
      fetch(request)
        .then(async (networkResponse) => {
          // Cache the fresh HTML for offline use
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        })
        .catch(async () => {
          // Network failed – try cache
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          // No cache – show offline page
          return caches.match('./offline.html');
        })
    );
  } else {
    // For images, CSS, JS, etc. – cache-first (fast, works offline)
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => cachedResponse || fetch(request))
        .catch(() => caches.match('./offline.html')) // fallback for assets
    );
  }
});
