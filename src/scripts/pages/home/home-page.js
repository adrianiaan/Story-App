import AuthUtils from '../../utils/auth-utils';
import StoryApiService from '../../data/api';
import { createStoryItemTemplate } from '../../templates/template-creator';
import { initMapWithMarkers } from '../../utils/map-initializer';

export default class HomePage {
  async render() {
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

  async afterRender() {
    const storiesContainer = document.querySelector('#stories');
    const mapContainer = document.querySelector('#storiesMap');
    storiesContainer.innerHTML = '<div class="story-item__not-found">Memuat cerita...</div>';

    try {
      const { token } = AuthUtils.getAuth();
      
      if (!token) {
        window.location.href = '#/login';
        return;
      }
      
      // Dapatkan cerita dengan informasi lokasi
      const response = await StoryApiService.getAllStories(token, { location: true });
      
      if (!response.error) {
        storiesContainer.innerHTML = '';
        
        if (response.listStory.length > 0) {
          // Render daftar cerita
          response.listStory.forEach((story) => {
            storiesContainer.innerHTML += createStoryItemTemplate(story);
          });
          
          // Inisialisasi peta dengan marker untuk cerita yang memiliki lokasi
          const storiesWithLocation = response.listStory.filter(story => story.lat && story.lon);
          
          if (storiesWithLocation.length > 0) {
            mapContainer.style.display = 'block';
            initMapWithMarkers('storiesMap', storiesWithLocation);
          } else {
            mapContainer.style.display = 'none';
          }
        } else {
          storiesContainer.innerHTML = '<div class="story-item__not-found">Tidak ada cerita yang ditemukan</div>';
          mapContainer.style.display = 'none';
        }
      } else {
        storiesContainer.innerHTML = `<div class="story-item__not-found">${response.message}</div>`;
        mapContainer.style.display = 'none';
      }
    } catch (error) {
      storiesContainer.innerHTML = '<div class="story-item__not-found">Error: Tidak dapat memuat cerita</div>';
      mapContainer.style.display = 'none';
    }
  }
}