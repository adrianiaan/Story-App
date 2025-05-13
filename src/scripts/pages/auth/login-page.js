import LoginView from '../../mvp/view/login-view';
import AuthModel from '../../mvp/model/auth-model';
import LoginPresenter from '../../mvp/presenter/login-presenter';

class LoginPage {
  constructor() {
    this._view = new LoginView();
    this._authModel = new AuthModel();
    this._presenter = new LoginPresenter({
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
}

export default LoginPage;