import HomeView from '../../mvp/view/home-view';
import StoryModel from '../../mvp/model/story-model';
import AuthModel from '../../mvp/model/auth-model';
import HomePresenter from '../../mvp/presenter/home-presenter';

class HomePage {
  constructor() {
    this._view = new HomeView();
    this._model = new StoryModel();
    this._authModel = new AuthModel();
    this._presenter = new HomePresenter({
      view: this._view,
      model: this._model,
      authModel: this._authModel,
    });
  }

  async render() {
    return this._view.getTemplate();
  }

  async afterRender() {
    await this._presenter.init();
  }
}

export default HomePage;