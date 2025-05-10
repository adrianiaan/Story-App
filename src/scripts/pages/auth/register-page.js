import StoryApiService from '../../data/api';
import { createRegisterFormTemplate } from '../../templates/template-creator';

export default class RegisterPage {
  async render() {
    return `
      <div class="container">
        ${createRegisterFormTemplate()}
      </div>
    `;
  }

  async afterRender() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const response = await StoryApiService.register({ name, email, password });
        
        if (!response.error) {
          alert('Registrasi berhasil! Silakan login.');
          window.location.href = '#/login';
        } else {
          alert(`Registrasi gagal: ${response.message}`);
        }
      } catch (error) {
        alert('Terjadi kesalahan saat registrasi');
        console.error(error);
      }
    });
  }
}