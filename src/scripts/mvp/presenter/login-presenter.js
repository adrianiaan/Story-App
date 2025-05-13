class LoginPresenter {
  constructor({ view, authModel }) {
    this._view = view;
    this._authModel = authModel;
  }

  async init() {
    // Redirect jika sudah login
    if (this._authModel.isLoggedIn()) {
      window.location.href = '#/';
      return;
    }
    
    this._view.initElements();
    this._view.setupLoginForm(async (credentials) => {
      await this._login(credentials);
    });
  }

  async _login(credentials) {
    try {
      const result = await this._authModel.login(credentials);
      
      if (!result.error) {
        this._view.showSuccessMessage('Login berhasil');
        window.location.href = '#/';
      } else {
        this._view.showErrorMessage(`Login gagal: ${result.message}`);
      }
    } catch (error) {
      this._view.showErrorMessage('Terjadi kesalahan saat login');
      console.error(error);
    }
  }
}

export default LoginPresenter;