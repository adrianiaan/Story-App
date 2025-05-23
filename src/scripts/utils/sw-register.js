import { Workbox } from 'workbox-window';

const swRegister = async () => {
  const disableInDevelopment = false;
  const isDevelopment = typeof IS_DEVELOPMENT !== 'undefined' ? IS_DEVELOPMENT : 
                        process.env.NODE_ENV === 'development';

  if (isDevelopment && disableInDevelopment) {
    console.log('Service Worker dinonaktifkan dalam mode development');
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Service worker berhasil dihapus');
      }
    }
    return;
  }

  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker tidak didukung di browser ini');
    return;
  }

  try {
    // Gunakan path relatif './sw.js' agar scope sesuai dengan lokasi aplikasi
    const wb = new Workbox('./sw.js');

    wb.addEventListener('installed', (event) => {
      if (!event.isUpdate) {
        console.log('Service Worker berhasil diinstal');
      }
    });

    wb.addEventListener('activated', () => {
      console.log('Service Worker berhasil diaktifkan');
    });

    wb.addEventListener('controlling', () => {
      console.log('Service Worker sekarang mengontrol halaman');
    });

    wb.addEventListener('waiting', (event) => {
      console.log('Service Worker baru menunggu untuk mengambil alih');
      if (confirm('Pembaruan tersedia! Muat ulang untuk memperbarui aplikasi?')) {
        wb.messageSkipWaiting();
        window.location.reload();
      }
    });

    await wb.register();
    console.log('Service worker registered');
  } catch (error) {
    console.error('Gagal mendaftarkan service worker:', error);
  }
};

export default swRegister;
