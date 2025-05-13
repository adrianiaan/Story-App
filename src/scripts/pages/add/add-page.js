import AddStoryView from '../../mvp/view/add-story-view';
import StoryModel from '../../mvp/model/story-model';
import AuthModel from '../../mvp/model/auth-model';
import AddStoryPresenter from '../../mvp/presenter/add-story-presenter';

class AddPage {
  constructor() {
    this._view = new AddStoryView();
    this._model = new StoryModel();
    this._authModel = new AuthModel();
    this._presenter = null;
  }

  async render() {
    return this._view.getTemplate();
  }

  async afterRender() {
    // Inisialisasi presenter
    this._presenter = new AddStoryPresenter({
      view: this._view,
      model: this._model,
      authModel: this._authModel
    });
  }

  // Metode untuk membersihkan sumber daya saat halaman tidak lagi digunakan
  beforeUnload() {
    if (this._presenter) {
      this._presenter.destroy();
      this._presenter = null;
    }
  }
}

export default AddPage;