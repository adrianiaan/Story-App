import HomePage from '../pages/home/home-page';
import DetailPage from '../pages/detail/detail-page';
import AddPage from '../pages/add/add-page';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page';
import AboutPage from '../pages/about/about-page';
import NotFoundPage from '../pages/not-found/not-found-page';
import SavedStoriesPage from '../pages/saved-stories/saved-stories-page';



const routes = {
  '/': new HomePage(),
  '/detail/:id': new DetailPage(),
  '/add': new AddPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/about': new AboutPage(),
  '/not-found': new NotFoundPage(),
  '/saved': new SavedStoriesPage(),
};

export default routes;