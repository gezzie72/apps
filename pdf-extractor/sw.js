/* PDF Extractor service worker - offline app shell, network-first so updates land.
   The reading libraries (pdf.js, JSZip, Tesseract) come from CDNs at pinned versions;
   they are kept in this cache too so the app still opens files when offline. */
const CACHE = "pdf-extractor-v2";
const PREFIX = "pdf-extractor-";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
const CDN = /^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/;

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(u=> new Request(u, {cache:"reload"})))).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  // Only clear this app's own older caches; other apps on this site keep theirs.
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=> (k.startsWith(PREFIX) && k!==CACHE) ? caches.delete(k) : null))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e=>{
  if(e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if(url.origin === location.origin){
    e.respondWith(
      fetch(e.request).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(e.request, copy));
        return res;
      }).catch(()=> caches.match(e.request).then(c=> c || caches.match("./")))
    );
    return;
  }
  if(!CDN.test(url.origin)) return;
  // Library files: answer from the cache straight away, refresh it in the background.
  e.respondWith(caches.open(CACHE).then(c=> c.match(e.request).then(hit=>{
    const net = fetch(e.request).then(res=>{ if(res.ok) c.put(e.request, res.clone()); return res; });
    if(hit){ net.catch(()=>{}); return hit; }
    return net;
  })));
});
