import DetailView from '../../mvp/view/detail-view';
import StoryModel from '../../mvp/model/story-model';
import AuthModel from '../../mvp/model/auth-model';
import DetailPresenter from '../../mvp/presenter/detail-presenter';
import UrlParser from '../../routes/url-parser';

class DetailPage {
  constructor() {
    this._view = new DetailView();
    this._model = new StoryModel();
    this._authModel = new AuthModel();
  }

  async render() {
    return this._view.getTemplate();
  }

  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const presenter = new DetailPresenter({
      view: this._view,
      model: this._model,
      authModel: this._authModel,
      id: url.id,
    });
    
    await presenter.init();
  }
}

export default DetailPage;