const K='dash-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(K).then(c=>c.addAll(['./','./index.html','./manifest.json'])));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==K).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(K).then(h=>h.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
