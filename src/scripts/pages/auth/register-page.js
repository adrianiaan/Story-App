import RegisterView from '../../mvp/view/register-view';
import AuthModel from '../../mvp/model/auth-model';
import RegisterPresenter from '../../mvp/presenter/register-presenter';

class RegisterPage {
  constructor() {
    this._view = new RegisterView();
    this._authModel = new AuthModel();
    this._presenter = new RegisterPresenter({
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

export default RegisterPage;