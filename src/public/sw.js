// Definisikan CACHE_NAME langsung
const CACHE_NAME = 'StoryApp-V1';

// Cek apakah ini mode development (berdasarkan hostname)
const isDevelopment = self.location.hostname === 'localhost' || 
                      self.location.hostname === '127.0.0.1';


const assetsToCache = [
  './',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  './index.html',
  './favicon.png',
  './app.bundle.js',
  './manifest.json', // Tambahkan ini
];
                      
// Event install service worker
self.addEventListener('install', (event) => {
  console.log('Installing Service Worker...');
  
  // Skip waiting agar service worker langsung aktif
  self.skipWaiting();
});

// Event activate service worker
self.addEventListener('activate', (event) => {
  console.log('Activating Service Worker...');
  
  // Hapus cache lama
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((filteredName) => {
            console.log(`Deleting old cache: ${filteredName}`);
            return caches.delete(filteredName);
          }),
      );
    }),
  );
  
  // Klaim klien agar service worker langsung mengontrol halaman
  self.clients.claim();
});

// Event fetch untuk strategi cache
self.addEventListener('fetch', (event) => {
  // Skip caching di mode development
  if (isDevelopment) {
    return;
  }
  
  const request = event.request;
  
  // Skip permintaan yang bukan GET atau yang menuju ke API
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    return;
  }
  
  // Skip permintaan ke webpack-dev-server
  if (request.url.includes('webpack-dev-server') || 
      request.url.includes('hot-update') ||
      request.url.includes('sockjs-node')) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request)
        .then((fetchResponse) => {
          // Simpan salinan response ke cache
          if (fetchResponse && fetchResponse.status === 200) {
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
          }
          
          return fetchResponse;
        })
        .catch(() => {
          // Jika offline dan request adalah untuk halaman, kembalikan halaman offline
          if (request.destination === 'document') {
            return caches.match('/');
          }
          
          return new Response('Tidak dapat terhubung ke internet', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          });
        });
    }),
  );
});

// Event untuk push notification
self.addEventListener('push', (event) => {
  console.log('Service Worker: Pushed');

  let notificationData = {
    title: 'Notifikasi Baru',
    options: {
      body: 'Ada cerita baru yang dibagikan!',
      icon: '/icons/icon-192x192.png',
      vibrate: [100, 50, 100],
      badge: '/icons/icon-72x72.png',
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        url: '/',
      },
    },
  };

  if (event.data) {
    try {
      const dataJson = event.data.json();
      notificationData = {
        title: dataJson.title || notificationData.title,
        options: {
          ...notificationData.options,
          body: dataJson.body || notificationData.options.body,
          image: dataJson.image || null,
          data: {
            ...notificationData.options.data,
            url: dataJson.url || notificationData.options.data.url,
          },
        },
      };
    } catch (error) {
      console.error('Gagal memproses data notifikasi:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData.options)
  );
});

// Event untuk klik notifikasi
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const url = notification.data?.url || '/';

  notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      // Jika sudah ada jendela yang terbuka, fokuskan
      const hadWindowToFocus = clientsArr.some((windowClient) => {
        if (windowClient.url === url) {
          windowClient.focus();
          return true;
        }
        return false;
      });

      // Jika tidak ada jendela yang terbuka, buka jendela baru
      if (!hadWindowToFocus) {
        clients.openWindow(url).then((windowClient) => {
          if (windowClient) {
            windowClient.focus();
          }
        });
      }
    })
  );
});

// Event untuk message dari klien
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});