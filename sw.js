/* My Apps launcher service worker — offline shell, network-first so updates land.
   Scoped narrowly: only handles the hub's own root-level files, never sub-app folders,
   so each app's own service worker stays in charge of its pages. */
const CACHE = "myapps-v6";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(u=> new Request(u, {cache:"reload"})))).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=> k===CACHE?null:caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e=>{
  const url = new URL(e.request.url);
  if(url.origin !== location.origin) return;      // never touch GitHub sync / cross-origin
  if(e.request.method !== "GET") return;
  const scopePath = new URL(self.registration.scope).pathname;  // e.g. "/apps/"
  if(!url.pathname.startsWith(scopePath)) return;
  const rest = url.pathname.slice(scopePath.length);            // "", "index.html", "ideapad/..."
  if(rest.indexOf("/") !== -1) return;            // sub-app folder -> leave it to that app's SW
  // Revalidate the page itself with the server. A plain fetch() still goes
  // through the browser's HTTP cache, and Pages sends max-age=600, so without
  // this the hub can keep serving a 10-minute-old tile list while online.
  // no-cache = conditional request: a 304 when nothing changed, so it's cheap.
  const isPage = e.request.mode === "navigate" || rest === "" || rest.endsWith(".html");
  const req = isPage ? new Request(e.request, { cache: "no-cache" }) : e.request;
  e.respondWith(
    fetch(req).then(res=>{
      const copy = res.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy));
      return res;
    }).catch(()=> caches.match(e.request).then(c=> c || caches.match("./")))
  );
});
