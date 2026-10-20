import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  fetchPlans,
  fetchMySubscription,
  subscribe,
  cancelSubscription,
  clearSubscriptionsError,
  toSubscriptionModel,
} from '@/features/user/subscriptions';
import { fetchUserProfile, toProfilePageUser } from '@/features/user/profile';
import { planFeatures, toApiPlan, toPlanOptions } from '../utils/plans';
import {
  canCancel,
  cancelSuccessMessage,
  hasMembershipEnded,
  isAlreadyOnPlan,
  showCancelButton,
  subscribeLabel,
} from '../utils/subscriptionStatus';
import { SUBSCRIPTION_STATUS } from '../constant/constants';
import { useBillingCycle } from './useBillingCycle';
import { useCheckoutReturn } from './useCheckoutReturn';

/** Plans, current subscription, billing cycle, subscribe and cancel. */
export const useSubscriptionPage = () => {
  const dispatch = useDispatch();
  const { plans, plansLoading, saving, subscription, loading, error } = useSelector(
    (state) => state.userSubscriptions,
  );
  const { user } = useSelector((state) => state.userProfile);
  const profileUser = useMemo(() => toProfilePageUser(user), [user]);
  const planOptions = useMemo(() => toPlanOptions(plans), [plans]);
  const currentSub = useMemo(
    () => toSubscriptionModel(subscription || profileUser?.raw?.subscription),
    [subscription, profileUser],
  );
  const [cycle, setCycle] = useBillingCycle({ planOptions, subscriptionPlan: currentSub?.plan });
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  useEffect(() => {
    dispatch(clearSubscriptionsError());
    dispatch(fetchPlans());
    dispatch(fetchMySubscription());
    if (!user) dispatch(fetchUserProfile());
  }, [dispatch, user]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useCheckoutReturn();

  const plan = planOptions?.[cycle];
  const alreadyOnPlan = isAlreadyOnPlan(currentSub, cycle);
  const cancellable = canCancel(currentSub);

  const startCheckout = async () => {
    if (alreadyOnPlan || saving) return;
    const result = await dispatch(subscribe(toApiPlan(cycle)));
    if (!subscribe.fulfilled.match(result)) return;

    const payment = result.payload?.payment;
    if (payment?.checkoutUrl) {
      toast('Redirecting to Stripe Checkout…');
      window.location.assign(payment.checkoutUrl);
      return;
    }

    toast.error('Checkout session could not be started. Try again.');
  };

  const confirmCancel = async () => {
    if (!cancellable || saving) return;
    const result = await dispatch(cancelSubscription());
    if (cancelSubscription.fulfilled.match(result)) {
      setConfirmCancelOpen(false);
      toast.success(cancelSuccessMessage(currentSub));
      dispatch(fetchMySubscription());
      dispatch(fetchUserProfile());
    }
  };

  return {
    showBanner: Boolean(loading || profileUser),
    currentSub,
    trialDaysLeft: currentSub?.trialDaysLeft ?? profileUser?.trialDaysLeft ?? 0,
    paymentConfigured: plans?.paymentConfigured !== false,
    plansLoading: plansLoading && !planOptions,
    planOptions,
    plan,
    features: planFeatures(plans, plan),
    cycle,
    setCycle,
    saving,
    alreadyOnPlan,
    subscribeLabel: subscribeLabel({ sub: currentSub, cycle, plan }),
    startCheckout,
    showCancel: cancellable && showCancelButton(currentSub),
    membershipEnded: hasMembershipEnded(currentSub),
    isTrial: currentSub?.status === SUBSCRIPTION_STATUS.TRIAL,
    confirmCancelOpen,
    openCancel: () => setConfirmCancelOpen(true),
    closeCancel: () => {
      if (!saving) setConfirmCancelOpen(false);
    },
    confirmCancel,
  };
};
