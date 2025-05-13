import StoryApiService from '../../data/api';

class StoryModel {
  constructor() {
    this._stories = [];
    this._currentStory = null;
  }

  async getAllStories(token, options = {}) {
    try {
      const response = await StoryApiService.getAllStories(token, options);
      if (!response.error) {
        this._stories = response.listStory;
        return {
          error: false,
          stories: this._stories
        };
      }
      return {
        error: true,
        message: response.message
      };
    } catch (error) {
      return {
        error: true,
        message: 'Terjadi kesalahan saat mengambil data cerita'
      };
    }
  }

  async getDetailStory(id, token) {
    try {
      const response = await StoryApiService.getDetailStory(id, token);
      if (!response.error) {
        this._currentStory = response.story;
        return {
          error: false,
          story: this._currentStory
        };
      }
      return {
        error: true,
        message: response.message
      };
    } catch (error) {
      return {
        error: true,
        message: 'Terjadi kesalahan saat mengambil detail cerita'
      };
    }
  }

  async addStory(formData, token) {
    try {
      const response = await StoryApiService.addStory(formData, token);
      return response;
    } catch (error) {
      return {
        error: true,
        message: 'Terjadi kesalahan saat menambahkan cerita'
      };
    }
  }
}

export default StoryModel;