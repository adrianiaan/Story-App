import { Workbox } from 'workbox-window';

const swRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker tidak didukung di browser ini');
    return;
  }

  try {
    const wb = new Workbox('/sw.js');
    
    // Tambahkan event listener untuk menangani update
    wb.addEventListener('installed', (event) => {
      console.log('Service worker installed for the first time!');
      if (!event.isUpdate) {
        console.log('Service Worker berhasil diinstal');
      }
    });

    wb.addEventListener('waiting', (event) => {
      console.log(
        'New service worker is waiting to activate. ',
        'When you close all tabs of this web, the new service worker will be activated',
      );
    });

    wb.addEventListener('activated', (event) => {
      if (!event.isUpdate) {
        console.log('Service Worker aktif! Halaman akan bekerja secara offline.');
      }
    });

    wb.addEventListener('controlling', () => {
      console.log('Service Worker mengontrol halaman');
    });

    wb.addEventListener('message', (event) => {
      console.log(`Pesan dari Service Worker: ${event.data}`);
    });

    // Register the service worker
    await wb.register();
    console.log('Service worker registered');
  } catch (error) {
    console.error('Gagal mendaftarkan service worker:', error);
  }
};

export default swRegister;