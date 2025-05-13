import AboutView from '../../mvp/view/about-view';

class AboutPage {
  constructor() {
    this._view = new AboutView();
  }

  async render() {
    return this._view.getTemplate();
  }

  async afterRender() {
    // Tidak ada logika khusus yang perlu dijalankan setelah render
  }
}

export default AboutPage;