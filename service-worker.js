const CACHE_NAME = "student-hub-v1";

const urlsToCache = [
    "./",            // Changed to relative path for better compatibility
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

// INSTALL: Force the new service worker to become active immediately
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching assets...");
            return cache.addAll(urlsToCache);
        }).then(() => self.skipWaiting()) // Forces activation
    );
});

// ACTIVATE: Clean up old caches and take control of the page
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Takes control of open tabs immediately
    );
});

// FETCH: Cache-First with a Network Fallback + Error Catching
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((res) => {
            // Return cached resource, OR try to fetch from network
            return res || fetch(event.request).catch(() => {
                // Optional: If network fails and no cache, you could return an offline page here
                console.log("Resource not found in cache or network.");
            });
        })
    );
});
