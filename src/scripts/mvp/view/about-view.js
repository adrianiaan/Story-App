import NotificationHelper from '../../utils/notification-helper';

class AboutView {
  constructor() {
    this._presenter = null;
  }
  
  setPresenter(presenter) {
    this._presenter = presenter;
  }

  getTemplate() {
    return `
      <div class="container">
        <div class="about-page">
          <div class="about-header">
            <i class="fas fa-book-open about-icon"></i>
            <h2>Tentang Story App</h2>
          </div>
          
          <div class="about-section">
            <h3><i class="fas fa-info-circle"></i> Deskripsi Aplikasi</h3>
            <p>Story App adalah aplikasi berbagi cerita sederhana yang memungkinkan pengguna untuk berbagi momen spesial mereka dengan komunitas. Dengan antarmuka yang intuitif dan fitur yang mudah digunakan, Story App menjadi platform ideal untuk berbagi pengalaman Anda.</p>
            
            <div class="feature-cards">
              <div class="feature-card">
                <i class="fas fa-edit"></i>
                <h4>Membuat Cerita</h4>
                <p>Bagikan cerita Anda dengan foto yang menarik</p>
              </div>
              
              <div class="feature-card">
                <i class="fas fa-map-marker-alt"></i>
                <h4>Tambahkan Lokasi</h4>
                <p>Tandai lokasi di mana cerita Anda terjadi</p>
              </div>
              
              <div class="feature-card">
                <i class="fas fa-users"></i>
                <h4>Jelajahi Cerita</h4>
                <p>Temukan dan nikmati cerita dari pengguna lain</p>
              </div>
            </div>
          </div>
          
          <!-- Tambahkan bagian untuk notifikasi -->
          <div class="about-section notification-section">
            <h3><i class="fas fa-bell"></i> Notifikasi</h3>
            <p>Dapatkan pemberitahuan tentang cerita baru yang dibagikan.</p>
            
            <div class="notification-controls">
              <button id="notificationBtn" class="btn btn-primary">
                <i class="fas fa-bell"></i> <span id="notificationBtnText">Aktifkan Notifikasi</span>
              </button>
              <p id="notificationStatus" class="notification-status"></p>
            </div>
          </div>

          <div class="about-section">
            <h3><i class="fas fa-code"></i> Teknologi yang Digunakan</h3>
            <div class="tech-stack">
              <div class="tech-item">
                <i class="fab fa-html5"></i>
                <span>HTML5</span>
              </div>
              <div class="tech-item">
                <i class="fab fa-css3-alt"></i>
                <span>CSS3</span>
              </div>
              <div class="tech-item">
                <i class="fab fa-js"></i>
                <span>JavaScript</span>
              </div>
              <div class="tech-item">
                <i class="fab fa-box"></i>
                <span>Webpack</span>
              </div>
              <div class="tech-item">
                <i class="fas fa-map"></i>
                <span>Leaflet</span>
              </div>
              <div class="tech-item">
                <i class="fas fa-camera"></i>
                <span>Web Camera API</span>
              </div>
            </div>
          </div>      
        </div>
      </div>
    `;
  }

  async afterRender() {
    const notificationBtn = document.getElementById('notificationBtn');
    
    // Tambahkan event listener untuk tombol notifikasi
    notificationBtn.addEventListener('click', async () => {
      try {
        notificationBtn.disabled = true;
        
        const result = await this._presenter.toggleNotification();
        
        const notificationBtnText = document.getElementById('notificationBtnText');
        const notificationStatus = document.getElementById('notificationStatus');
        
        if (result.success) {
          this._updateNotificationUI(result.subscribed, notificationBtnText, notificationStatus);
          notificationStatus.textContent = result.message;
        } else {
          notificationStatus.textContent = result.message;
          notificationStatus.classList.add('notification-error');
        }
      } finally {
        notificationBtn.disabled = false;
      }
    });
  }
  
  async updateNotificationStatus(auth) {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationBtnText = document.getElementById('notificationBtnText');
    const notificationStatus = document.getElementById('notificationStatus');
    
    // Cek apakah user sudah login
    if (!auth || !auth.token) {
      notificationBtn.disabled = true;
      notificationStatus.textContent = 'Anda harus login untuk mengaktifkan notifikasi';
      notificationStatus.classList.add('notification-warning');
      return;
    }
    
    // Cek apakah browser mendukung notifikasi
    if (!('Notification' in window)) {
      notificationBtn.disabled = true;
      notificationStatus.textContent = 'Browser Anda tidak mendukung notifikasi';
      notificationStatus.classList.add('notification-error');
      return;
    }
    
    // Cek status langganan notifikasi
    const isSubscribed = await this.isNotificationSubscribed();
    this._updateNotificationUI(isSubscribed, notificationBtnText, notificationStatus);
  }
  
  async isNotificationSubscribed() {
    return NotificationHelper.isPushNotificationSubscribed();
  }
  
  async subscribeNotification(token) {
    return NotificationHelper.subscribePushNotif(token);
  }
  
  async unsubscribeNotification(token) {
    return NotificationHelper.unsubscribePushNotif(token);
  }
  
  _updateNotificationUI(isSubscribed, buttonText, statusElement) {
    if (isSubscribed) {
      buttonText.textContent = 'Nonaktifkan Notifikasi';
      statusElement.textContent = 'Notifikasi aktif';
      statusElement.classList.add('notification-active');
      statusElement.classList.remove('notification-inactive', 'notification-error', 'notification-warning');
    } else {
      buttonText.textContent = 'Aktifkan Notifikasi';
      statusElement.textContent = 'Notifikasi tidak aktif';
      statusElement.classList.add('notification-inactive');
      statusElement.classList.remove('notification-active', 'notification-error', 'notification-warning');
    }
  }
}

export default AboutView;