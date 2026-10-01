import { Navigate, Outlet, useLocation, useMatches } from 'react-router';
import { roleHomePath } from '@/shared/constants/roles';
import { useAuth } from '@/shared/auth/useAuth';

/**
 * Protects panel routes. Redirects unauthenticated users to login and
 * wrong-role users to their role home, or to the equivalent page when a
 * matched route provides `handle.roleRedirect(pathname, role)`.
 */
const RequireRole = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, role, sessionReady } = useAuth();
  const location = useLocation();
  const matches = useMatches();

  if (!sessionReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[#64748B]">
        Checking session…
      </div>
    );
  }

  // Missing or unknown role is treated as unauthenticated
  if (!isAuthenticated || !user || !role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const userRole = role.toUpperCase();
  const normalizedAllowed = allowedRoles.map((r) => String(r).toUpperCase());

  if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(userRole)) {
    const roleRedirect = matches.findLast((m) => m.handle?.roleRedirect)?.handle.roleRedirect;
    const equivalent = roleRedirect?.(location.pathname, userRole);
    return (
      <Navigate
        to={equivalent ? `${equivalent}${location.search}` : roleHomePath(userRole)}
        replace
      />
    );
  }

  return <Outlet />;
};

export default RequireRole;
