const V="nw-9dce9eca";
const CORE=["./","index.html","data/vocab.js?v=9dce9eca","data/levels.js?v=9dce9eca","data/grammar.js?v=9dce9eca","manifest.webmanifest"];
self.addEventListener("install",e=>{ self.skipWaiting(); e.waitUntil(caches.open(V).then(c=>c.addAll(CORE))); });
/* 只清理本游戏的旧缓存（同一个 github.io 域名下可能还有别的网站） */
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("nw-")&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
const put=(req,r)=>{ if(r&&r.ok){ const c=r.clone(); caches.open(V).then(x=>x.put(req,c)); } return r; };
self.addEventListener("fetch",e=>{ const req=e.request, u=new URL(req.url);
  if(req.method!=="GET"||u.origin!==location.origin) return;
  if(/\.mp3$/i.test(u.pathname)) return;   /* 音频交给浏览器：Safari 播放音频用分段请求，缓存整份文件反而会播不出来 */
  if(req.mode==="navigate"){ e.respondWith(fetch(req).then(r=>{ put("index.html",r); return r; }).catch(()=>caches.match("index.html"))); return; }
  /* 数据地址带构建号：先缓存后联网 */
  if(/\/data\//.test(u.pathname)){ e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>put(req,r)))); return; }
  /* 图片地址不带版本号（换画以后地址不变）：先用缓存，同时后台更新 */
  if(/\/(assets|media)\//.test(u.pathname)){ e.respondWith(caches.match(req).then(hit=>{ const f=fetch(req).then(r=>put(req,r)).catch(()=>hit); return hit||f; })); } });
