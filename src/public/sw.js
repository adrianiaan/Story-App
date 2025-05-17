// Definisikan CACHE_NAME langsung
const CACHE_NAME = 'StoryApp-V1';

// Event install service worker
self.addEventListener('install', (event) => {
  console.log('Installing Service Worker...');
  self.skipWaiting();
});

// Event activate service worker
self.addEventListener('activate', (event) => {
  console.log('Activating Service Worker...');
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
  self.clients.claim();
});

// Event fetch untuk strategi cache
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Skip permintaan yang bukan GET atau yang menuju ke API
  if (request.method !== 'GET' || request.url.includes('/api/')) {
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
    self.registration.showNotification(notificationData.title, notificationData.options),
  );
});

// Event ketika notifikasi diklik
self.addEventListener('notificationclick', (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();

  const urlToOpen = clickedNotification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((windowClients) => {
      // Cek apakah ada jendela yang sudah terbuka
      const hadWindowToFocus = windowClients.some((windowClient) => {
        if (windowClient.url === urlToOpen) {
          windowClient.focus();
          return true;
        }
        return false;
      });

      // Jika tidak ada jendela yang terbuka, buka jendela baru
      if (!hadWindowToFocus) {
        clients.openWindow(urlToOpen);
      }
    }),
  );
});