// 1. Change this version number (e.g., to v2, v3) EVERY TIME you update your files on GitHub
const CACHE_NAME = 'srm-ls-cache-v2'; 
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Forces the new service worker to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 2. Add an activate event to delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Takes control of the clients immediately
});

// 3. Network-First strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If the network request succeeds, we return the fresh data
        return response;
      })
      .catch(() => {
        // If the network fails (e.g., user is offline), we fall back to the cache
        return caches.match(event.request);
      })
  );
});
