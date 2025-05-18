import CONFIG from '../config';
import StoryApiService from '../data/api';

const NotificationHelper = {
  async requestPermission() {
    if (!('Notification' in window)) {
      console.error('Browser tidak mendukung notifikasi');
      return false;
    }
    
    console.log('Meminta izin notifikasi...');
    const result = await Notification.requestPermission();
    console.log('Hasil permintaan izin:', result);
    
    if (result === 'denied') {
      console.warn('Izin notifikasi ditolak');
      return false;
    }
    
    if (result === 'default') {
      console.warn('Pengguna menutup dialog permintaan izin');
      return false;
    }
    
    return true;
  },
  
  async subscribePushNotif(token) {
    try {
      console.log('Memulai proses berlangganan push notification...');
      
      const permissionGranted = await this.requestPermission();
      if (!permissionGranted) {
        console.log('Izin notifikasi tidak diberikan');
        return null;
      }

      if (!('serviceWorker' in navigator)) {
        console.error('Service Worker tidak didukung di browser ini');
        return null;
      }

      console.log('Menunggu service worker siap...');
      const registration = await navigator.serviceWorker.ready;
      
      let subscription = await registration.pushManager.getSubscription();
      console.log('Subscription yang ada:', subscription);

      if (subscription) {
        console.log('Sudah berlangganan, mengembalikan subscription yang ada');
        return subscription;
      }

      const vapidPublicKey = CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY;
      const convertedVapidKey = this._urlBase64ToUint8Array(vapidPublicKey);
      
      console.log('Mencoba berlangganan push notification...');
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
        console.log('Subscription berhasil dibuat:', subscription);
      } catch (subscribeError) {
        console.error('Gagal membuat subscription:', subscribeError);
        return null;
      }

      // Sesuaikan format subscription sebelum dikirim ke server
      const subscriptionJson = subscription.toJSON();
      const subscriptionData = {
        endpoint: subscriptionJson.endpoint,
        keys: {
          p256dh: subscriptionJson.keys.p256dh,
          auth: subscriptionJson.keys.auth,
        }
      };
      
      try {
        await StoryApiService.subscribePushNotification(subscriptionData, token);
        console.log('Subscription berhasil dikirim ke server');
      } catch (apiError) {
        console.error('Gagal mengirim subscription ke server:', apiError);
        // Tetap kembalikan subscription meskipun gagal mengirim ke server
      }

      return subscription;
    } catch (error) {
      console.error('Gagal berlangganan push notification:', error);
      return null;
    }
  },

  async unsubscribePushNotif(token) {
    try {
      console.log('Memulai proses berhenti berlangganan push notification...');
      
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        console.log('Tidak ada subscription yang aktif');
        return;
      }

      // Sesuaikan format unsubscribe sesuai dengan API
      const subscriptionJson = subscription.toJSON();
      const unsubscribeData = {
        endpoint: subscriptionJson.endpoint,
      };
      
      try {
        await StoryApiService.unsubscribePushNotification(unsubscribeData, token);
        console.log('Permintaan unsubscribe berhasil dikirim ke server');
      } catch (apiError) {
        console.error('Gagal mengirim permintaan unsubscribe ke server:', apiError);
        // Tetap lanjutkan unsubscribe di browser meskipun gagal di server
      }

      console.log('Menghapus subscription di browser...');
      await subscription.unsubscribe();
      console.log('Berhasil berhenti berlangganan push notification');
    } catch (error) {
      console.error('Gagal berhenti berlangganan push notification:', error);
      throw error;
    }
  },
  
  async isPushNotificationSubscribed() {
    try {
      if (!('serviceWorker' in navigator)) {
        console.log('Service Worker tidak didukung di browser ini');
        return false;
      }
      
      console.log('Memeriksa status langganan push notification...');
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      console.log('Status langganan:', !!subscription);
      return !!subscription;
    } catch (error) {
      console.error('Gagal memeriksa status langganan push notification:', error);
      return false;
    }
  },
  
  _urlBase64ToUint8Array(base64String) {
    if (!base64String) {
      console.error('base64String tidak boleh kosong');
      return new Uint8Array();
    }
    
    try {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      
      for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      
      return outputArray;
    } catch (error) {
      console.error('Gagal mengkonversi base64 ke Uint8Array:', error);
      return new Uint8Array();
    }
  },
};

export default NotificationHelper;