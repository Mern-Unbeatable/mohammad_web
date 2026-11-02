import { Outlet } from 'react-router';
import { PublicNavbar } from '@/components/navigation';
import AppFooter from '@/components/navigation/footer/AppFooter';

/** Public site shell. `children` replaces the outlet when rendered outside the route tree (catch-all). */
const RootLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col">
    <header className="sticky top-0 z-[70]">
      <PublicNavbar />
    </header>
    <main className="flex flex-1 flex-col">{children ?? <Outlet />}</main>
    <AppFooter />
  </div>
);

export default RootLayout;
