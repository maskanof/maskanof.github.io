const staticCacheName = 's-app-v1';

const assertUrls = [
    'index.html',
    'app.js',
    'style.css'
];

self.addEventListener('install', async event => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(assertUrls);
});

self.addEventListener('activate', event => {
});

self.addEventListener('fetch', event => {
    console.log('Fetch', event.request.url);
    event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    return cached ?? await fetch(request);
}