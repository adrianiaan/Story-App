export default class AboutPage {
  async render() {
    return `
      <div class="container">
        <div class="about-page">
          <h2>Tentang Story App</h2>
          <p>Story App adalah aplikasi berbagi cerita sederhana yang memungkinkan pengguna untuk:</p>
          <ul>
            <li>Membuat dan membagikan cerita dengan foto</li>
            <li>Menambahkan lokasi pada cerita</li>
            <li>Melihat cerita dari pengguna lain</li>
          </ul>
          <p>Aplikasi ini dibuat sebagai submission untuk kelas Dicoding "Belajar Fundamental Aplikasi Web dengan React".</p>
          
          <h3>Teknologi yang Digunakan</h3>
          <ul>
            <li>HTML, CSS, dan JavaScript</li>
            <li>Webpack sebagai module bundler</li>
            <li>Leaflet untuk menampilkan peta</li>
            <li>Web API untuk akses kamera</li>
          </ul>
        </div>
      </div>
    `;
  }

  async afterRender() {
    // Tidak ada logika khusus untuk halaman about
  }
}