class AboutPresenter {
  constructor({ view, authModel }) {
    this._view = view;
    this._authModel = authModel;
    
    this._view.setPresenter(this);
  }
  
  async init() {
    try {
      await this._loadNotificationStatus();
    } catch (error) {
      console.error('Error initializing about page:', error);
    }
  }
  
  async _loadNotificationStatus() {
    const auth = this._authModel.getAuth();
    await this._view.updateNotificationStatus(auth);
  }
  
  async toggleNotification() {
    try {
      const auth = this._authModel.getAuth();
      if (!auth || !auth.token) {
        return { success: false, message: 'Anda harus login untuk mengaktifkan notifikasi' };
      }
      
      const isCurrentlySubscribed = await this._view.isNotificationSubscribed();
      
      if (isCurrentlySubscribed) {
        await this._view.unsubscribeNotification(auth.token);
        return { success: true, subscribed: false, message: 'Notifikasi dinonaktifkan' };
      } else {
        const result = await this._view.subscribeNotification(auth.token);
        if (result) {
          return { success: true, subscribed: true, message: 'Notifikasi diaktifkan' };
        }
        return { success: false, message: 'Gagal mengaktifkan notifikasi' };
      }
    } catch (error) {
      console.error('Error toggling notification:', error);
      return { success: false, message: 'Terjadi kesalahan saat mengubah status notifikasi' };
    }
  }
}

export default AboutPresenter;