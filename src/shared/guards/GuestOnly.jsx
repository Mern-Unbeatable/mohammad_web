import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/modules/auth';
import SessionCheckingFallback from './SessionCheckingFallback';

/**
 * Blocks authenticated users from guest pages (login / register).
 */
const GuestOnly = () => {
  const { isAuthenticated, homePath, sessionReady } = useAuth();

  if (!sessionReady) {
    return <SessionCheckingFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to={homePath} replace />;
  }

  return <Outlet />;
};

export default GuestOnly;
