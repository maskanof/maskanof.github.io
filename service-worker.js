const staticCacheName = 's-app-v1';

const assetUrls = [
    'index.html'
];

// Install Event: Caches static assets
self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(staticCacheName)
            .then((cache) => cache.addAll(assetUrls))
    );
});

// Activate Event: Clears old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== staticCacheName)
                    .map((key) => caches.delete(key))
            );
        })
    );
});

// Fetch Event: Serves cached assets or fetches from network
self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst(event.request));
});

// Cache-first strategy
async function cacheFirst(request) {
    const cached = await caches.match(request);
    return cached || fetch(request);
}