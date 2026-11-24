import { useLocation } from 'react-router';
import DashboardPage from '@/components/layout/DashboardPage';
import { useSubscriptionAccess } from '@/shared/hooks/useSubscriptionAccess';
import { isPremiumPath } from '@/shared/constants/subscriptionAccess';
import SubscriptionLimitCard from './SubscriptionLimitCard';

const LOCK_MESSAGE =
  "Your current plan no longer includes access to this feature. View our pricing plans to continue.";

/**
 * Wraps the member dashboard outlet. When the subscription is no longer active
 * (expired / past due) and the current route is a subscription-gated feature,
 * it renders the reusable Subscription Limit card in place of the feature —
 * instead of letting the page make calls the backend would reject with 403.
 *
 * Active and trial members, and all non-premium routes (subscription, profile,
 * blogs, notifications), pass straight through.
 */
const SubscriptionGate = ({ children }) => {
  const location = useLocation();
  const { isLocked } = useSubscriptionAccess();

  if (isLocked && isPremiumPath(location.pathname)) {
    return (
      <DashboardPage width="medium" spacing="relaxed">
        <SubscriptionLimitCard message={LOCK_MESSAGE} />
      </DashboardPage>
    );
  }

  return children;
};

export default SubscriptionGate;
