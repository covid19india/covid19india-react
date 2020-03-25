// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = ["offline.html"];

let CACHE_NAME = "INDIA COVID-19 TRACKER";

// Install a service worker
self.addEventListener("install", event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Cache and return requests
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.open(CACHE_NAME).then(cache => {
        return cache.match("offline.html");
      });
    })
  );
});

// Update a service worker
self.addEventListener("activate", event => {
  let cacheWhitelist = ["INDIA COVID-19 TRACKER"];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
