import { SUBSCRIPTION_STATUS } from '../constant/constants';
import { toApiPlan } from './plans';

const { TRIAL, ACTIVE, CANCELLED, EXPIRED } = SUBSCRIPTION_STATUS;

const formatAccessDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Active, not cancelling, and already on the selected cycle. */
export const isAlreadyOnPlan = (sub, cycle) =>
  sub?.status === ACTIVE &&
  !sub?.cancelAtPeriodEnd &&
  String(sub?.plan || '').toUpperCase() === toApiPlan(cycle);

export const canCancel = (sub) =>
  sub?.status === ACTIVE ||
  sub?.status === TRIAL ||
  (sub?.status === CANCELLED && sub?.cancelAtPeriodEnd);

/** The Cancel button only shows for a running trial or membership. */
export const showCancelButton = (sub) =>
  (sub?.status === ACTIVE || sub?.status === TRIAL) && !sub?.cancelAtPeriodEnd;

export const hasMembershipEnded = (sub) =>
  sub?.status === EXPIRED || (sub?.status === CANCELLED && !sub?.isActive);

export const subscribeLabel = ({ sub, cycle, plan }) => {
  if (isAlreadyOnPlan(sub, cycle)) return 'Current plan';
  if (sub?.status === ACTIVE || sub?.cancelAtPeriodEnd) return `Switch to ${plan?.label || 'plan'}`;
  return plan?.subscribeLabel;
};

export const cancelSuccessMessage = (sub) =>
  sub?.status === TRIAL
    ? 'Trial cancelled'
    : 'Subscription cancelled — access continues until period end';

/** Banner `{ tone, icon, text }` for the current subscription, or null. */
export const statusBanner = (sub, trialDaysLeft) => {
  if (!sub) return null;
  const { status, cancelAtPeriodEnd, accessEndsAt, plan } = sub;

  if (status === TRIAL && trialDaysLeft > 0) {
    return { tone: 'warning', icon: 'clock', text: `Free trial ends in ${trialDaysLeft} days` };
  }
  if (status === ACTIVE && !cancelAtPeriodEnd) {
    return {
      tone: 'success',
      text: `Active · ${plan === 'YEARLY' ? 'Yearly' : 'Monthly'} membership`,
    };
  }
  if (status === CANCELLED && cancelAtPeriodEnd) {
    return {
      tone: 'warning',
      text: `Cancels at period end${
        accessEndsAt ? ` · access until ${formatAccessDate(accessEndsAt)}` : ''
      }`,
    };
  }
  if (status === EXPIRED || status === CANCELLED) {
    return {
      tone: 'danger',
      text: status === EXPIRED ? 'Membership expired' : 'Membership cancelled',
    };
  }
  return null;
};
