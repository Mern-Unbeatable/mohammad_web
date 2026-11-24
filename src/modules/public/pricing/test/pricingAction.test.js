import { describe, expect, it } from 'vitest';
import { pricingAction } from '../utils/pricingAction';

describe('pricingAction', () => {
  it('sends guests to sign up', () => {
    expect(pricingAction({ isAuthenticated: false })).toEqual({ label: 'Get started', to: '/join' });
  });

  it('sends members to their subscription page for checkout', () => {
    expect(pricingAction({ isAuthenticated: true, isUser: true, homePath: '/feed' })).toEqual({
      label: 'Choose this plan',
      to: '/subscription',
    });
  });

  it('sends suppliers and admins to their dashboard', () => {
    expect(
      pricingAction({ isAuthenticated: true, isUser: false, homePath: '/supplier/dashboard' }),
    ).toEqual({ label: 'Go to Dashboard', to: '/supplier/dashboard' });
  });
});
