import CONFIG from '../config';
import StoryApiService from '../data/api';

const NotificationHelper = {
  async requestPermission() {
    if (!('Notification' in window)) {
      console.error('Browser tidak mendukung notifikasi');
      return false;
    }
    
    const result = await Notification.requestPermission();
    
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
      // Meminta izin notifikasi terlebih dahulu
      const permissionGranted = await this.requestPermission();
      
      if (!permissionGranted) {
        return null;
      }
      
      // Pastikan service worker sudah terdaftar
      if (!('serviceWorker' in navigator)) {
        console.error('Service Worker tidak didukung di browser ini');
        return null;
      }
      
      const registration = await navigator.serviceWorker.ready;
      
      // Cek apakah sudah berlangganan
      let subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Jika sudah berlangganan, kembalikan subscription yang ada
        return subscription;
      }
      
      // Jika belum berlangganan, buat subscription baru
      const vapidPublicKey = CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY;
      const convertedVapidKey = this._urlBase64ToUint8Array(vapidPublicKey);
      
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      
      // Kirim subscription ke server
      await StoryApiService.subscribePushNotification(subscription, token);
      
      return subscription;
    } catch (error) {
      console.error('Gagal berlangganan push notification:', error);
      return null;
    }
  },
  
  async unsubscribePushNotif(token) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        return;
      }
      
      // Hapus subscription di server
      await StoryApiService.unsubscribePushNotification(subscription, token);
      
      // Hapus subscription di browser
      await subscription.unsubscribe();
      
      console.log('Berhasil berhenti berlangganan push notification');
    } catch (error) {
      console.error('Gagal berhenti berlangganan push notification:', error);
    }
  },
  
  async isPushNotificationSubscribed() {
    try {
      if (!('serviceWorker' in navigator)) {
        return false;
      }
      
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      return !!subscription;
    } catch (error) {
      console.error('Gagal memeriksa status langganan push notification:', error);
      return false;
    }
  },
  
  _urlBase64ToUint8Array(base64String) {
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
  },
};

export default NotificationHelper;