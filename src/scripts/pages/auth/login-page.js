import StoryApiService from '../../data/api';
import AuthUtils from '../../utils/auth-utils';
import { createLoginFormTemplate } from '../../templates/template-creator';

export default class LoginPage {
  async render() {
    return `
      <div class="container">
        ${createLoginFormTemplate()}
      </div>
    `;
  }

  async afterRender() {
    // Redirect jika sudah login
    if (AuthUtils.isLoggedIn()) {
      window.location.href = '#/';
      return;
    }
    
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const response = await StoryApiService.login({ email, password });
        
        if (!response.error) {
          AuthUtils.setAuth(response.loginResult.token, {
            id: response.loginResult.userId,
            name: response.loginResult.name,
          });
          
          alert('Login berhasil');
          window.location.href = '#/';
          
          // Update tampilan menu
          this._updateAuthMenu();
        } else {
          alert(`Login gagal: ${response.message}`);
        }
      } catch (error) {
        alert('Terjadi kesalahan saat login');
        console.error(error);
      }
    });
  }
  
  _updateAuthMenu() {
    const authMenu = document.getElementById('auth-menu');
    
    if (AuthUtils.isLoggedIn()) {
      const { user } = AuthUtils.getAuth();
      authMenu.innerHTML = `
        <a href="#/" id="logout-button">Logout (${user.name})</a>
      `;
      
      document.getElementById('logout-button').addEventListener('click', (event) => {
        event.preventDefault();
        AuthUtils.destroyAuth();
        window.location.href = '#/login';
        this._updateAuthMenu();
      });
    } else {
      authMenu.innerHTML = '<a href="#/login">Masuk</a>';
    }
  }
}