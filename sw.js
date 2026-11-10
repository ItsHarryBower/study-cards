const C = 'vq-2026-11-10-1026';
const FILES = ['./', 'index.html', 'cards.enc.json', 'manifest.webmanifest', 'icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
// network first, so a new pack arrives whenever there is signal, the saved copy when there is none
self.addEventListener('fetch', e => { if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); if (r.ok) caches.open(C).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('index.html')))); });
