/* EPDM Calc service worker - offline app shell, network-first so updates land.
   GitHub sync calls are cross-origin and always go straight to the network. */
const CACHE = "epdmcalc-v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(u=> new Request(u, {cache:"reload"})))).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=> k===CACHE?null:caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e=>{
  const url = new URL(e.request.url);
  if(url.origin !== location.origin || e.request.method !== "GET") return;
  const isPage = e.request.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith(".html");
  const req = isPage ? new Request(e.request, { cache: "no-cache" }) : e.request;
  e.respondWith(
    fetch(req).then(res=>{
      const copy = res.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy));
      return res;
    }).catch(()=> caches.match(e.request).then(c=> c || caches.match("./")))
  );
});
