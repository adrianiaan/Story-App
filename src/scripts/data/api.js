import CONFIG from '../config';

const API_ENDPOINT = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  GET_DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
};

class StoryApiService {
  static async register({ name, email, password }) {
    const response = await fetch(API_ENDPOINT.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    
    return response.json();
  }

  static async login({ email, password }) {
    const response = await fetch(API_ENDPOINT.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    
    return response.json();
  }

  static async getAllStories(token, options = {}) {
    let url = API_ENDPOINT.GET_ALL_STORIES;
    
    // Tambahkan parameter query jika ada
    if (Object.keys(options).length > 0) {
      const queryParams = new URLSearchParams();
      
      if (options.location) {
        queryParams.append('location', '1');
      }
      
      if (options.size) {
        queryParams.append('size', options.size);
      }
      
      if (options.page) {
        queryParams.append('page', options.page);
      }
      
      url = `${url}?${queryParams.toString()}`;
    }
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.json();
  }

  static async getDetailStory(id, token) {
    const response = await fetch(API_ENDPOINT.GET_DETAIL_STORY(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.json();
  }

  static async addStory(formData, token) {
    const response = await fetch(API_ENDPOINT.ADD_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    return response.json();
  }
}

export default StoryApiService;