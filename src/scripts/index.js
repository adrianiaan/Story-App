import 'regenerator-runtime';
import '../styles/styles.css';
import AuthUtils from './utils/auth-utils';
import App from './pages/app';
import swRegister from './utils/sw-register';
import NetworkStatus from './utils/network-status';

// Cek apakah browser mendukung View Transitions API
const supportsViewTransitions = 'startViewTransition' in document;

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  
  const mainContent = document.querySelector("#main-content");
  const skipLink = document.querySelector(".skip-link");
  
  skipLink.addEventListener("click", function (event) {
    event.preventDefault(); 
    skipLink.blur(); 
    mainContent.focus(); 
    mainContent.scrollIntoView(); 
  });

  // Inisialisasi menu autentikasi
  AuthUtils.updateAuthMenu();
  
  // Inisialisasi status jaringan
  NetworkStatus.init({
    connectionStatusElement: document.querySelector('#connection-status'),
  });
  
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
  
  // Daftarkan service worker
  await swRegister();
});