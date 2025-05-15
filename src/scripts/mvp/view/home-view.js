import { createStoryItemTemplate } from "../../templates/template-creator";
import { initMapWithMarkers } from "../../utils/map-initializer";

class HomeView {
  constructor() {
    this._storiesContainer = null;
    this._mapContainer = null;
  }

  redirectToLogin() {
    window.location.hash = "#/login";
  }

  getTemplate() {
    return `
      <div class="content container">
        <h2 class="content__heading">Cerita Terbaru</h2>
        
        <!-- Tambahkan container untuk peta -->
        <div class="map-section">
          <h3>Peta Lokasi Cerita</h3>
          <div id="storiesMap" class="stories-map"></div>
        </div>
        
        <div id="stories" class="stories">
        </div>
        <div class="add-story-button">
          <a href="#/add" class="btn btn-primary">Tambah Cerita</a>
        </div>
      </div>
    `;
  }

  initElements() {
    this._storiesContainer = document.querySelector("#stories");
    this._mapContainer = document.querySelector("#storiesMap");
  }

  showLoading() {
    this._storiesContainer.innerHTML =
      '<div class="story-item__not-found">Memuat cerita...</div>';
  }

  showStories(stories) {
    this._storiesContainer.innerHTML = "";

    if (stories.length > 0) {
      stories.forEach((story) => {
        this._storiesContainer.innerHTML += createStoryItemTemplate(story);
      });
    } else {
      this._storiesContainer.innerHTML =
        '<div class="story-item__not-found">Tidak ada cerita yang ditemukan</div>';
    }
  }

  showStoriesMap(stories) {
    const storiesWithLocation = stories.filter(
      (story) => story.lat && story.lon
    );

    if (storiesWithLocation.length > 0) {
      this._mapContainer.style.display = "block";
      initMapWithMarkers("storiesMap", storiesWithLocation);
    } else {
      this._mapContainer.style.display = "none";
    }
  }

  showError(message) {
    this._storiesContainer.innerHTML = `<div class="story-item__not-found">${message}</div>`;
    this._mapContainer.style.display = "none";
  }
}

export default HomeView;
