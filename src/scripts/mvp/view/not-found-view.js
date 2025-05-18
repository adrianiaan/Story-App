class NotFoundView {
  constructor() {
    this._container = document.querySelector('#main-content');
  }

  render() {
    this._container.innerHTML = `
      <div class="container">
        <div class="not-found-page">
          <h2 class="not-found-title">404 - Halaman Tidak Ditemukan</h2>
          <div class="not-found-image">
            <i class="fas fa-exclamation-triangle fa-5x"></i>
          </div>
          <p class="not-found-description">Maaf, halaman yang Anda cari tidak ditemukan.</p>
          <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
        </div>
      </div>
    `;
  }
}

export default NotFoundView;