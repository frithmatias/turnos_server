const CACHE_STATIC = 'static-0.4'
const CACHE_DYNAMIC = 'dynamic-0.1'
const CACHE_INMUTABLE = 'inmutable-0.1'

// ----------------------------------------------------------
// app shell
// ----------------------------------------------------------
self.addEventListener('install', e => {
  let static = caches.open(CACHE_STATIC).then(cache => {

    return cache.addAll([
      '/',
      '/assets/new-ticket.mp3',
      '/assets/pwa.css',
      '/app.js',
      '/favicon.ico',
      '/index.html',
      '/offline.html',
      '/manifest.json',
      '/4.32f8452458a163cf1734.js',
      '/5.5b52c9a1e82f190f6dc7.js',
      '/6.899432eb217875ee6c16.js',
      '/7.7e3b4524007f43f0c6bc.js',
      '/main.8aaf35d0b222d371f6b1.js',
      '/polyfills.ac27f9db7182d098bf2e.js',
      '/runtime.1cd2dcba659184f80f12.js',
      '/styles.af3524690ed1f7ea99d1.css'
    ])
  })

  let inmutable = caches.open(CACHE_INMUTABLE).then(cache => {
    return cache.addAll([
      'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css'
    ])
  })

  waitUntil(Promise.all([inmutable, static]))
})

// ----------------------------------------------------------
// delete old static cache
// ----------------------------------------------------------

self.addEventListener('activate', e => {
  const respuesta = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== CACHE_STATIC && key.includes('static')) {
        return caches.delete(key)
      }
    })
  })
  e.waitUntil(respuesta)
})

// ----------------------------------------------------------
// 2. Strategy: Cache with network fallback
// ----------------------------------------------------------

self.addEventListener('fetch', e => {
  // Verifico si existe el recurso en cache
  const respuesta = caches
    .match(e.request)
    .then(resp => {
      if (resp) {
        return resp
      }
      return fetch(e.request).then(resp => {
        
        if (e.request.method !== 'POST') {
          caches.open(CACHE_DYNAMIC).then(cache => {
            cache.put(e.request, resp.clone())
          })
        }

        return resp.clone()
      })
    })
    .catch(err => {
      if (e.request.headers.get('accept').includes('text/html')) {
        return caches.match('/offline.html')
      }
    })

  e.respondWith(respuesta)
})


// escuchar push
self.addEventListener('push', e => {

  const data = JSON.parse(e.data.text());
  const title = data.title;
  const msg = data.msg;
  
  const options = {
    body: msg,
    vibrate: [0,300,100,50,100,50,100,50,100,50,100,50,100,50,150,150,150,450,100,50,100,50,150,150,150,450,100,50,100,50,150,150,150,450,150,150],
    icon: 'assets/img/icons/icon-72x72.png',
    badge: 'img/favicon.ico',
    openUrl: 'https://webturnos.herokuapp.com',
    data: {
      url: 'https://webturnos.herokuapp.com'
    },
    actions: [ // solo permite dos acciones válidas se muestran como BOTONES en la notificación.
      {
          action: 'ver-pantalla',
          title: 'Ver Pantalla',
          // icon: 'assets/avatars/.jpg'
      },
      {
          action: 'obtener-turno',
          title: 'Obtener Turno',
         // icon: 'assets/avatars/.jpg'
      }
  ]
  };

  e.waitUntil( self.registration.showNotification(title, options));
})

self.addEventListener('notificationclick', e => {

  const notificacion = e.notification;
  const accion = e.action;
  notificacion.close();

})

self.addEventListener('notificationclick', e => {

  const notificacion = e.notification;
  const accion = e.action;
  const respuesta = clients.matchAll().then( clientes => {

      let cliente = clientes.find( c => {
          return c.visibilityState === 'visible';
      })
      if ( cliente !== undefined ) {
          cliente.navigate( notificacion.data.url );
          cliente.focus();
      } else {
          clients.openWindow( notificacion.data.url ); // me abre una nueva pestaña pero no es lo que yo quiero 
      }
      return notificacion.close();
  }) 
  e.waitUntil( respuesta ); 
})
