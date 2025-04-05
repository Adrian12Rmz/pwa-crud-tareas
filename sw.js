const CACHE_NAME = 'pwa-crud-v4';
const ASSETS = [
  '/pwa-crud-tareas/',
  '/pwa-crud-tareas/index.html',
  '/pwa-crud-tareas/style.css',
  '/pwa-crud-tareas/app.js',
  '/pwa-crud-tareas/manifest.json',
  '/pwa-crud-tareas/icon.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(res => res || fetch(e.request))
});
