export default class AboutPage {
  async render() {
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
                <i class="fab fa-webpack"></i>
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
    `;
  }

  async afterRender() {
    // Tidak ada logika khusus untuk halaman about
  }
}