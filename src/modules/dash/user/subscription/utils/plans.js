import { toPlansList } from '@/features/dash/user/subscriptions';
import { CYCLE, DEFAULT_CYCLE, PLAN_API } from '../constant/constants';

export const cycleKey = (planId) => String(planId).toLowerCase();

/** Plans keyed by lower-case id (`monthly`, `yearly`), or null when none loaded. */
export const toPlanOptions = (plans) => {
  const list = toPlansList(plans);
  return list.length ? Object.fromEntries(list.map((plan) => [cycleKey(plan.id), plan])) : null;
};

/** Shared feature list, falling back to the selected plan's own list. */
export const planFeatures = (plans, plan) =>
  (Array.isArray(plans?.features) && plans.features) || plan?.features || [];

export const toApiPlan = (cycle) => PLAN_API[cycle] || String(cycle).toUpperCase();

/** Cycle of the member's current plan, if it is one we offer as a toggle. */
export const subscriptionCycle = (plan) => {
  if (!plan) return null;
  const key = cycleKey(plan);
  return key === CYCLE.MONTHLY || key === CYCLE.YEARLY ? key : null;
};

/**
 * Cycle to show: the user's choice, else the current plan's cycle, else monthly;
 * replaced by the first offered plan when the server doesn't offer it.
 */
export const resolveCycle = ({ chosen, subscriptionPlan, planOptions }) => {
  const preferred = chosen ?? subscriptionCycle(subscriptionPlan) ?? DEFAULT_CYCLE;
  if (!planOptions || planOptions[preferred]) return preferred;
  return Object.keys(planOptions)[0] ?? preferred;
};
