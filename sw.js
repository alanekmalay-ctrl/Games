/* HSHYAR OFFICE · Games — app worker */
var V="hshyar-games-v3";
var CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","favicon.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V&&k!==V+"-img"}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET")return;
  var u=new URL(r.url);
  /* لاپەڕێ سایتی: پێشی ژ ئینتەرنێتێ (دا هەر جار یا نوی بیت)، ئەگەر نەبوو ژ پاراستی */
  if(r.mode==="navigate"||(u.origin===location.origin&&/\/(index\.html)?$/.test(u.pathname))){
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put("index.html",cp)});return res})
      .catch(function(){return caches.match("index.html")}));
    return;
  }
  /* وێنێن یاریان: ژ پاراستی ب لەز، پاشی ل پشت نوی دکەت */
  if(r.destination==="image"){
    e.respondWith(caches.open(V+"-img").then(function(c){return c.match(r).then(function(hit){
      var net=fetch(r).then(function(res){c.put(r,res.clone());return res}).catch(function(){return hit});
      return hit||net;
    })}));
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(caches.match(r).then(function(hit){return hit||fetch(r)}));
  }
});
