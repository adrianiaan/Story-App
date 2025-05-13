class RegisterPresenter {
  constructor({ view, authModel }) {
    this._view = view;
    this._authModel = authModel;
  }

  async init() {
    this._view.initElements();
    this._view.setupRegisterForm(async (userData) => {
      await this._register(userData);
    });
  }

  async _register(userData) {
    try {
      const response = await this._authModel.register(userData);
      
      if (!response.error) {
        this._view.showSuccessMessage('Registrasi berhasil! Silakan login.');
        window.location.href = '#/login';
      } else {
        this._view.showErrorMessage(`Registrasi gagal: ${response.message}`);
      }
    } catch (error) {
      this._view.showErrorMessage('Terjadi kesalahan saat registrasi');
      console.error(error);
    }
  }
}

export default RegisterPresenter;