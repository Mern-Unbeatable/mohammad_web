import { Outlet } from 'react-router';
import ScrollToTop from '@/components/common/scrolls/ScrollToTop';

/** Router root: behaviour shared by every route group, no markup of its own. */
const AppRootLayout = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

export default AppRootLayout;
