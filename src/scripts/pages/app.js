import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';
import AuthUtils from '../utils/auth-utils';

class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    
    this.#currentPage = null;
    
    this._setupDrawer();
  }

  #content;
  #drawerButton;
  #navigationDrawer;
  #currentPage = null;

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    try {
      // Update auth menu setiap kali halaman dirender
      AuthUtils.updateAuthMenu();
      
      const url = UrlParser.parseActiveUrlWithCombiner();
      const page = routes[url];

      // Panggil beforeUnload pada halaman sebelumnya jika ada
      if (this.#currentPage && typeof this.#currentPage.beforeUnload === 'function') {
        await this.#currentPage.beforeUnload();
      }

      if (!page) {
        this.#content.innerHTML = `
          <div class="container">
            <div class="error-page">
              <h2>404 - Halaman Tidak Ditemukan</h2>
              <p>Maaf, halaman yang Anda cari tidak ditemukan.</p>
              <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
            </div>
          </div>
        `;
        return;
      }

      // Simpan referensi ke halaman saat ini
      this.#currentPage = page;

      // Implementasi View Transition API
      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          this.#content.innerHTML = await page.render();
          await page.afterRender();
        }).finished;
      } else {
        // Fallback untuk browser yang tidak mendukung View Transition API
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      }
      
      // Scroll ke atas setelah navigasi
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error rendering page:', error);
      this.#content.innerHTML = `
        <div class="container">
          <div class="error-page">
            <h2>Terjadi Kesalahan</h2>
            <p>Maaf, terjadi kesalahan saat memuat halaman.</p>
            <a href="#/" class="btn btn-primary">Coba Lagi</a>
          </div>
        </div>
      `;
    }
  }
}

export default App;