import { createStoryDetailTemplate } from "../../templates/template-creator";
import { initMap } from "../../utils/map-initializer";

class DetailView {
  constructor() {
    this._storyContainer = null;
    this._mapContainer = null;
  }

  redirectToLogin() {
    window.location.hash = "#/login";
  }

  getTemplate() {
    return `
      <div class="container">
        <div id="story" class="story"></div>
        <div id="storyMap" class="story-map"></div>
      </div>
    `;
  }

  initElements() {
    this._storyContainer = document.querySelector("#story");
    this._mapContainer = document.querySelector("#storyMap");
  }

  showLoading() {
    this._storyContainer.innerHTML =
      '<div class="story__not-found">Memuat cerita...</div>';
  }

  showStory(story) {
    this._storyContainer.innerHTML = createStoryDetailTemplate(story);

    if (story.lat && story.lon) {
      this._mapContainer.style.display = "block";
      initMap(
        "storyMap",
        [story.lat, story.lon],
        story.name,
        true // Aktifkan kontrol layer
      );
    } else {
      this._mapContainer.style.display = "none";
    }
  }

  showError(message) {
    this._storyContainer.innerHTML = `<div class="story__not-found">${message}</div>`;
    this._mapContainer.style.display = "none";
  }
}

export default DetailView;
