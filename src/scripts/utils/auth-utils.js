const AUTH_KEY = 'story_app_auth';

const AuthUtils = {
  setAuth(token, user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      token,
      user,
    }));
  },

  getAuth() {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) {
      return { token: null, user: null };
    }
    return JSON.parse(authData);
  },

  destroyAuth() {
    localStorage.removeItem(AUTH_KEY);
  },

  isLoggedIn() {
    const { token } = this.getAuth();
    return !!token;
  },

  // Fungsi untuk memperbarui menu navigasi berdasarkan status login
  updateAuthMenu() {
    const authMenu = document.getElementById('auth-menu');
    
    if (this.isLoggedIn()) {
      const { user } = this.getAuth();
      authMenu.innerHTML = `
        <a href="#/" id="logout-button">Logout (${user.name})</a>
      `;
      
      document.getElementById('logout-button').addEventListener('click', (event) => {
        event.preventDefault();
        this.destroyAuth();
        window.location.href = '#/login';
        this.updateAuthMenu();
      });
    } else {
      authMenu.innerHTML = '<a href="#/login">Masuk</a>';
    }
  },
};

export default AuthUtils;