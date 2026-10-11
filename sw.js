'use strict';

// IMPORTANT: Bump CACHE_NAME whenever app.js, style.css, or index.html changes
const CACHE_NAME = 'bachata-shell-v2';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
];

// INSTALL: pre-cache app shell
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE_URLS)));
  self.skipWaiting(); // Activate immediately, no waiting state
});

// ACTIVATE: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // Control all open tabs immediately
});

// FETCH: network-first for precached assets (fresh on every load, cache as offline fallback);
// bypass Supabase API calls entirely
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Let Supabase API calls go to network — app.js handles offline mutations via pendingOps queue
  if (new URL(event.request.url).hostname.endsWith('.supabase.co')) return;

  const isPrecached = PRECACHE_URLS.some(u => {
    if (u.startsWith('http')) return event.request.url === u;
    const path = new URL(event.request.url).pathname;
    return path === u || (u === '/' && path === '/index.html');
  });

  if (isPrecached) {
    event.respondWith(
      fetch(event.request.url, { cache: 'no-cache' })
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
