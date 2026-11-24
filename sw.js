const CACHE_NAME = 'cuenta-os9-v13';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './pwa-install.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/os9.png'
];

// Install event - caching the application shell
self.addEventListener('install', event => {
  self.skipWaiting(); // Activa el nuevo SW inmediatamente

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE)
          .catch(error => {
            console.error('Error al guardar en caché:', error);
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      ).then(() => self.clients.claim()); // Toma el control de la página inmediatamente
    })
  );
});

// Fetch event - network first, falling back to cache
self.addEventListener('fetch', event => {
  if (!(event.request.url.indexOf('http') === 0)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cachear respuestas válidas para uso offline
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Sin conexión: servir desde caché
        return caches.match(event.request);
      })
  );
});