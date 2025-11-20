const CACHE = "skola-stinu-v1";
const ASSETS = [
  "./",
  "index.html",
  "SKOLA STINU VERIFY.html",
  "SKOLA STINU REGISTER.html",
  "welcome.html",
  "SKOLA STINU PLAYER.html",
  "admin.html",
  "assets/style.css",
  "assets/app.js",
  "assets/canvas.js",
  "dragon.png",
  "dragon-512.png",
  "manifest.json"
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k!==CACHE) ? caches.delete(k) : null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method !== 'GET'){ return; }
  e.respondWith(
    caches.match(req).then(cached => {
      if(cached) return cached;
      return fetch(req).then(resp => {
        if(req.url.startsWith(self.location.origin)){
          const cloned = resp.clone();
          caches.open(CACHE).then(c=>c.put(req, cloned));
        }
        return resp;
      }).catch(()=> caches.match('SKOLA STINU REGISTER.html'));
    })
  );
});
