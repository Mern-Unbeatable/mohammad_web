import { Outlet } from 'react-router';
import NavbarLayout from '@/modules/public/layout/NavbarLayout';
import AppFooter from '@/shared/layout/FooterLayout';
import ScrollToTop from '@/shared/routing/ScrollToTop';

const RootLayout = () => (
  <>
    <ScrollToTop />
    <header>
      <NavbarLayout />
    </header>
    <main>
      <Outlet />
    </main>
    <footer>
      <AppFooter />
    </footer>
  </>
);

export default RootLayout;
