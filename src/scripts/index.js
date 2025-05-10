import 'regenerator-runtime';
import '../styles/styles.css';
import App from './pages/app';
import AuthUtils from './utils/auth-utils';

// Cek apakah browser mendukung View Transitions API
const supportsViewTransitions = 'startViewTransition' in document;

// Fungsi untuk menangani navigasi dengan View Transitions
const handleNavigation = async () => {
  const app = document.querySelector('app') || {};
  
  if (supportsViewTransitions) {
    document.startViewTransition(async () => {
      await app.renderPage();
    });
  } else {
    await app.renderPage();
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  
  // Inisialisasi menu autentikasi
  AuthUtils.updateAuthMenu();
  
  // Render halaman pertama kali
  await app.renderPage();
  
  // Tambahkan event listener untuk hashchange
  window.addEventListener('hashchange', async () => {
    if (supportsViewTransitions) {
      document.startViewTransition(async () => {
        await app.renderPage();
      });
    } else {
      await app.renderPage();
    }
  });
});