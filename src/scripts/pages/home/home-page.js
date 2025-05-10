import StoryApiService from '../../data/api';
import AuthUtils from '../../utils/auth-utils';
import { createStoryItemTemplate } from '../../templates/template-creator';

export default class HomePage {
  async render() {
    return `
      <div class="content container">
        <h2 class="content__heading">Cerita Terbaru</h2>
        <div id="stories" class="stories">
        </div>
        <div class="add-story-button">
          <a href="#/add" class="btn btn-primary">Tambah Cerita</a>
        </div>
      </div>
    `;
  }

  async afterRender() {
    const storiesContainer = document.querySelector('#stories');
    storiesContainer.innerHTML = '<div class="story-item__not-found">Memuat cerita...</div>';

    try {
      const { token } = AuthUtils.getAuth();
      
      if (!token) {
        window.location.href = '#/login';
        return;
      }
      
      const response = await StoryApiService.getAllStories(token);
      
      if (!response.error) {
        storiesContainer.innerHTML = '';
        
        if (response.listStory.length > 0) {
          response.listStory.forEach((story) => {
            storiesContainer.innerHTML += createStoryItemTemplate(story);
          });
        } else {
          storiesContainer.innerHTML = '<div class="story-item__not-found">Tidak ada cerita yang ditemukan</div>';
        }
      } else {
        storiesContainer.innerHTML = `<div class="story-item__not-found">${response.message}</div>`;
      }
    } catch (error) {
      storiesContainer.innerHTML = '<div class="story-item__not-found">Error: Tidak dapat memuat cerita</div>';
    }
  }
}