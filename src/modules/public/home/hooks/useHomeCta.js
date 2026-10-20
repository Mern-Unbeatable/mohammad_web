import { useAuth } from '@/modules/auth';
import { JOIN_PATH } from '../constant/constants';

/** Primary call-to-action target: the member's home when signed in as a user, else sign-up. */
export const useHomeCta = () => {
  const { isUser, homePath } = useAuth();
  return { isMember: isUser, to: isUser ? homePath : JOIN_PATH };
};
