const CACHE_NAME = 'hr-rotations-cache-v18';
const urlsToCache = [
  './employees.js',
  './js/ui-clock.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap',
  'https://npmcdn.com/flatpickr/dist/themes/dark.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://cdn.jsdelivr.net/npm/flatpickr',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  // Network-first for HTML and local JS files
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
  if (url.includes('firestore.googleapis.com')) return;
  // Cache-first for CDN resources
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).then(res => {
            if(!res || res.status !== 200 || res.type !== 'basic') return res;
            var responseToCache = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
            return res;
        });
      })
  );
});
