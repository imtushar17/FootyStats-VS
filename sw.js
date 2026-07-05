const CACHE_NAME = 'footystats-v10';
const FLAGS_CACHE_NAME = 'footystats-flags';
const FONTS_CACHE_NAME = 'footystats-fonts';
const PORTRAITS_CACHE_NAME = 'footystats-portraits';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './css/variables.css',
  './css/components.css',
  './css/selectors.css',
  './css/comparison.css',
  './css/tactics.css',
  './css/trophies.css',
  './css/arena.css',
  './icon.png',
  './assets/fifa_2026_poster.png',
  './src/app.js',
  './src/data/teams.js',
  './src/data/lineups.js',
  './src/components/theme.js',
  './src/components/selector.js',
  './src/components/comparison.js',
  './src/components/tactics.js',
  './src/components/trophies.js',
  './src/components/liveArena.js',
  './src/components/matchcentre/state.js',
  './src/components/matchcentre/utils.js',
  './src/components/matchcentre/api.js',
  './src/components/matchcentre/standings.js',
  './src/components/matchcentre/lineups.js',
  './src/components/matchcentre/popups.js',
  './src/components/matchcentre/explorer.js',
  './src/components/matchcentre/bracket.js',
  './src/components/matchcentre/console.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)),
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key !== FLAGS_CACHE_NAME && key !== FONTS_CACHE_NAME && key !== PORTRAITS_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Dynamic Cache-First strategy for Flag CDN SVG/PNG assets
  if (url.hostname === 'flagcdn.com') {
    e.respondWith(
      caches.open(FLAGS_CACHE_NAME).then(cache => {
        return cache.match(e.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(e.request).then(networkResponse => {
            if (networkResponse.status === 200) {
              cache.put(e.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return empty 404 response for offline flag image instead of a text string
            return new Response('', { status: 404, statusText: 'Offline' });
          });
        });
      })
    );
    return;
  }

  // Dynamic Cache-First strategy for Google Fonts (CSS & Font files)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(FONTS_CACHE_NAME).then(cache => {
        return cache.match(e.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(e.request).then(networkResponse => {
            if (networkResponse.status === 200) {
              cache.put(e.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            return new Response('', { status: 404, statusText: 'Offline' });
          });
        });
      })
    );
    return;
  }

  // Dynamic Cache-First strategy for Player Portraits (Local assets & legacy CDNs)
  if (url.pathname.includes('/assets/portraits/') || url.hostname === 'cdn.sofifa.net' || url.hostname === 'wsrv.nl' || url.hostname === 'images.weserv.nl' || url.hostname === 'api.sofascore.app' || url.hostname === 'api.sofascore.com' || url.hostname === 'www.sofascore.com') {
    e.respondWith(
      caches.open(PORTRAITS_CACHE_NAME).then(cache => {
        return cache.match(e.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(e.request).then(networkResponse => {
            if (networkResponse.status === 200) {
              cache.put(e.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            return new Response('', { status: 404, statusText: 'Offline' });
          });
        });
      })
    );
    return;
  }

  // Static Cache-First strategy with clean fallback
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).catch(() => {
        // Safe fallback handling for image elements vs other file types
        if (e.request.destination === 'image') {
          return new Response('', { status: 404, statusText: 'Offline' });
        }
        if (url.pathname.includes('/api/matches')) {
          return new Response(JSON.stringify({ error: 'Offline - data feed unavailable' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return new Response('Offline content - check internet connection.');
      });
    })
  );
});
