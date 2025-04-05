const CACHE_NAME = 'pwa-crud-final-v3';
const ASSETS = [
  '/pwa-crud-tareas/',
  '/pwa-crud-tareas/index.html',
  '/pwa-crud-tareas/style.css',
  '/pwa-crud-tareas/app.js',
  '/pwa-crud-tareas/manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
});
