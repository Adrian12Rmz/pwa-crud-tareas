const CACHE_NAME = 'pwa-crud-ultimate-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon.png'
];

// Instalación
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cacheando recursos esenciales');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de Fetch (Cache First, con fallback a network)
self.addEventListener('fetch', (e) => {
  // Excluir solicitudes de analytics o APIs externas
  if (e.request.url.includes('google-analytics')) return;
  
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // Devuelve la respuesta cacheada si existe
      if (cachedResponse) return cachedResponse;
      
      // Si no está en caché, haz la petición a red
      return fetch(e.request).then(response => {
        // Clona la respuesta para almacenarla en caché
        const responseToCache = response.clone();
        
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(e.request, responseToCache);
        });
        
        return response;
      }).catch(() => {
        // Fallback para pá
