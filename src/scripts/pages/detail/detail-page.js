import UrlParser from "../../routes/url-parser";
import StoryApiService from "../../data/api";
import AuthUtils from "../../utils/auth-utils";
import { createStoryDetailTemplate } from "../../templates/template-creator";
import { initMap } from "../../utils/map-initializer";

export default class DetailPage {
  async render() {
    return `
      <div class="container">
        <div id="story" class="story"></div>
        <div id="storyMap" class="story-map"></div>
      </div>
    `;
  }

  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const storyContainer = document.querySelector("#story");
    const mapContainer = document.querySelector("#storyMap");

    storyContainer.innerHTML =
      '<div class="story__not-found">Memuat cerita...</div>';

    try {
      const { token } = AuthUtils.getAuth();

      if (!token) {
        window.location.href = "#/login";
        return;
      }

      const response = await StoryApiService.getDetailStory(url.id, token);

      if (!response.error) {
        storyContainer.innerHTML = createStoryDetailTemplate(response.story);

        if (response.story.lat && response.story.lon) {
          mapContainer.style.display = "block";
          initMap(
            "storyMap",
            [response.story.lat, response.story.lon],
            response.story.name,
            true // Aktifkan kontrol layer
          );
        } else {
          mapContainer.style.display = "none";
        }
      } else {
        storyContainer.innerHTML = `<div class="story__not-found">${response.message}</div>`;
      }
    } catch (error) {
      storyContainer.innerHTML =
        '<div class="story__not-found">Error: Tidak dapat memuat cerita</div>';
    }
  }
}
