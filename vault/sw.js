/* Vault service worker - offline app shell, network-first so updates land. */
const CACHE = "vault-v8";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=> k===CACHE?null:caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e=>{
  const url = new URL(e.request.url);
  if(url.origin !== location.origin) return;        // never touch GitHub sync / cross-origin
  if(e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res=>{
      const copy = res.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy));
      return res;
    }).catch(()=> caches.match(e.request).then(c=> c || caches.match("./")))
  );
});
