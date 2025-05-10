const AUTH_KEY = 'auth';

const AuthUtils = {
  setAuth(token, user) {
    return localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        token,
        user,
      }),
    );
  },

  getAuth() {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || { token: null, user: null };
  },

  destroyAuth() {
    return localStorage.removeItem(AUTH_KEY);
  },

  isLoggedIn() {
    const { token } = this.getAuth();
    return !!token;
  },
};

export default AuthUtils;