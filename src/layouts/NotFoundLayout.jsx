import { useAuth } from '@/modules/auth';
import { USER_ROLES } from '@/shared/constants/roles';
import SessionCheckingFallback from '@/components/loader/fallbacks/SessionCheckingFallback';
import DashboardPage from '@/components/layout/DashboardPage';
import NotFound from '@/modules/error/NotFound';
import PanelNotFound from '@/modules/error/PanelNotFound';
import RootLayout from './RootLayout';
import UserLayout from './UserLayout';

/**
 * Catch-all for URLs no route group claims. Signed-in members (USER role) stay
 * inside their dashboard shell; everyone else gets the public 404. Supplier
 * and admin panels have their own in-panel `*` routes under `/supplier` and `/admin`.
 */
const NotFoundLayout = () => {
  const { isAuthenticated, role, sessionReady } = useAuth();

  if (!sessionReady) {
    return <SessionCheckingFallback />;
  }

  if (isAuthenticated && role === USER_ROLES.USER) {
    return (
      <UserLayout>
        <DashboardPage width="narrow">
          <PanelNotFound />
        </DashboardPage>
      </UserLayout>
    );
  }

  return (
    <RootLayout>
      <NotFound />
    </RootLayout>
  );
};

export default NotFoundLayout;
