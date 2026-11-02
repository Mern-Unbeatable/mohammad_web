import { useNavigate } from 'react-router';
import { useAuth } from '@/modules/auth';

/**
 * Auth state for the public navbar. Logging out returns to the home page
 * (unlike `useLogout`, which goes to the login page).
 */
export const usePublicAuthActions = ({ onNavigate }) => {
  const { isAuthenticated, isSupplier, isAdmin, homePath, logout, loggingOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!(await logout())) return;
    onNavigate?.();
    navigate('/', { replace: true });
  };

  return {
    isAuthenticated,
    isSupplierOrAdmin: isSupplier || isAdmin,
    homePath,
    loggingOut,
    handleLogout,
  };
};
