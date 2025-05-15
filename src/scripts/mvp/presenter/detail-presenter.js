class DetailPresenter {
  constructor({ view, model, authModel, id }) {
    this._view = view;
    this._model = model;
    this._authModel = authModel;
    this._id = id;
  }

  async init() {
    this._view.initElements();
    this._view.showLoading();

    const { token } = this._authModel.getAuth();

    if (!token) {
      this._view.redirectToLogin();
      return;
    }

    await this._fetchStoryDetail(token);
  }

  async _fetchStoryDetail(token) {
    try {
      const result = await this._model.getDetailStory(this._id, token);

      if (!result.error) {
        this._view.showStory(result.story);
      } else {
        this._view.showError(result.message);
      }
    } catch (error) {
      this._view.showError("Error: Tidak dapat memuat detail cerita");
    }
  }
}

export default DetailPresenter;
