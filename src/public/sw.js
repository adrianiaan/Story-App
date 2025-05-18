import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';

// Aktifkan clientsClaim agar service worker langsung mengontrol halaman
clientsClaim();

// Precache semua aset yang di-inject oleh Workbox Webpack Plugin
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache halaman offline
registerRoute(
  ({ url }) => url.pathname === '/offline.html',
  new CacheFirst()
);

// Cache API dengan NetworkFirst strategy
registerRoute(
  ({ url }) => url.origin === 'https://story-api.dicoding.dev',
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 5, // 5 menit
      }),
    ],
  })
);

// Cache gambar dengan CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  })
);

// Cache font dan CSS dengan StaleWhileRevalidate strategy
registerRoute(
  ({ request }) => 
    request.destination === 'style' || 
    request.destination === 'font' ||
    request.url.includes('fonts.googleapis.com') ||
    request.url.includes('cdnjs.cloudflare.com'),
  new StaleWhileRevalidate({
    cacheName: 'styles-fonts-cache',
  })
);

// Cache JavaScript dengan StaleWhileRevalidate strategy
registerRoute(
  ({ request }) => request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'scripts-cache',
  })
);

// Menangani push notification
self.addEventListener('push', (event) => {
  console.log('Service Worker: Pushed');

  let notificationData = {
    title: 'Story App',
    options: {
      body: 'Ada pembaruan baru di Story App',
      icon: './icons/android/android-launchericon-192-192.png',
      badge: './icons/android/android-launchericon-96-96.png',
      vibrate: [100, 50, 100],
      data: {
        url: '/',
      },
    },
  };

  if (event.data) {
    try {
      const dataJson = event.data.json();
      console.log('Received push data:', dataJson);
      
      // Format sesuai dengan dokumentasi API
      notificationData = {
        title: dataJson.title || notificationData.title,
        options: {
          ...notificationData.options,
          ...dataJson.options,
        },
      };
    } catch (error) {
      console.error('Gagal memproses data notifikasi:', error);
    }
  }

  console.log('Showing notification:', notificationData);
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

// Event untuk message dari klien (untuk skipWaiting)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Menangani sinkronisasi background
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-stories') {
    event.waitUntil(syncStories());
  }
});

// Fungsi untuk sinkronisasi cerita
async function syncStories() {
  try {
    // Implementasi sinkronisasi cerita yang tersimpan offline
    const cache = await caches.open('pending-stories');
    const requests = await cache.keys();
    
    const syncPromises = requests.map(async (request) => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          return { success: true, url: request.url };
        }
        return { success: false, url: request.url };
      } catch (error) {
        console.error('Error syncing story:', error);
        return { success: false, url: request.url, error };
      }
    });
    
    return Promise.all(syncPromises);
  } catch (error) {
    console.error('Error in syncStories:', error);
    return [];
  }
}

// Fallback ke halaman offline jika tidak ada koneksi
// Ini akan menangani kasus yang tidak ditangani oleh registerRoute di atas
self.addEventListener('fetch', (event) => {
  // Hanya tangani permintaan navigasi (HTML) yang tidak ditangani oleh Workbox
  if (event.request.mode === 'navigate' && !event.respondWith) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html') || caches.match('/');
      })
    );
  }
});