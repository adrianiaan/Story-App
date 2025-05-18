class NotFoundPresenter {
  constructor({ view }) {
    this._view = view;
    this._showNotFoundPage();
  }

  _showNotFoundPage() {
    this._view.render();
  }
}

export default NotFoundPresenter;