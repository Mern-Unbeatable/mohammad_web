import { Outlet } from 'react-router';
import { PublicNavbar } from '@/components/navigation';
import AppFooter from '@/components/navigation/footer/AppFooter';
import ScrollToTop from '@/components/common/scrolls/ScrollToTop';

const RootLayout = () => (
  <>
    <ScrollToTop />
    <header>
      <PublicNavbar />
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
