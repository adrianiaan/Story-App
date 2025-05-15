class AddStoryPresenter {
  constructor({ view, model, authModel }) {
    this._view = view;
    this._model = model;
    this._authModel = authModel;

    this._initPresenter();
  }

  _initPresenter() {
    // Verifikasi autentikasi
    const { token } = this._authModel.getAuth();

    if (!token) {
      this._view.redirectToLogin(); // ✅ Menggunakan metode View
      return;
    }

    // Inisialisasi elemen view
    this._view.initElements();

    // Setup kamera
    this._view.setupCameraFunctionality();

    // Setup form submission
    this._view.setupFormSubmission(this._handleAddStory.bind(this));
  }

  async _handleAddStory(formData) {
    try {
      const { token } = this._authModel.getAuth();
      const response = await this._model.addStory(formData, token);

      if (!response.error) {
        this._view.showSuccessMessage("Cerita berhasil ditambahkan");
        this._view.goToHomePage(); // ✅ Menggunakan metode View
      } else {
        this._view.showErrorMessage(
          `Gagal menambahkan cerita: ${response.message}`
        );
      }
    } catch (error) {
      this._view.showErrorMessage("Terjadi kesalahan saat menambahkan cerita");
      console.error(error);
    }
  }

  // Metode untuk membersihkan sumber daya saat presenter tidak lagi digunakan
  destroy() {
    this._view.cleanUp();
  }
}

export default AddStoryPresenter;
