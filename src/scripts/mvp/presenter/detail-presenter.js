import IdbService from '../../data/idb-service';

class DetailPresenter {
  constructor({ view, model, authModel, id }) {
    this._view = view;
    this._model = model;
    this._authModel = authModel;
    this._id = id;
    this._story = null;
    this._isSaved = false;
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

    this._view.bindBookmarkClick(this._handleBookmarkClick.bind(this));
  }

  async _fetchStoryDetail(token) {
    try {
      const result = await this._model.getDetailStory(this._id, token);

      if (!result.error) {
        this._story = result.story;
        this._isSaved = await IdbService.isSavedStory(this._id);
        this._view.showStory(this._story, this._isSaved);
      } else {
        this._view.showError(result.message);
      }
    } catch (error) {
      this._view.showError("Error: Tidak dapat memuat detail cerita");
    }
  }

  async _handleBookmarkClick() {
    if (this._isSaved) {
      await IdbService.removeSavedStory(this._id);
      this._isSaved = false;
    } else {
      await IdbService.addSavedStory(this._story);
      this._isSaved = true;
    }
    this._view.showStory(this._story, this._isSaved);
  }
}

export default DetailPresenter;
