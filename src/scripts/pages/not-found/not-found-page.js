import NotFoundView from '../../mvp/view/not-found-view';
import NotFoundPresenter from '../../mvp/presenter/not-found-presenter';

class NotFoundPage {
  async render() {
    return `
      <div class="container">
        <div id="not-found-content"></div>
      </div>
    `;
  }

  async afterRender() {
    const view = new NotFoundView();
    new NotFoundPresenter({ view });
  }
}

export default NotFoundPage;