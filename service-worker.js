const CACHE_NAME = 'rotations-v32';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo_v4.png',
  './js/ui-clock.js',
  './employees.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap',
  'https://npmcdn.com/flatpickr/dist/themes/dark.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/flatpickr',
  'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js',
  'https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore-compat.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  // Network-first for HTML and local JS files to ensure updates are immediate
  if (url.endsWith('.html') || url.endsWith('/') || (url.includes('/js/') && !url.includes('cdn'))) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        }
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }
  // Skip Firestore API calls
  if (url.includes('firestore.googleapis.com')) return;
  // Cache-first for external CDN resources
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).then(res => {
          if (!res || res.status !== 200 || res.type !== 'basic') return res;
          var responseToCache = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          return res;
        });
      }).catch(function() {})
  );
});

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
    }).then(() => self.clients.claim())
  );
});
