import { useAuth } from '@/modules/auth';
import { JOIN_PATH } from '../constant/constants';

/**
 * Primary call-to-action: signed-in users go to their feed, suppliers and
 * admins to their dashboard, guests to sign-up. `kind` is 'feed' | 'dashboard' | 'join'.
 */
export const useHomeCta = () => {
  const { isAuthenticated, isUser, homePath } = useAuth();
  if (!isAuthenticated) return { kind: 'join', isMember: false, to: JOIN_PATH };
  return { kind: isUser ? 'feed' : 'dashboard', isMember: true, to: homePath };
};
