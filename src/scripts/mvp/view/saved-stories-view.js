import { createStoryItemTemplate } from "../../templates/template-creator";

class SavedStoriesView {
  constructor() {
    this._container = null;
  }

  redirectToLogin() {
    window.location.hash = "#/login";
  }

  getTemplate() {
    return `
      <div class="content container">
        <h2 class="content__heading">Cerita Tersimpan</h2>
        <div id="saved-stories" class="stories">
        </div>
      </div>
    `;
  }

  initElements() {
    this._container = document.querySelector("#saved-stories");
  }

  showLoading() {
    this._container.innerHTML = '<div class="story-item__not-found">Memuat cerita tersimpan...</div>';
  }

  showStories(stories) {
    this._container.innerHTML = "";

    if (stories.length > 0) {
      stories.forEach((story) => {
        const storyElement = document.createElement('div');
        storyElement.innerHTML = createStoryItemTemplate(story);
        
        // Tambahkan tombol hapus
        const removeButton = document.createElement('button');
        removeButton.className = 'btn-remove-saved';
        removeButton.setAttribute('data-id', story.id);
        removeButton.innerHTML = '<i class="fas fa-trash"></i> Hapus';
        removeButton.style.marginTop = '10px';
        
        const storyItem = storyElement.querySelector('.story-item');
        const content = storyItem.querySelector('.story-item__content');
        content.appendChild(removeButton);
        
        this._container.appendChild(storyItem);
      });
    } else {
      this._container.innerHTML = '<div class="story-item__not-found">Belum ada cerita tersimpan</div>';
    }
  }

  showError(message) {
    this._container.innerHTML = `<div class="story-item__not-found">${message}</div>`;
  }

  bindRemoveSavedStory(handler) {
    this._container.addEventListener('click', (event) => {
      if (event.target.classList.contains('btn-remove-saved') || 
          event.target.closest('.btn-remove-saved')) {
        const button = event.target.classList.contains('btn-remove-saved') 
          ? event.target 
          : event.target.closest('.btn-remove-saved');
        const id = button.getAttribute('data-id');
        if (id && handler) {
          handler(id);
        }
      }
    });
  }
}

export default SavedStoriesView;
