const CACHE_NAME = "bookspot-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/favorites.html",
  "/app.js",
  "/style.css",
  "/manifest.json",
  "/icons/72.png",
  "/icons/80.png",
  "/icons/128.png",
  "/icons/152.png",
  "/icons/180.png",
  "/icons/196.png",
  "/icons/512.png",
];

// Instalação do Service Worker e cache dos arquivos essenciais
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      );
    })
  );
});

// Intercepta requisições e serve arquivos do cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
