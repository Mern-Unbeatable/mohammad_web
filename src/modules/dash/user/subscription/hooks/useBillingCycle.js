import { useState } from 'react';
import { resolveCycle, subscriptionCycle } from '../utils/plans';

/**
 * Selected billing cycle. A user's choice holds until the current plan changes
 * (e.g. after checkout), which resets the selection to that plan.
 */
export const useBillingCycle = ({ planOptions, subscriptionPlan }) => {
  const planKey = subscriptionCycle(subscriptionPlan);
  const [choice, setChoice] = useState({ planKey, cycle: null });
  const chosen = choice.planKey === planKey ? choice.cycle : null;

  const cycle = resolveCycle({ chosen, subscriptionPlan, planOptions });
  const setCycle = (next) => setChoice({ planKey, cycle: next });

  return [cycle, setCycle];
};
