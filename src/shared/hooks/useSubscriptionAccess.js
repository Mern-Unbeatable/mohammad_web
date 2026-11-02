import { useSelector } from 'react-redux';

/**
 * Reads the authenticated member's subscription from the store and derives
 * whether premium access is currently allowed. The freshest source wins: the
 * subscription slice (updated after subscribe/cancel) falls back to the profile
 * payload loaded on app start.
 *
 * `isActive` is taken from the backend-serialized value (true for an unexpired
 * trial, an active paid plan, or a cancelled plan still inside its period;
 * false for PAST_DUE / EXPIRED). While the subscription is still loading we do
 * not lock anything — the backend stays authoritative.
 */
export const useSubscriptionAccess = () => {
  const subscription = useSelector(
    (state) =>
      state.userSubscriptions?.subscription ||
      state.userProfile?.user?.subscription ||
      null,
  );

  const loaded = subscription != null;
  const status = String(subscription?.status || '').toUpperCase();
  const isActive = subscription
    ? Boolean(subscription.isActive ?? ['ACTIVE', 'TRIAL'].includes(status))
    : true;

  return {
    subscription,
    status,
    loaded,
    isActive,
    isLocked: loaded && !isActive,
  };
};

export default useSubscriptionAccess;
