const CACHE_NAME = "sovereign-cache-v1";
const OFFLINE_URL = "/offline";

const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable.png",
  "/apple-touch-icon.png",
  "/globals.css",
  "/icon.png"
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Warm up the cache with essential assets
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // We do not want to cache Supabase api calls or authentication endpoints
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/image") || url.hostname.includes("supabase")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Fetch from network
      const networkFetch = fetch(event.request)
        .then((response) => {
          // If valid response, clone and cache it for static assets
          if (response.status === 200 && (
            url.pathname.startsWith("/_next/static/") ||
            url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|woff2|css|js)$/)
          )) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch((error) => {
          // If we fail to load a navigation page, show the branded offline page
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
          throw error;
        });

      // Return cached response first (Cache First for static, Network First for HTML navigation)
      if (event.request.mode === "navigate") {
        // For HTML pages, we want Network First
        return networkFetch.catch(() => cachedResponse || caches.match(OFFLINE_URL));
      }

      return cachedResponse || networkFetch;
    })
  );
});

// Handle update triggers
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
