var dataCacheName = "iudigital-v1";
var cacheName = 'iudigital';

var filesToCache = [
  './',
  './index.html',
  './manifest.json',
  './js/app.js',
  './css/css.css',
  './css/bootstrap-material-design.min.css',
  './js/jquery-3.2.1.slim.min.js',
  './js/popper.js',
  './js/bootstrap-material-design.js',
  './iu_digital_case_study_logo.webp'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Estrategia Cache First
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      // Si el archivo está en caché, lo entrega directo sin ir a la red
      if (response) {
        return response;
      }
      // Si no está en caché, intenta descargarlo de la red
      return fetch(e.request);
    })
  );
});