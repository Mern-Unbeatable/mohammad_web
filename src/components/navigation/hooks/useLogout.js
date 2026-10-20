import { useNavigate } from 'react-router';
import { useAuth } from '@/shared/auth/useAuth';
import { LOGIN_PATH } from '../constant/constants';

/** Logs out and, on success, replaces the current entry with the login page. */
export function useLogout() {
  const { logout, loggingOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (await logout()) navigate(LOGIN_PATH, { replace: true });
  };

  return { handleLogout, loggingOut };
}
