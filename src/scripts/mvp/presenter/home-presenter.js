class HomePresenter {
  constructor({ view, model, authModel }) {
    this._view = view;
    this._model = model;
    this._authModel = authModel;
  }

  async init() {
    this._view.initElements();
    this._view.showLoading();

    const { token } = this._authModel.getAuth();

    if (!token) {
      this._view.redirectToLogin();
      return;
    }

    await this._fetchStories(token);
  }

  async _fetchStories(token) {
    try {
      const result = await this._model.getAllStories(token, { location: true });

      if (!result.error) {
        this._view.showStories(result.stories);
        this._view.showStoriesMap(result.stories);
      } else {
        this._view.showError(result.message);
      }
    } catch (error) {
      this._view.showError("Error: Tidak dapat memuat cerita");
    }
  }
}

export default HomePresenter;
