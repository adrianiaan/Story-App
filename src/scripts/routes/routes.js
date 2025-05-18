import HomePage from '../pages/home/home-page';
import DetailPage from '../pages/detail/detail-page';
import AddPage from '../pages/add/add-page';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page';
import AboutPage from '../pages/about/about-page';
import NotFoundPage from '../pages/not-found/not-found-page';


const routes = {
  '/': new HomePage(),
  '/detail/:id': new DetailPage(),
  '/add': new AddPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/about': new AboutPage(),
  '/not-found': new NotFoundPage(),
};

export default routes;