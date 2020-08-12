const CACHE_STATIC = 'static-0.4'
const CACHE_DYNAMIC = 'dynamic-0.1'
const CACHE_INMUTABLE = 'inmutable-0.1'

// ----------------------------------------------------------
// app shell
// ----------------------------------------------------------
self.addEventListener('install', e => {
  let static = caches
    .open(CACHE_STATIC)
    .then(cache => {
      // waitUntil espera una promesa por lo tanto tengo que usar RETURN
      return cache.addAll([
        '/',
        '/assets/bell.wav',
        '/assets/pwa.css',
        '/app.js',
        '/favicon.ico',
        '/index.html',
        '/manifest.json',
        '/4.05bf28d970ff6d6359cf.js',
        '/5.4479c87e5d61e6c9e1b4.js',
        '/6.747a6366c41808a283c2.js',
        '/7.211dcef340d084fe8acf.js',
        '/main.e9610c398a025db0764d.js',
        '/polyfills.ac27f9db7182d098bf2e.js',
        '/runtime.3ea937ae7912d0be5882.js',
        '/styles.ecc377937ad782dab16b.css'
      ])
    })
    .catch(() => {
      console.log('error al crear la app shell')
    })
    
  let inmutable = caches
    .open(CACHE_INMUTABLE)
    .then(cache => {
      return cache.addAll([
        'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css'
      ])
    })
    .catch(() => {
      console.log('error al crear el cache inmutable')
    })

  e.waitUntil(Promise.all([inmutable, static]))
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
  if (
    e.request.url.includes('saturno') ||
    e.request.url.includes('herokuapp') ||
    e.request.url.includes('localhost')
  ) {
    // las peticiones GET no debe guardarlas en cache
    const respuesta = fetch(e.request).then(resp => {
      return resp
    })
    e.respondWith(respuesta)
  } else {
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
  }
})

// escuchar push
self.addEventListener('push', e => {
  const data = JSON.parse(e.data.text())
  const title = data.title
  const msg = data.msg

  const options = {
    body: msg,
    vibrate: [
      0,
      300,
      100,
      50,
      100,
      50,
      100,
      50,
      100,
      50,
      100,
      50,
      100,
      50,
      150,
      150,
      150,
      450,
      100,
      50,
      100,
      50,
      150,
      150,
      150,
      450,
      100,
      50,
      100,
      50,
      150,
      150,
      150,
      450,
      150,
      150
    ],
    icon: 'assets/img/icons/icon-72x72.png',
    badge: 'img/favicon.ico',
    openUrl: 'https://saturno.love',
    data: {
      url: 'https://saturno.love'
    },
    actions: [
      // solo permite dos acciones válidas se muestran como BOTONES en la notificación.
      {
        action: 'ver-pantalla',
        title: 'Ver Pantalla'
        // icon: 'assets/avatars/thor.jpg'
      },
      {
        action: 'obtener-turno',
        title: 'Obtener Turno'
        // icon: 'assets/avatars/ironman.jpg'
      }
    ]
  }
  // como toda accion en el SW tengo que esperar a que termine de realizar toda la notificación
  // porque puede demorar unos segundos.
  e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', e => {
  const notificacion = e.notification
  const accion = e.action
  notificacion.close()
})

self.addEventListener('notificationclick', e => {
  const notificacion = e.notification
  const accion = e.action
  //matchAll() busca en todas las pestañas abiertas del mismo sitio, y regresa una promesa
  const respuesta = clients.matchAll().then(clientes => {
    // clientes es un array de todos los tabs abiertos de mi aplicación yo sólo quiero el que se encuentra visible
    let cliente = clientes.find(c => {
      return c.visibilityState === 'visible'
    })
    if (cliente !== undefined) {
      cliente.navigate(notificacion.data.url)
      cliente.focus()
    } else {
      clients.openWindow(notificacion.data.url) // me abre una nueva pestaña pero no es lo que yo quiero
    }
    return notificacion.close()
  })
  e.waitUntil(respuesta)
})
