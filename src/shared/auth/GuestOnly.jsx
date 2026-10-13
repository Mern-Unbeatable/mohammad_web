import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/shared/auth/useAuth';

/**
 * Blocks authenticated users from guest pages (login / register).
 */
const GuestOnly = () => {
  const { isAuthenticated, homePath, sessionReady } = useAuth();

  if (!sessionReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[#64748B]">
        Checking session…
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={homePath} replace />;
  }

  return <Outlet />;
};

export default GuestOnly;
