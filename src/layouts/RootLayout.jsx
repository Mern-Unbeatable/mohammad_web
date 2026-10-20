import { Outlet } from 'react-router';
import NavbarLayout from '@/modules/public/layout/NavbarLayout';
import AppFooter from '@/components/navigation/footer/AppFooter';
import ScrollToTop from '@/components/common/scrolls/ScrollToTop';

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
