const FILES_TO_CACHE = [
    "/",
    "/index.html",
    '/favicon.ico',
    "/js/index.js",
    "/js/indexedDB.js",
    "/js/chart.js",
    "/db.js",
    "manifest.webmanifest",
    "service-worker.js",
    "/css/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";


self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
           console.log("YOur files were pre-caches successfully!");
           return cache.addAll(FILES_TO_CACHE);
    })
);
self.skipWaiting();
});

self.addEventListener("activate", function(event){
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all( 
                KeyList.map(key =>{
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME){
                        Console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.ClientRectList.claim();
});


self.addEventListener("fetch", function(event){
    if (event.request.url.includes("/")) {
        event.respondWith(
          caches.open(DATA_CACHE_NAME).then(cache => {
            return fetch(evt.request)
              .then(response => {
                // If the response was good, clone it and store it in the cache.
                if (response.status === 200) {
                  cache.put(evt.request.url, response.clone());
                }
    
                return response;
              })
              .catch(err => {
                // Network request failed, try to get it from the cache.
                return cache.match(event.request);
              });
          }).catch(err => console.log(err))
        );
    
        return;
      }
    
      
      event.respondWith(
        caches.match(evt.request).then(function(response) {
          return response || fetch(evt.request);
        })
      );
    });
    
