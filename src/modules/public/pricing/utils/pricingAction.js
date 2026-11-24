import { SUBSCRIPTION_PATH } from '@/modules/dash/user/subscription/constant/constants';
import { JOIN_PATH } from '../constant/constants';

/**
 * Plan button: guests sign up, members (USER) continue to their subscription page,
 * where checkout happens; suppliers and admins have no membership and go home.
 */
export const pricingAction = ({ isAuthenticated, isUser, homePath }) => {
  if (!isAuthenticated) return { label: 'Get started', to: JOIN_PATH };
  if (isUser) return { label: 'Choose this plan', to: SUBSCRIPTION_PATH };
  return { label: 'Go to Dashboard', to: homePath };
};
