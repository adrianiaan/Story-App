import IdbService from '../../data/idb-service';

class SavedStoriesPresenter {
  constructor({ view, authModel }) {
    this._view = view;
    this._authModel = authModel;
    this._savedStories = [];
  }

  async init() {
    this._view.initElements();
    this._view.showLoading();

    // Cek autentikasi terlebih dahulu
    const { token } = this._authModel.getAuth();

    if (!token) {
      this._view.redirectToLogin();
      return;
    }

    await this._fetchSavedStories();
    this._view.bindRemoveSavedStory(this._handleRemoveSavedStory.bind(this));
  }

  async _fetchSavedStories() {
    try {
      this._savedStories = await IdbService.getSavedStories();
      this._view.showStories(this._savedStories);
    } catch (error) {
      console.error('Error fetching saved stories:', error);
      this._view.showError('Gagal memuat cerita tersimpan');
    }
  }

  async _handleRemoveSavedStory(id) {
    try {
      await IdbService.removeSavedStory(id);
      await this._fetchSavedStories(); // Refresh data
    } catch (error) {
      console.error('Error removing saved story:', error);
      this._view.showError('Gagal menghapus cerita');
    }
  }

  cleanUp() {
    // Bersihkan referensi jika diperlukan
    this._view = null;
    this._authModel = null;
  }
}

export default SavedStoriesPresenter;
