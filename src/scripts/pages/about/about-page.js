import AboutView from '../../mvp/view/about-view';
import AboutPresenter from '../../mvp/presenter/about-presenter';
import AuthModel from '../../mvp/model/auth-model';

class AboutPage {
  constructor() {
    this._view = new AboutView();
    this._authModel = new AuthModel();
    this._presenter = new AboutPresenter({
      view: this._view,
      authModel: this._authModel,
    });
  }

  async render() {
    return this._view.getTemplate();
  }

  async afterRender() {
    await this._view.afterRender();
    await this._presenter.init();
  }
}

export default AboutPage;