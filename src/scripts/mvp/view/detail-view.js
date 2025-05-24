import { createStoryDetailTemplate } from "../../templates/template-creator";
import { initMap } from "../../utils/map-initializer";

class DetailView {
  constructor() {
    this._storyContainer = null;
    this._mapContainer = null;
    this._bookmarkButton = null;
    this._onBookmarkClick = null;
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

  
// Modifikasi showStory untuk menerima parameter isSaved dan render tombol bookmark
showStory(story, isSaved) {
  this._storyContainer.innerHTML = createStoryDetailTemplate(story) + this._createBookmarkButton(isSaved);
  this._bookmarkButton = this._storyContainer.querySelector('#bookmark-button');
  this._bindBookmarkClick();

  if (story.lat && story.lon) {
    this._mapContainer.style.display = "block";
    initMap(
      "storyMap",
      [story.lat, story.lon],
      story.name,
      true
    );
  } else {
    this._mapContainer.style.display = "none";
  }
}

// Fungsi untuk membuat tombol bookmark dengan ikon sesuai status
_createBookmarkButton(isSaved) {
  const iconClass = isSaved ? 'fas' : 'far'; // solid or outline
  return `
    <button id="bookmark-button" aria-label="Simpan Cerita" title="Simpan Cerita">
      <i class="${iconClass} fa-bookmark"></i>
    </button>
  `;
}

// Bind event klik tombol bookmark
_bindBookmarkClick() {
  if (this._bookmarkButton) {
    this._bookmarkButton.addEventListener('click', () => {
      if (this._onBookmarkClick) {
        this._onBookmarkClick();
      }
    });
  }
}

// Fungsi untuk mengikat handler klik bookmark dari presenter
bindBookmarkClick(handler) {
  this._onBookmarkClick = handler;
}

  showError(message) {
    this._storyContainer.innerHTML = `<div class="story__not-found">${message}</div>`;
    this._mapContainer.style.display = "none";
  }
}

export default DetailView;
