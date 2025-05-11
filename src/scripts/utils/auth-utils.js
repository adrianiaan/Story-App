const AUTH_KEY = "story_app_auth";

const AuthUtils = {
  setAuth(token, user) {
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        token,
        user,
      })
    );
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
    const { token, user } = this.getAuth();
    return !!token && !!user && !!user.name; // Pastikan semua data yang diperlukan ada
  },

  // Fungsi untuk memperbarui menu navigasi berdasarkan status login
  updateAuthMenu() {
    const authMenu = document.getElementById("auth-menu");
    if (!authMenu) return;

    if (this.isLoggedIn()) {
      const { user } = this.getAuth();
      if (user && user.name) {
        authMenu.innerHTML = `
        <a href="#/" id="logout-button">Logout (${user.name})</a>
      `;

        const logoutButton = document.getElementById("logout-button");
        if (logoutButton) {
          logoutButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.destroyAuth();
            window.location.href = "#/login";
            this.updateAuthMenu();
          });
        }
      } else {
        // Jika data user tidak lengkap, hapus autentikasi
        this.destroyAuth();
        authMenu.innerHTML = '<a href="#/login">Masuk</a>';
      }
    } else {
      authMenu.innerHTML = '<a href="#/login">Masuk</a>';
    }
  },
};

export default AuthUtils;
