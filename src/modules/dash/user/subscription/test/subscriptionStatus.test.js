import { describe, expect, it } from 'vitest';
import {
  canCancel,
  hasMembershipEnded,
  isAlreadyOnPlan,
  showCancelButton,
  statusBanner,
  subscribeLabel,
} from '../utils/subscriptionStatus';

const active = { status: 'ACTIVE', plan: 'MONTHLY', cancelAtPeriodEnd: false };
const cancelling = { status: 'CANCELLED', plan: 'MONTHLY', cancelAtPeriodEnd: true, isActive: true };

describe('subscription status', () => {
  it('detects the current plan', () => {
    expect(isAlreadyOnPlan(active, 'monthly')).toBe(true);
    expect(isAlreadyOnPlan(active, 'yearly')).toBe(false);
    expect(isAlreadyOnPlan(cancelling, 'monthly')).toBe(false);
  });

  it('labels the subscribe button', () => {
    const plan = { label: 'Yearly', subscribeLabel: 'Start yearly' };
    expect(subscribeLabel({ sub: active, cycle: 'monthly', plan })).toBe('Current plan');
    expect(subscribeLabel({ sub: active, cycle: 'yearly', plan })).toBe('Switch to Yearly');
    expect(subscribeLabel({ sub: null, cycle: 'yearly', plan })).toBe('Start yearly');
  });

  it('allows cancelling running or cancelling memberships, but shows the button only for running ones', () => {
    expect(canCancel(cancelling)).toBe(true);
    expect(showCancelButton(cancelling)).toBe(false);
    expect(showCancelButton({ status: 'TRIAL' })).toBe(true);
    expect(canCancel({ status: 'EXPIRED' })).toBe(false);
    expect(canCancel({ status: 'PAST_DUE' })).toBe(true);
    expect(showCancelButton({ status: 'PAST_DUE' })).toBe(true);
  });

  it('detects an ended membership', () => {
    expect(hasMembershipEnded({ status: 'EXPIRED' })).toBe(true);
    expect(hasMembershipEnded({ status: 'CANCELLED', isActive: false })).toBe(true);
    expect(hasMembershipEnded(cancelling)).toBe(false);
  });
});

describe('statusBanner', () => {
  it('returns nothing without a subscription or for an expired trial', () => {
    expect(statusBanner(null, 3)).toBeNull();
    expect(statusBanner({ status: 'TRIAL' }, 0)).toBeNull();
  });

  it.each([
    [{ status: 'TRIAL' }, 3, 'warning', 'Free trial ends in 3 days'],
    [{ ...active, plan: 'YEARLY' }, 0, 'success', 'Active · Yearly membership'],
    [cancelling, 0, 'warning', 'Cancels at period end'],
    [{ status: 'EXPIRED' }, 0, 'danger', 'Membership expired'],
    [{ status: 'CANCELLED' }, 0, 'danger', 'Membership cancelled'],
    [{ status: 'PAST_DUE' }, 0, 'danger', 'Payment problem — update your payment method to restore access'],
    [
      { status: 'TRIAL', checkoutPending: true },
      5,
      'warning',
      'Payment processing — your plan activates once confirmed',
    ],
  ])('%o → %s', (sub, days, tone, text) => {
    expect(statusBanner(sub, days)).toMatchObject({ tone, text });
  });

  it('adds the access end date when cancelling', () => {
    const banner = statusBanner({ ...cancelling, accessEndsAt: '2026-11-05T00:00:00Z' }, 0);
    expect(banner.text).toMatch(/^Cancels at period end · access until \d{1,2} Nov 2026$/);
  });
});
