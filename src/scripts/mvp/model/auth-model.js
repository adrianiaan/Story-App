import StoryApiService from '../../data/api';
import AuthUtils from '../../utils/auth-utils';

class AuthModel {
  async login(credentials) {
    try {
      const response = await StoryApiService.login(credentials);
      
      if (!response.error) {
        AuthUtils.setAuth(response.loginResult.token, {
          id: response.loginResult.userId,
          name: response.loginResult.name,
        });
        return {
          error: false,
          user: {
            id: response.loginResult.userId,
            name: response.loginResult.name,
          }
        };
      }
      
      return {
        error: true,
        message: response.message
      };
    } catch (error) {
      return {
        error: true,
        message: 'Terjadi kesalahan saat login'
      };
    }
  }

  async register(userData) {
    try {
      const response = await StoryApiService.register(userData);
      return response;
    } catch (error) {
      return {
        error: true,
        message: 'Terjadi kesalahan saat registrasi'
      };
    }
  }

  logout() {
    AuthUtils.destroyAuth();
    return { error: false };
  }

  isLoggedIn() {
    return AuthUtils.isLoggedIn();
  }

  getAuth() {
    return AuthUtils.getAuth();
  }
}

export default AuthModel;