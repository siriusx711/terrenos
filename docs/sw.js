;
// asignar nombre y version al caché
const CACHE_NAME='v1_cache_terrenos',
  urlsToCache=[
    './',
    './script.js',
    './favicon_io/favicon.ico'
  ]

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache=>{
      return cache.addAll(urlsToCache)
      .then(()=>self.skipWaiting())
  })
  .catch(err=>console.log('Falló registro de caché',err))
 )
})

self.addEventListener('activate', e=>{
  const cacheWhiteList=[CACHE_NAME]

  e.waitUntil(
    caches.keys()
    .then(cacheNames=>{
      return Promise.all(
        cacheNames.map(cacheName=>{
          //eliminar lo que ya no se necesita en caché
          if (cacheWhiteList.indexOf(cacheName)===-1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
    //le indica al SW activar el caché actual
    .then(()=>self.clients.claim())
  )
})

self.addEventListener('fetch', e=>{
  //responder con los objetos de la cache y verfica si es real
  e.respondWith(
    caches.match(e.request)
    .then(res =>{
      if (res) {
        return res
      }
      //recupera la peticion
      return fetch(e.request)
    })
  )
})
