import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/modules/auth';
import { clearSubscriptionsError, fetchPlans } from '@/features/dash/user/subscriptions';
import { useBillingCycle } from '@/modules/dash/user/subscription/hooks/useBillingCycle';
import { planFeatures, toPlanOptions } from '@/modules/dash/user/subscription/utils/plans';
import { pricingAction } from '../utils/pricingAction';

/** Public plans with a billing-cycle toggle; no subscription or checkout state. */
export const usePublicPricing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();
  const { plans, plansLoading, error } = useSelector((state) => state.userSubscriptions);
  const planOptions = useMemo(() => toPlanOptions(plans), [plans]);
  const [cycle, setCycle] = useBillingCycle({ planOptions, subscriptionPlan: null });
  const action = pricingAction(auth);

  const load = useCallback(() => {
    dispatch(clearSubscriptionsError());
    dispatch(fetchPlans());
  }, [dispatch]);

  useEffect(load, [load]);

  const plan = planOptions?.[cycle];
  return {
    loading: plansLoading && !planOptions,
    error: planOptions ? null : error,
    retry: load,
    planOptions,
    plan,
    features: planFeatures(plans, plan),
    cycle,
    setCycle,
    actionLabel: action.label,
    onAction: () => navigate(action.to),
  };
};
