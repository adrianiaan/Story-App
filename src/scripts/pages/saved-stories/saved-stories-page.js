import SavedStoriesView from '../../mvp/view/saved-stories-view';
import AuthModel from '../../mvp/model/auth-model';
import SavedStoriesPresenter from '../../mvp/presenter/saved-stories-presenter';

class SavedStoriesPage {
  constructor() {
    this._view = new SavedStoriesView();
    this._authModel = new AuthModel();
    this._presenter = new SavedStoriesPresenter({
      view: this._view,
      authModel: this._authModel,
    });
  }

  async render() {
    return this._view.getTemplate();
  }

  async afterRender() {
    await this._presenter.init();
  }

  cleanUp() {
    if (this._presenter && typeof this._presenter.cleanUp === 'function') {
      this._presenter.cleanUp();
    }
  }
}

export default SavedStoriesPage;
