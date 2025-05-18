// Definisikan CACHE_NAME langsung
const CACHE_NAME = 'StoryApp-V1';

const isDevelopment = typeof IS_DEVELOPMENT !== 'undefined' ? IS_DEVELOPMENT : false;

const assetsToCache = [
 './',
  './icons/android/android-launchericon-48-48.png',
  './icons/android/android-launchericon-72-72.png',
  './icons/android/android-launchericon-96-96.png',
  './icons/android/android-launchericon-144-144.png',
  './icons/android/android-launchericon-192-192.png',
  './icons/android/android-launchericon-512-512.png',
  './index.html',
  './favicon.png',
  './app.bundle.js',
  './manifest.json',
];
                      
// Event install service worker
self.addEventListener('install', (event) => {
  console.log('Installing Service Worker...');
  
  // Tambahkan precaching di sini
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell and content');
        return cache.addAll(assetsToCache);
      })
      .catch((error) => {
        console.error('Precaching failed:', error);
      })
  );
  
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
    icon: '/favicon.png', // Ubah dari /icons/icon-192x192.png
    vibrate: [100, 50, 100],
    badge: '/favicon.png', // Ubah dari /icons/icon-72x72.png
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/',
    },
  },
}

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